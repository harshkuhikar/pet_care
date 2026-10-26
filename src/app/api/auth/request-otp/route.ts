import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel } from "@/lib/server/models";
import { normalizeEmail } from "@/lib/auth-exclusivity";
import { checkRateLimit, checkCooldown } from "@/lib/server/rate-limit";
import { generateOtp, storeOtp } from "@/lib/server/otp";
import { sendOtpEmail } from "@/lib/server/email";

const RequestOtpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  purpose: z.enum(["signup", "login"]).optional().default("login"),
});

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***@***";
  const visible = user.length > 2 ? user.slice(0, 2) : user[0] || "*";
  return `${visible}***@${domain}`;
}

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
  if (!origin || !host) return true; // Direct non-browser or same-origin without header
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
  const reqId = `req_${Date.now()}_${crypto.randomInt(1000, 9999)}`;

  try {
    // CSRF check
    if (!verifyOrigin(req)) {
      console.warn(`[AUTH_ORIGIN_REJECTED] [${reqId}] Origin rejected: ${req.headers.get("origin")}`);
      return NextResponse.json(
        { error: "Invalid request origin. Please refresh and try again." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      console.warn(`[AUTH_VALIDATION_FAILED] [${reqId}] Empty or non-JSON body`);
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parseResult = RequestOtpSchema.safeParse(body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || "Please enter a valid email address.";
      console.warn(`[AUTH_VALIDATION_FAILED] [${reqId}] Validation error: ${msg}`);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email: rawEmail, purpose } = parseResult.data;
    const { canonicalEmail, email: normalizedEmail } = normalizeEmail(rawEmail);
    const masked = maskEmail(normalizedEmail);
    const clientIp = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Rate Limit 1: IP limit (max 10 OTP requests per hour)
    const ipLimit = await checkRateLimit(`ip_otp_req:${clientIp}`, 10, 3600);
    if (!ipLimit.allowed) {
      console.warn(`[AUTH_RATE_LIMITED] [${reqId}] IP ${clientIp} exceeded hourly OTP limit`);
      return NextResponse.json(
        { error: "Too many attempts from this connection. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds || 60) } }
      );
    }

    // Rate Limit 2: Cooldown between requests per email (60 seconds)
    const cooldown = await checkCooldown(`email_cooldown:${canonicalEmail}`, 60);
    if (!cooldown.allowed) {
      console.warn(`[AUTH_COOLDOWN_ACTIVE] [${reqId}] Cooldown active for ${masked}`);
      return NextResponse.json(
        { error: cooldown.message || "Please wait 60 seconds before requesting another code." },
        { status: 429, headers: { "Retry-After": String(cooldown.retryAfterSeconds || 60) } }
      );
    }

    // Rate Limit 3: Email limit (max 3 requests per 10 minutes)
    const emailLimit = await checkRateLimit(`email_otp_req:${canonicalEmail}`, 3, 600);
    if (!emailLimit.allowed) {
      console.warn(`[AUTH_RATE_LIMITED] [${reqId}] ${masked} exceeded 3 OTPs / 10min`);
      return NextResponse.json(
        { error: "Too many verification requests for this email. Please try again in 10 minutes." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSeconds || 60) } }
      );
    }

    // Connect to database and check admin separation rule
    try {
      await connectToDatabase();
    } catch (dbErr: any) {
      console.error(`[AUTH_DB_CONNECT_FAILED] [${reqId}] Database connection failed:`, dbErr.message);
      return NextResponse.json(
        { error: "Unable to process your request. Please try again in a few moments." },
        { status: 500 }
      );
    }

    const existingAccount = await AccountModel.findOne({ canonicalEmail }).lean();
    const adminEmailConfig = process.env.ADMIN_EMAIL || "";
    const isAdminEmail =
      adminEmailConfig &&
      normalizeEmail(adminEmailConfig).canonicalEmail === canonicalEmail;

    if (existingAccount?.role === "admin" || isAdminEmail) {
      // Admin separation: Never send user OTP, return anti-enumeration generic response
      console.log(`[AUTH_ADMIN_EXCLUDED] [${reqId}] Excluded admin email from user OTP flow: ${masked}`);
      return NextResponse.json(
        { success: true, message: "If this email is valid, a 6-digit verification code has been sent." },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    // Generate cryptographic 6-digit code
    const code = generateOtp();

    // Store in Mongo with HMAC-SHA256 hash
    await storeOtp(canonicalEmail, code, purpose, clientIp, userAgent);

    // Send email via Resend
    const emailResult = await sendOtpEmail(normalizedEmail, code, purpose);
    if (!emailResult.success) {
      console.error(`[AUTH_EMAIL_SEND_FAILED] [${reqId}] Email delivery to ${masked} failed: ${emailResult.error}`);
      return NextResponse.json(
        { error: emailResult.error || "We couldn't send the email right now. Please try again in a minute." },
        { status: 400 }
      );
    }

    console.log(`[AUTH_OTP_SENT] [${reqId}] Verification code dispatched to ${masked} for ${purpose}`);

    return NextResponse.json(
      {
        success: true,
        message: "If this email is valid, a 6-digit verification code has been sent.",
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  } catch (err: any) {
    console.error(`[AUTH_INTERNAL_ERROR] [${reqId}] Unhandled exception in request-otp:`, err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again shortly." },
      { status: 500 }
    );
  }
}
