import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, topic, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    const saved = await db.saveContactMessage({
      name: name || "Anonymous Guardian",
      email,
      topic: topic || "General Inquiry",
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Your message was saved to our live database and sent to our team!",
      id: saved.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
