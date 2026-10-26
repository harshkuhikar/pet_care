import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel, SubscriptionModel } from "@/lib/server/models";
import { normalizeEmail } from "@/lib/auth-exclusivity";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { verifyOtp } from "@/lib/server/otp";
import { createSession, setSessionCookie, SanitizedUser } from "@/lib/server/session";

const VerifyOtpSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  code: z.string().trim().regex(/^\d{6}$/, "Verification code must be exactly 6 digits."),
  name: z.string().trim().max(60).optional(),
});

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

function verifyOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return true;
  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;
    if (originHost.endsWith(".vercel.app")) return true;
    if (originHost === "pet-care-zeta-three.vercel.app") return true;
    if (originHost === "localhost:3000" || originHost.startsWith("127.0.0.1")) return true;

    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL).host;
        if (originHost === siteHost) return true;
      } catch {}
    }
    return false;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    if (!verifyOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = VerifyOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { email: rawEmail, code, name } = parseResult.data;
    const { canonicalEmail, email: normalizedEmail } = normalizeEmail(rawEmail);
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Rate Limit: Max 10 verify attempts per IP per 10 minutes
    const ipLimit = await checkRateLimit(`ip_otp_verify:${clientIp}`, 10, 600);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: ipLimit.message },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds || 60) } }
      );
    }

    // Verify OTP code
    const verification = await verifyOtp(canonicalEmail, code);
    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || "Invalid verification code." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    let account = await AccountModel.findOne({ canonicalEmail });

    // Block admin email from user session issuance
    if (account && account.role === "admin") {
      return NextResponse.json(
        { error: "Administrative accounts must sign in via the Admin Portal at /admin/login." },
        { status: 403 }
      );
    }

    if (account && (account.status === "suspended" || account.status === "banned")) {
      return NextResponse.json(
        { error: "This account is suspended. Please contact support." },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();

    if (!account) {
      // Create new user account
      const displayName = name || normalizedEmail.split("@")[0] || "Pet Guardian";
      account = await AccountModel.create({
        id: "usr_" + crypto.randomUUID().replace(/-/g, ""),
        email: normalizedEmail,
        canonicalEmail,
        name: displayName,
        avatarUrl: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80`,
        role: "user",
        plan: "free",
        status: "active",
        emailVerified: true,
        lastLoginAt: now,
        tokenVersion: 1,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing account
      account.emailVerified = true;
      account.lastLoginAt = now;
      account.updatedAt = now;
      if (name && !account.name) {
        account.name = name;
      }
      await account.save();
    }

    // Create session & JWT
    const { token, sessionId } = await createSession(
      account.id,
      "user",
      account.tokenVersion || 1,
      clientIp,
      userAgent
    );

    // Fetch subscription record to determine active plan
    let plan = account.plan || "free";
    let isVIP = plan === "premium" || plan === "family" || plan === "pro";
    let planExpiresAt = account.planExpiresAt;

    const sub = await SubscriptionModel.findOne({
      accountId: account.id,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (sub) {
      if (sub.expiresAt && new Date(sub.expiresAt).getTime() < Date.now()) {
        plan = "free";
        isVIP = false;
      } else {
        plan = sub.plan;
        isVIP = plan === "premium" || plan === "family" || plan === "pro";
        planExpiresAt = sub.expiresAt;
      }
    }

    const sanitized: SanitizedUser = {
      id: account.id,
      email: account.email,
      name: account.name || account.email.split("@")[0],
      avatarUrl: account.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      role: "user",
      plan,
      isVIP,
      planExpiresAt,
      emailVerified: true,
      createdAt: account.createdAt,
    };

    const response = NextResponse.json(
      {
        success: true,
        user: sanitized,
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );

    // Set signed httpOnly session cookie
    setSessionCookie(response, token);

    return response;
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
