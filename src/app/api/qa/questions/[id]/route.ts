import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);

    const userId = url.searchParams.get("userId");
    const userRole = url.searchParams.get("userRole") || "member";
    const userPlan = url.searchParams.get("userPlan") || "free";

    const question = await db.getQuestionById(id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const allAnswers = await db.getAnswersForQuestion(id);
    const settings = await db.getSettings();
    const period = new Date().toISOString().substring(0, 7); // "YYYY-MM"

    // Guest check
    if (!userId) {
      return NextResponse.json({
        question,
        answers: [],
        totalAnswersCount: allAnswers.length,
        isLocked: true,
        isGuest: true,
        message: "Please log in to view community answers.",
      });
    }

    const isPro = userPlan === "pro" || userPlan === "yearly" || userRole === "pro" || userRole === "admin";
    const isPremium = userPlan === "premium" || userPlan === "monthly" || userRole === "premium";
    const effectivePlan = isPro ? "pro" : isPremium ? "premium" : "free";
    const planLimit = isPro ? "unlimited" : isPremium ? settings.premiumLimit : settings.freeLimit;

    // Exemption 1: Author of the question
    if (question.authorId === userId) {
      return NextResponse.json({
        question,
        answers: allAnswers,
        totalAnswersCount: allAnswers.length,
        isUnlocked: true,
        isAuthor: true,
        unlockedCount: (await db.getUnlocksForUser(userId, period)).length,
        limit: planLimit,
      });
    }

    // Exemption 2: User who contributed an answer to this question
    const hasContributedAnswer = allAnswers.some((a) => a.authorId === userId);
    if (hasContributedAnswer) {
      return NextResponse.json({
        question,
        answers: allAnswers,
        totalAnswersCount: allAnswers.length,
        isUnlocked: true,
        isContributor: true,
        unlockedCount: (await db.getUnlocksForUser(userId, period)).length,
        limit: planLimit,
      });
    }

    // Exemption 3: Family / Multi-Pet Pro Plan (Unlimited)
    if (isPro) {
      return NextResponse.json({
        question,
        answers: allAnswers,
        totalAnswersCount: allAnswers.length,
        isUnlocked: true,
        isPro: true,
        unlockedCount: (await db.getUnlocksForUser(userId, period)).length,
        limit: "unlimited",
      });
    }

    // Check if already unlocked this month
    const alreadyUnlocked = await db.isQuestionUnlocked(userId, id, period);
    if (alreadyUnlocked) {
      return NextResponse.json({
        question,
        answers: allAnswers,
        totalAnswersCount: allAnswers.length,
        isUnlocked: true,
        alreadyUnlocked: true,
        unlockedCount: (await db.getUnlocksForUser(userId, period)).length,
        limit: planLimit,
      });
    }

    // Attempt to unlock new question with monthly limit
    const unlockResult = await db.unlockQuestion(userId, id, period, effectivePlan);

    if (!unlockResult.success) {
      // LIMIT REACHED: Gated on the server! Return zero answer content.
      return NextResponse.json({
        question,
        answers: [], // Content omitted on server!
        totalAnswersCount: allAnswers.length,
        isLocked: true,
        unlockedCount: unlockResult.count,
        limit: unlockResult.limit,
        error: unlockResult.error,
        userPlan: effectivePlan,
      });
    }

    // Successfully unlocked!
    return NextResponse.json({
      question,
      answers: allAnswers,
      totalAnswersCount: allAnswers.length,
      isUnlocked: true,
      newlyUnlocked: true,
      unlockedCount: unlockResult.count,
      limit: unlockResult.limit,
      userPlan,
    });
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

    const question = await db.getQuestionById(id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (question.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.deleteQuestion(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
