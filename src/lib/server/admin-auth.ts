import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSessionToken } from "../auth-exclusivity";
import { db } from "./db";

export async function requireAdminAuth(req: Request): Promise<{
  authorized: boolean;
  admin?: { id: string; email: string };
  errorResponse?: NextResponse;
}> {
  try {
    // 1. Check HTTP-only cookie
    const cookieStore = await cookies();
    let token = cookieStore.get("pawswell_admin_token")?.value;

    // 2. Fallback to Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { error: "Unauthorized. Administrator session required." },
          { status: 401 }
        ),
      };
    }

    const { valid, adminId, email } = verifyAdminSessionToken(token);
    if (!valid || !email) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { error: "Forbidden. Invalid or expired admin session token." },
          { status: 403 }
        ),
      };
    }

    // Verify account exists in DB and is active
    const account = await db.getAccountByEmail(email);
    if (!account || account.role !== "admin" || account.status === "suspended") {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { error: "Forbidden. Insufficient administrative privileges." },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      admin: {
        id: account.id,
        email: account.email,
      },
    };
  } catch (err: any) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: "Authentication verification failed: " + err.message },
        { status: 500 }
      ),
    };
  }
}
