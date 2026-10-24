import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSessionToken } from "@/lib/auth-exclusivity";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pawswell_admin_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { valid, adminId, email } = verifyAdminSessionToken(token);
    if (!valid || !email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const account = await db.getAccountByEmail(email);
    if (!account || account.role !== "admin" || account.status === "suspended") {
      return NextResponse.json({ authenticated: false }, { status: 403 });
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: account.id,
        email: account.email,
        role: "admin",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
