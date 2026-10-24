import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/admin-auth";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  const accounts = await db.getAllAccounts();
  // Strip password hash and salt
  const sanitized = accounts.map(({ passwordHash, salt, ...rest }) => rest);
  return NextResponse.json({ users: sanitized });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await req.json();
    const { userId, status, plan } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (status) {
      await db.updateAccountStatus(userId, status);
      await db.logAdminAction({
        adminId: auth.admin!.id,
        adminEmail: auth.admin!.email,
        action: `USER_STATUS_${status.toUpperCase()}`,
        targetType: "user",
        targetId: userId,
        details: `Account status updated to ${status}`,
      });
    }

    if (plan) {
      await db.updateAccountPlan(userId, plan);
      await db.logAdminAction({
        adminId: auth.admin!.id,
        adminEmail: auth.admin!.email,
        action: `USER_PLAN_UPDATED`,
        targetType: "user",
        targetId: userId,
        details: `Account membership plan updated to ${plan}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
