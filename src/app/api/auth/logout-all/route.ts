import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, verifySessionToken, revokeAllSessionsForAccount } from "@/lib/server/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pawswell_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload?.accountId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    await revokeAllSessionsForAccount(payload.accountId);

    const response = NextResponse.json(
      { success: true, message: "Logged out from all devices successfully." },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        },
      }
    );

    clearSessionCookie(response);
    return response;
  } catch (err: any) {
    console.error("Logout-all error:", err);
    return NextResponse.json({ error: "Failed to logout from all devices." }, { status: 500 });
  }
}
