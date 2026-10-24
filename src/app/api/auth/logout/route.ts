import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, verifySessionToken, revokeSession } from "@/lib/server/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pawswell_session")?.value;

    if (token) {
      const payload = await verifySessionToken(token);
      if (payload?.sessionId) {
        await revokeSession(payload.sessionId);
      }
    }

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully." },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        },
      }
    );

    clearSessionCookie(response);
    return response;
  } catch (err: any) {
    console.error("Logout error:", err);
    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  }
}
