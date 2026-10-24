import { NextResponse } from "next/server";
import { normalizeEmail, hashPassword } from "@/lib/auth-exclusivity";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel } from "@/lib/server/models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const { canonicalEmail } = normalizeEmail(email);
    await connectToDatabase();

    const account = await AccountModel.findOne({ canonicalEmail });
    if (!account) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    const { hash, salt } = hashPassword(newPassword);
    account.passwordHash = hash;
    account.salt = salt;
    account.updatedAt = new Date().toISOString();
    await account.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully in MongoDB database!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
