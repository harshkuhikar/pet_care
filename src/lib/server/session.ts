import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { connectToDatabase } from "./mongodb";
import { AccountModel, SessionModel, SubscriptionModel } from "./models";

const SESSION_COOKIE_NAME = "pawswell_session";
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set in production environment variables.");
    }
    // Fallback for dev only if not yet populated
    return new TextEncoder().encode("pawswell_dev_fallback_secret_key_32_bytes_minimum!");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  accountId: string;
  role: "user" | "admin";
  tokenVersion: number;
  sessionId: string;
}

export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: "user" | "admin";
  plan: "free" | "premium" | "family" | "pro";
  isVIP: boolean;
  planExpiresAt?: string;
  emailVerified: boolean;
  createdAt: string;
}

// 1. Create a session record in MongoDB and sign JWT
export async function createSession(
  accountId: string,
  role: "user" | "admin",
  tokenVersion: number,
  ip?: string,
  userAgent?: string
): Promise<{ token: string; sessionId: string }> {
  await connectToDatabase();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  // Store in Mongo sessions collection
  await SessionModel.create({
    sessionId,
    accountId,
    ip: ip || "unknown",
    userAgent: userAgent || "unknown",
    createdAt: new Date(),
    expiresAt,
  });

  const secretKey = getSecretKey();
  const token = await new SignJWT({
    accountId,
    role,
    tokenVersion,
    sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);

  return { token, sessionId };
}

// 2. Verify raw JWT token signature and return payload
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (
      !payload.accountId ||
      !payload.role ||
      typeof payload.tokenVersion !== "number" ||
      !payload.sessionId
    ) {
      return null;
    }

    return {
      accountId: payload.accountId as string,
      role: payload.role as "user" | "admin",
      tokenVersion: payload.tokenVersion as number,
      sessionId: payload.sessionId as string,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(cookieHeader?: string): Promise<SanitizedUser | null> {
  try {
    let sessionCookie: string | undefined;
    if (cookieHeader !== undefined) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
      sessionCookie = match ? decodeURIComponent(match[1]) : undefined;
    } else {
      const cookieStore = await cookies();
      sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }
    if (!sessionCookie) return null;

    const payload = await verifySessionToken(sessionCookie);
    if (!payload) return null;

    await connectToDatabase();

    // Check session in Mongo (revocation check)
    const activeSession = await SessionModel.findOne({
      sessionId: payload.sessionId,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!activeSession) return null;

    // Load account from Mongo
    const account = await AccountModel.findOne({
      id: payload.accountId,
    }).lean();

    if (!account) return null;

    // Verify token version and active status
    if (account.status !== "active") return null;
    if ((account.tokenVersion || 1) !== payload.tokenVersion) return null;

    // Determine current plan from active subscription
    let plan = account.plan || "free";
    let isVIP = plan === "premium" || plan === "family" || plan === "pro";
    let planExpiresAt = account.planExpiresAt;

    const subscription = await SubscriptionModel.findOne({
      accountId: account.id,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (subscription) {
      if (subscription.expiresAt && new Date(subscription.expiresAt).getTime() < Date.now()) {
        plan = "free";
        isVIP = false;
      } else {
        plan = subscription.plan;
        isVIP = plan === "premium" || plan === "family" || plan === "pro";
        planExpiresAt = subscription.expiresAt;
      }
    }

    return {
      id: account.id,
      email: account.email,
      name: account.name || account.email.split("@")[0],
      avatarUrl:
        account.avatarUrl ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      role: account.role || "user",
      plan,
      isVIP,
      planExpiresAt,
      emailVerified: Boolean(account.emailVerified),
      createdAt: account.createdAt,
    };
  } catch (err: any) {
    if (err?.digest?.includes("DYNAMIC") || err?.digest === "HANGING_PROMISE_REJECTION") {
      throw err;
    }
    console.error("Error reading session user:", err);
    return null;
  }
}

// 4. Set HttpOnly session cookie
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

// 5. Clear session cookie
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

// 6. Revoke specific session
export async function revokeSession(sessionId: string): Promise<void> {
  await connectToDatabase();
  await SessionModel.updateOne(
    { sessionId },
    { $set: { revokedAt: new Date().toISOString() } }
  );
}

// 7. Revoke all sessions for an account (increments tokenVersion)
export async function revokeAllSessionsForAccount(accountId: string): Promise<void> {
  await connectToDatabase();
  await Promise.all([
    AccountModel.updateOne(
      { id: accountId },
      { $inc: { tokenVersion: 1 }, $set: { updatedAt: new Date().toISOString() } }
    ),
    SessionModel.updateMany(
      { accountId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date().toISOString() } }
    ),
  ]);
}
