import { NextResponse } from "next/server";
import { normalizeEmail } from "@/lib/auth-exclusivity";
import { db } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, action } = body; // action: 'signup' | 'login'

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { canonicalEmail } = normalizeEmail(email);
    const existing = await db.getAccountByEmail(canonicalEmail);

    if (existing && existing.role === "admin") {
      if (action === "signup") {
        return NextResponse.json(
          {
            allowed: false,
            error: "This email cannot be used to create an account.",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            allowed: false,
            error: "Invalid credentials.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ allowed: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
