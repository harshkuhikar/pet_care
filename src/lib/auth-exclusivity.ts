import crypto from "crypto";

export interface NormalizedAccount {
  id: string;
  email: string; // raw trimmed lowercase
  canonicalEmail: string; // alias-stripped (e.g. dots & +tags removed for gmail)
  role: "user" | "admin";
  plan?: "free" | "monthly" | "yearly" | "pro" | "premium";
  passwordHash?: string;
  salt?: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalizes email address to prevent casing, spacing, and alias bypasses.
 * Handles Gmail/Googlemail dot and plus-alias tricks:
 * "John.Doe+promo@gmail.com" -> canonical: "johndoe@gmail.com"
 */
export function normalizeEmail(email: string): { email: string; canonicalEmail: string } {
  if (!email || typeof email !== "string") {
    return { email: "", canonicalEmail: "" };
  }

  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1) {
    return { email: trimmed, canonicalEmail: trimmed };
  }

  let local = trimmed.substring(0, atIndex);
  let domain = trimmed.substring(atIndex + 1);

  // Normalize googlemail.com to gmail.com
  if (domain === "googlemail.com") {
    domain = "gmail.com";
  }

  // Gmail-specific alias handling
  if (domain === "gmail.com") {
    // Strip plus addressing
    const plusIndex = local.indexOf("+");
    if (plusIndex !== -1) {
      local = local.substring(0, plusIndex);
    }
    // Remove all dots
    local = local.replace(/\./g, "");
  } else {
    // Standard plus addressing for other providers
    const plusIndex = local.indexOf("+");
    if (plusIndex !== -1) {
      local = local.substring(0, plusIndex);
    }
  }

  const canonicalEmail = `${local}@${domain}`;
  return { email: trimmed, canonicalEmail };
}

/**
 * Hashes a password using PBKDF2 with SHA-512 and a random salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

/**
 * Verifies a password against hash and salt
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  const testHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return crypto.timingSafeEqual(Buffer.from(testHash, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Generates an encrypted admin session token
 */
export function generateAdminSessionToken(adminId: string, email: string): string {
  const secret = process.env.SESSION_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable for admin token generation.");
  }
  const payload = JSON.stringify({
    adminId,
    email: normalizeEmail(email).canonicalEmail,
    role: "admin",
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(base64Payload)
    .digest("base64url");

  return `${base64Payload}.${signature}`;
}

/**
 * Verifies an admin session token
 */
export function verifyAdminSessionToken(token: string): { valid: boolean; adminId?: string; email?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }

  try {
    const [base64Payload, signature] = token.split(".");
    const secret = process.env.SESSION_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return { valid: false };

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(base64Payload)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(base64Payload, "base64url").toString());
    if (payload.role !== "admin" || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, adminId: payload.adminId, email: payload.email };
  } catch {
    return { valid: false };
  }
}
