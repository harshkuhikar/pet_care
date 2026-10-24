import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";
import { connectToDatabase } from "@/lib/server/mongodb";
import { AccountModel } from "@/lib/server/models";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    await connectToDatabase();
    await AccountModel.updateOne(
      { id: user.id },
      { $set: { name: name.trim().slice(0, 60), updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json(
      { success: true, message: "Profile updated successfully." },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
