import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/admin-auth";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  const logs = await db.getAuditLogs();
  return NextResponse.json({ logs });
}
