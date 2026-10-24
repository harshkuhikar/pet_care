import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") ?? undefined;
    const user = await getSessionUser(cookieHeader);

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "private, no-store, max-age=0, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      { authenticated: true, user },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    if (
      err?.digest?.includes("PRERENDER") ||
      err?.digest?.includes("DYNAMIC") ||
      err?.digest === "HANGING_PROMISE_REJECTION"
    ) {
      throw err;
    }
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json(
      { authenticated: false, user: null, error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        },
      }
    );
  }
}
