import { NextResponse } from "next/server";
import { normalizeEmail, verifyPassword, generateAdminSessionToken } from "@/lib/auth-exclusivity";
import { db } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { canonicalEmail } = normalizeEmail(email);
    const account = await db.getAccountByEmail(canonicalEmail);

    // If account belongs to a user, reject with generic invalid admin credentials
    if (account && account.role === "user") {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    // Must exist as admin with valid credentials
    if (!account || account.role !== "admin" || !account.passwordHash || !account.salt) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    if (account.status === "suspended") {
      return NextResponse.json(
        { error: "This admin account has been suspended." },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, account.passwordHash, account.salt);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    // Generate signed token
    const token = generateAdminSessionToken(account.id, account.email);

    // Record audit log
    await db.logAdminAction({
      adminId: account.id,
      adminEmail: account.email,
      action: "ADMIN_LOGIN_SUCCESS",
      targetType: "user",
      targetId: account.id,
      details: "Admin authenticated successfully into operations console",
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: account.id,
        email: account.email,
        role: "admin",
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set("pawswell_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during admin authentication." },
      { status: 500 }
    );
  }
}
