import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, frequency } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const sub = await db.saveNewsletterSubscriber(email, frequency || "weekly");

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully to the PawsWell Holistic Dispatch!",
      subscriber: { email: sub.email, frequency: sub.frequency },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
