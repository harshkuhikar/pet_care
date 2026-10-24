import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/admin-auth";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  const questions = await db.getAllQuestionsAdmin();
  const answers = await db.getAllAnswersAdmin();

  return NextResponse.json({
    questions,
    answers,
    stats: {
      totalQuestions: questions.length,
      totalAnswers: answers.length,
      flaggedQuestions: questions.filter((q) => q.status === "flagged").length,
      flaggedAnswers: answers.filter((a) => a.status === "flagged").length,
    },
  });
}

export async function PATCH(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await req.json();
    const { targetType, id, status } = body; // targetType: 'question' | 'answer'

    if (!id || !targetType || !status) {
      return NextResponse.json({ error: "id, targetType, and status are required" }, { status: 400 });
    }

    if (targetType === "question") {
      await db.updateQuestionStatus(id, status);
      await db.logAdminAction({
        adminId: auth.admin!.id,
        adminEmail: auth.admin!.email,
        action: `QA_QUESTION_${status.toUpperCase()}`,
        targetType: "qa_question",
        targetId: id,
        details: `Question status updated to ${status}`,
      });
    } else if (targetType === "answer") {
      await db.updateAnswerStatus(id, status);
      await db.logAdminAction({
        adminId: auth.admin!.id,
        adminEmail: auth.admin!.email,
        action: `QA_ANSWER_${status.toUpperCase()}`,
        targetType: "qa_answer",
        targetId: id,
        details: `Answer status updated to ${status}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const targetType = url.searchParams.get("targetType"); // 'question' | 'answer'

    if (!id || !targetType) {
      return NextResponse.json({ error: "id and targetType are required" }, { status: 400 });
    }

    if (targetType === "question") {
      await db.deleteQuestion(id);
      await db.logAdminAction({
        adminId: auth.admin!.id,
        adminEmail: auth.admin!.email,
        action: "QA_QUESTION_DELETED",
        targetType: "qa_question",
        targetId: id,
        details: `Question and linked answers deleted by admin`,
      });
    } else {
      await db.deleteAnswer(id);
      await db.logAdminAction({
        adminId: auth.admin!.id,
        adminEmail: auth.admin!.email,
        action: "QA_ANSWER_DELETED",
        targetType: "qa_answer",
        targetId: id,
        details: `Answer deleted by admin`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
