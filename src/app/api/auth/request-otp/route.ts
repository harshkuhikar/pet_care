import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel } from "@/lib/server/models";
import { normalizeEmail } from "@/lib/auth-exclusivity";
import { checkRateLimit, checkCooldown } from "@/lib/server/rate-limit";
import { generateOtp, storeOtp } from "@/lib/server/otp";
import { sendOtpEmail } from "@/lib/server/email";

const RequestOtpSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  purpose: z.enum(["signup", "login"]).optional().default("login"),
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
  if (!origin || !host) return true; // Standard requests or same-origin non-browser
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // CSRF check
    if (!verifyOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = RequestOtpSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { email: rawEmail, purpose } = parseResult.data;
    const { canonicalEmail, email: normalizedEmail } = normalizeEmail(rawEmail);
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Rate Limit 1: IP limit (max 10 OTP requests per hour)
    const ipLimit = await checkRateLimit(`ip_otp_req:${clientIp}`, 10, 3600);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: ipLimit.message },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds || 60) } }
      );
    }

    // Rate Limit 2: Cooldown between requests per email (60 seconds)
    const cooldown = await checkCooldown(`email_cooldown:${canonicalEmail}`, 60);
    if (!cooldown.allowed) {
      return NextResponse.json(
        { error: cooldown.message },
        { status: 429, headers: { "Retry-After": String(cooldown.retryAfterSeconds || 60) } }
      );
    }

    // Rate Limit 3: Email limit (max 3 requests per 10 minutes)
    const emailLimit = await checkRateLimit(`email_otp_req:${canonicalEmail}`, 3, 600);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: emailLimit.message },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSeconds || 60) } }
      );
    }

    // Check account for Admin separation rule:
    // "An admin email can NEVER sign up or log in through the user OTP flow
    // (return the same generic response as for any other unknown case, and never send an OTP for it)"
    await connectToDatabase();
    const existingAccount = await AccountModel.findOne({ canonicalEmail }).lean();

    const adminEmailConfig = process.env.ADMIN_EMAIL || "";
    const isAdminEmail =
      adminEmailConfig &&
      normalizeEmail(adminEmailConfig).canonicalEmail === canonicalEmail;

    if (existingAccount?.role === "admin" || isAdminEmail) {
      // Do NOT send user OTP; return identical anti-enumeration response
      return NextResponse.json(
        { success: true, message: "If this email is valid, a verification code has been sent." },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    // Generate cryptographic 6-digit code
    const code = generateOtp();

    // Store in Mongo with HMAC-SHA256 hash
    await storeOtp(canonicalEmail, code, purpose, clientIp, userAgent);

    // Send email via Resend
    await sendOtpEmail(normalizedEmail, code, purpose);

    // Identical anti-enumeration response
    return NextResponse.json(
      {
        success: true,
        message: "If this email is valid, a verification code has been sent.",
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  } catch (err: any) {
    console.error("Request OTP error:", err);
    return NextResponse.json(
      { error: "Unable to process your request. Please try again." },
      { status: 500 }
    );
  }
}
