import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const userRole = url.searchParams.get("userRole") || "member";
    const userPlan = url.searchParams.get("userPlan") || "free";

    const period = new Date().toISOString().substring(0, 7); // "YYYY-MM"
    const settings = await db.getSettings();

    if (!userId) {
      return NextResponse.json({
        unlockedCount: 0,
        limit: settings.freeLimit,
        remaining: settings.freeLimit,
        isPro: false,
        period,
      });
    }

    const isPro = userPlan === "pro" || userPlan === "yearly" || userRole === "pro" || userRole === "admin";
    const isPremium = userPlan === "premium" || userPlan === "monthly" || userRole === "premium";
    const limit = isPro ? 999999 : isPremium ? settings.premiumLimit : settings.freeLimit;
    const unlocks = await db.getUnlocksForUser(userId, period);
    const unlockedCount = unlocks.length;
    const remaining = isPro ? 999999 : Math.max(0, limit - unlockedCount);

    return NextResponse.json({
      unlockedCount,
      limit: isPro ? "unlimited" : limit,
      remaining: isPro ? "unlimited" : remaining,
      isPro,
      period,
      plan: userPlan,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
