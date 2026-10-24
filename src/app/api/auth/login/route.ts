import { NextResponse } from "next/server";
import { normalizeEmail, verifyPassword } from "@/lib/auth-exclusivity";
import { db } from "@/lib/server/db";
import { connectToDatabase } from "@/lib/server/mongodb";
import { UserModel } from "@/lib/server/models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { canonicalEmail, email: rawEmail } = normalizeEmail(email);

    // Look up account in MongoDB
    const account = await db.getAccountByEmail(canonicalEmail);

    if (!account) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Role exclusivity: if account is an admin, they must log in at /admin/login
    if (account.role === "admin") {
      return NextResponse.json(
        { error: "This is an administrator account. Please sign in via the Admin Portal at /admin/login." },
        { status: 403 }
      );
    }

    if (account.status === "suspended") {
      return NextResponse.json(
        { error: "This account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    // Verify password hash
    if (!account.passwordHash || !account.salt) {
      return NextResponse.json(
        { error: "Password not set for this account. Please use password reset." },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, account.passwordHash, account.salt);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Fetch user profile from MongoDB
    await connectToDatabase();
    let profile = await UserModel.findOne({
      $or: [{ id: account.id }, { email: rawEmail }],
    }).lean();

    if (!profile) {
      // Auto-create basic profile
      profile = {
        id: account.id,
        email: rawEmail,
        displayName: rawEmail.split("@")[0] || "Pet Guardian",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        role: "member",
        plan: account.plan || "free",
        joinedAt: new Date().toISOString().split("T")[0],
        newsletterSubscribed: true,
        newsletterFrequency: "weekly",
        savedArticlesCount: 0,
        petsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await UserModel.create(profile);
    }

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful from live MongoDB database!",
      user: profile,
    });

    // Set user session cookie
    response.cookies.set("pawswell_user_session", account.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: err.message || "Authentication error." },
      { status: 500 }
    );
  }
}
