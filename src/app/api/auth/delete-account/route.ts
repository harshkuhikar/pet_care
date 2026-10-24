import { NextResponse } from "next/server";
import { getSessionUser, clearSessionCookie } from "@/lib/server/session";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel, SessionModel } from "@/lib/server/models";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Delete account records & sessions
    await Promise.all([
      AccountModel.deleteOne({ id: user.id }),
      SessionModel.deleteMany({ accountId: user.id }),
    ]);

    const response = NextResponse.json(
      { success: true, message: "Account deleted permanently." },
      { headers: { "Cache-Control": "private, no-store" } }
    );

    clearSessionCookie(response);
    return response;
  } catch (err: any) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
