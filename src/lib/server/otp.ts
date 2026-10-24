import crypto from "crypto";
import { connectToDatabase } from "./mongodb";
import { OtpCodeModel } from "./models";

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function getHmacSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be configured in environment variables.");
    }
    return "pawswell_dev_fallback_secret_key_32_bytes_minimum!";
  }
  return secret;
}

// 1. Cryptographically secure 6-digit OTP generator
export function generateOtp(): string {
  // Generates integer between 100000 and 999999 inclusive
  return crypto.randomInt(100000, 1000000).toString();
}

// 2. HMAC-SHA256 hash using SESSION_SECRET + normalized email
export function hashOtp(email: string, code: string): string {
  const secret = getHmacSecret();
  const normalized = email.trim().toLowerCase();
  return crypto
    .createHmac("sha256", secret)
    .update(`${normalized}:${code}`)
    .digest("hex");
}

// 3. Store OTP record in MongoDB (invalidating previous codes)
export async function storeOtp(
  email: string,
  code: string,
  purpose: "signup" | "login" = "login",
  ip?: string,
  userAgent?: string
): Promise<void> {
  await connectToDatabase();
  const normalized = email.trim().toLowerCase();
  const codeHash = hashOtp(normalized, code);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate any previous unconsumed codes for this email
  await OtpCodeModel.updateMany(
    { email: normalized, consumedAt: { $exists: false } },
    { $set: { consumedAt: now.toISOString() } }
  );

  // Save new OTP record
  await OtpCodeModel.create({
    email: normalized,
    codeHash,
    purpose,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    ip: ip || "unknown",
    userAgent: userAgent || "unknown",
    createdAt: now,
    expiresAt,
  });
}

// 4. Verify OTP with constant-time comparison and attempt tracking
export async function verifyOtp(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();
  const normalized = email.trim().toLowerCase();

  const record = await OtpCodeModel.findOne({
    email: normalized,
    consumedAt: { $exists: false },
  }).sort({ createdAt: -1 });

  if (!record) {
    return {
      success: false,
      error: "Verification code expired or not found. Please request a new code.",
    };
  }

  // Check TTL expiry
  if (new Date() > new Date(record.expiresAt)) {
    record.consumedAt = new Date().toISOString();
    await record.save();
    return {
      success: false,
      error: "This code has expired. Please request a new code.",
    };
  }

  // Check attempt exhaustion
  if (record.attempts >= record.maxAttempts) {
    record.consumedAt = new Date().toISOString();
    await record.save();
    return {
      success: false,
      error: "Too many failed attempts. This code is now invalid. Please request a new one.",
    };
  }

  // Hash candidate and compare with constant-time check
  const candidateHash = hashOtp(normalized, code.trim());
  let isMatch = false;

  try {
    const bufA = Buffer.from(candidateHash, "hex");
    const bufB = Buffer.from(record.codeHash, "hex");
    if (bufA.length === bufB.length) {
      isMatch = crypto.timingSafeEqual(bufA, bufB);
    }
  } catch {
    isMatch = false;
  }

  if (!isMatch) {
    record.attempts += 1;
    const remaining = record.maxAttempts - record.attempts;
    if (record.attempts >= record.maxAttempts) {
      record.consumedAt = new Date().toISOString();
    }
    await record.save();

    if (remaining <= 0) {
      return {
        success: false,
        error: "Too many incorrect attempts. This code has been invalidated. Please request a new code.",
      };
    }

    return {
      success: false,
      error: `Incorrect verification code. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining.`,
    };
  }

  // Success: mark code consumed immediately (single-use)
  record.consumedAt = new Date().toISOString();
  await record.save();

  return { success: true };
}
