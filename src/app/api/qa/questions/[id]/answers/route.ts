import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { authorId, authorName, authorAvatar, authorRole, authorCredentials, content } = body;

    if (!content || !authorId) {
      return NextResponse.json({ error: "Answer content and author are required." }, { status: 400 });
    }

    const question = await db.getQuestionById(id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Sanitize content
    const cleanContent = content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    const newAnswer = await db.createAnswer({
      questionId: id,
      authorId,
      authorName: authorName || "Community Guardian",
      authorAvatar: authorAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      authorRole: authorRole || "member",
      authorCredentials: authorCredentials || undefined,
      content: cleanContent,
      status: "active",
    });

    return NextResponse.json({ success: true, answer: newAnswer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
