import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/admin-auth";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  const settings = await db.getSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await req.json();
    const { freeLimit, premiumLimit } = body;

    if (typeof freeLimit !== "number" || typeof premiumLimit !== "number") {
      return NextResponse.json(
        { error: "freeLimit and premiumLimit must be valid numbers" },
        { status: 400 }
      );
    }

    const updated = await db.updateSettings(
      {
        freeLimit: Math.max(1, freeLimit),
        premiumLimit: Math.max(1, premiumLimit),
      },
      auth.admin!.email
    );

    await db.logAdminAction({
      adminId: auth.admin!.id,
      adminEmail: auth.admin!.email,
      action: "SETTINGS_LIMITS_UPDATED",
      targetType: "settings",
      targetId: "qa_limits",
      details: `Updated Q&A limits: Free=${freeLimit}, Premium=${premiumLimit}`,
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
