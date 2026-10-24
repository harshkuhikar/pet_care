import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, questionId, userId } = body; // action: 'upvote' | 'downvote' | 'best_answer'

    if (action === "upvote" || action === "downvote") {
      const updated = await db.voteAnswer(id, action === "upvote" ? "up" : "down");
      return NextResponse.json({ success: true, answer: updated });
    }

    if (action === "best_answer" && questionId && userId) {
      const question = await db.getQuestionById(questionId);
      if (!question || question.authorId !== userId) {
        return NextResponse.json({ error: "Only the question owner can mark a best answer." }, { status: 403 });
      }
      await db.markBestAnswer(questionId, id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const answers = await db.getAllAnswersAdmin();
    const answer = answers.find((a) => a.id === id);

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    if (answer.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.deleteAnswer(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
