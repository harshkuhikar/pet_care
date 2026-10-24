import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/server/mongodb";
import { UserModel } from "@/lib/server/models";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("pawswell_user_session")?.value;

    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ id: sessionId }).lean();

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
