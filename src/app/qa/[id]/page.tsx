"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import { firePawsConfetti } from "@/lib/confetti";
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Award,
  Lock,
  Sparkles,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
} from "lucide-react";

function QuestionDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { user: authUser, requireAuth, status } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New Answer Form
  const [answerContent, setAnswerContent] = useState("");
  const [credentials, setCredentials] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestionData = async (currentUser: any) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (currentUser) {
        queryParams.set("userId", currentUser.id);
        queryParams.set("userRole", currentUser.role);
        queryParams.set("userPlan", currentUser.plan);
      }

      const res = await fetch(`/api/qa/questions/${id}?${queryParams.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData({ error: "Failed to load question." });
      }
    } catch (err) {
      console.error("Error loading question:", err);
      setData({ error: "Connection error. Please retry." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuestionData(authUser);
    }
  }, [id, authUser]);

  const handleVote = async (answerId: string, action: "upvote" | "downvote") => {
    requireAuth(async () => {
      try {
        const res = await fetch(`/api/qa/answers/${answerId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          const json = await res.json();
          setData((prev: any) => ({
            ...prev,
            answers: prev.answers.map((a: any) => (a.id === answerId ? json.answer : a)),
          }));
        }
      } catch (err) {
        console.error("Vote error:", err);
      }
    }, "Please sign in or create an account to vote on answers.");
  };

  const handleMarkBest = async (answerId: string) => {
    requireAuth(async () => {
      if (!authUser) return;
      try {
        const res = await fetch(`/api/qa/answers/${answerId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "best_answer",
            questionId: id,
            userId: authUser.id,
          }),
        });
        if (res.ok) {
          firePawsConfetti();
          fetchQuestionData(authUser);
        }
      } catch (err) {
        console.error("Best answer error:", err);
      }
    }, "Please sign in to select the best answer.");
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    requireAuth(async () => {
      if (!authUser) return;
      setIsSubmitting(true);
      try {
        const res = await fetch(`/api/qa/questions/${id}/answers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorId: authUser.id,
            authorName: authUser.name,
            authorAvatar: authUser.avatarUrl,
            authorRole: authUser.role,
            authorCredentials: credentials.trim() || undefined,
            content: answerContent,
          }),
        });

        if (res.ok) {
          setAnswerContent("");
          setCredentials("");
          firePawsConfetti();
          fetchQuestionData(authUser);
        }
      } catch (err) {
        console.error("Submit answer error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }, "Please sign in or create an account to post an answer.");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-bold text-slate-700 dark:text-slate-300">Loading community wisdom...</p>
      </div>
    );
  }

  if (data?.error && !data?.isLocked) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-bold text-rose-500 mb-4">{data.error}</p>
        <Link href="/qa" className="px-5 py-2.5 bg-[#FFE600] text-black font-black rounded-xl border-2 border-black">
          Back to All Questions
        </Link>
      </div>
    );
  }

  const { question, answers = [], isLocked, totalAnswersCount = 0 } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/qa"
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-700 dark:text-slate-300 hover:text-[#FF4D6D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Questions</span>
        </Link>

        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-black/20">
          QID: {question?.id}
        </span>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#FFE600] text-black border border-black/30">
            {question?.category}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#00F5D4]/20 text-teal-900 dark:text-teal-200 border border-black/20 uppercase">
            {question?.petSpecies}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Asked {question?.createdAt?.split("T")[0]}
          </span>
        </div>

        <h1 className="font-display font-black text-2xl sm:text-4xl text-[#181126] dark:text-white leading-tight">
          {question?.title}
        </h1>

        <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
          {question?.details}
        </div>

        {/* Author Footer */}
        <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE600] border border-black flex items-center justify-center font-black text-xs text-black">
              🐾
            </div>
            <span>
              Asked by <strong className="text-slate-900 dark:text-white">{question?.authorName}</strong> ({question?.authorRole})
            </span>
          </div>

          <span className="font-mono text-xs">{totalAnswersCount} Total Answers</span>
        </div>
      </div>

      {/* Health Safety Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="text-xs font-bold text-amber-950 dark:text-amber-200 leading-relaxed">
          <strong className="block text-amber-900 dark:text-amber-100 font-black mb-0.5">
            Veterinary Legal Advisory:
          </strong>
          Community answers are shared by experienced pet guardians and practitioners for educational purposes only. They are not a substitute for diagnostic veterinary medicine or emergency intervention.
        </div>
      </div>

      {/* ANSWERS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white flex items-center gap-2">
            <span>Community Answers</span>
            <span className="text-sm font-black px-2.5 py-0.5 rounded-full bg-[#FF4D6D] text-white">
              {totalAnswersCount}
            </span>
          </h2>

          {data?.newlyUnlocked && (
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-400">
              ✨ Question Unlocked ({data.unlockedCount} of {data.limit} used)
            </span>
          )}
        </div>

        {/* LOCKED STATE PROMPT (Server-Gated) */}
        {isLocked ? (
          <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl text-center space-y-5 relative overflow-hidden">
            {/* Blurred Mock Teaser Background */}
            <div className="absolute inset-0 opacity-15 pointer-events-none filter blur-sm p-6 text-left">
              <div className="h-4 bg-slate-400 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-400 rounded w-full mb-2" />
              <div className="h-4 bg-slate-400 rounded w-5/6 mb-4" />
              <div className="h-4 bg-slate-400 rounded w-2/3" />
            </div>

            <div className="relative z-10 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FF4D6D] border-3 border-black text-white flex items-center justify-center text-3xl mx-auto pop-shadow animate-bounce">
                <Lock className="w-8 h-8 text-[#FFE600]" />
              </div>

              <div className="inline-block bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-2deg]">
                MONTHLY ANSWER LIMIT REACHED
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white">
                Unlock {totalAnswersCount} Community Answers
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                {data.isGuest
                  ? "Please sign in to unlock and view the veterinary protocols and community experiences for this question."
                  : data.userPlan === "premium" || data.userPlan === "monthly"
                  ? `You have reached your ${data.limit} monthly question answer views on PawsWell Premium. Upgrade to Family / Multi-Pet Pro for unlimited answers!`
                  : `You have reached your ${data.limit} monthly question answer views on the Free Explorer plan. Upgrade to unlock 15 or unlimited answers!`}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                {data.isGuest ? (
                  <Link
                    href="/login"
                    className="px-6 py-3.5 bg-[#FFE600] text-black font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all"
                  >
                    Sign In to Unlock
                  </Link>
                ) : (
                  <Link
                    href="/membership"
                    className="px-6 py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#FFE600]" />
                    <span>Upgrade via Razorpay ➔</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : answers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-8 text-center pop-shadow">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              No answers posted yet. Be the first to share your experience below!
            </p>
          </div>
        ) : (
          answers.map((ans: any) => (
            <div
              key={ans.id}
              className={`bg-white dark:bg-slate-900 border-3 rounded-3xl p-6 sm:p-8 pop-shadow transition-all space-y-4 ${
                ans.isBestAnswer
                  ? "border-[#00BB9C] ring-4 ring-[#00BB9C]/20 bg-emerald-50/20"
                  : "border-black"
              }`}
            >
              {ans.isBestAnswer && (
                <div className="inline-flex items-center gap-1.5 bg-[#00BB9C] text-white font-display font-black text-xs px-3 py-1 rounded-full border border-black pop-shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>BEST ANSWER CHOSEN BY QUESTION OWNER</span>
                </div>
              )}

              {/* Author & Credentials */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00F5D4] border-2 border-black flex items-center justify-center font-black text-sm text-black">
                    🐾
                  </div>
                  <div>
                    <h4 className="font-display font-black text-base text-slate-900 dark:text-white">
                      {ans.authorName}
                    </h4>
                    {ans.authorCredentials && (
                      <p className="text-xs text-purple-700 dark:text-yellow-400 font-bold">
                        {ans.authorCredentials}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {ans.createdAt?.split("T")[0]}
                </span>
              </div>

              {/* Answer Markdown Body */}
              <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                {ans.content}
              </div>

              {/* Vote Actions & Best Answer Toggle */}
              <div className="pt-3 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(ans.id, "upvote")}
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{ans.upvotes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleVote(ans.id, "downvote")}
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ans.downvotes || 0}</span>
                  </button>
                </div>

                {authUser && authUser.id === question?.authorId && !ans.isBestAnswer && (
                  <button
                    onClick={() => handleMarkBest(ans.id)}
                    className="px-3 py-1.5 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Mark as Best Answer</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* WRITE ANSWER SECTION (Available to all logged-in users) */}
        {authUser ? (
          <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl space-y-4">
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#FF4D6D]" />
              <span>Contribute Your Experience or Protocol</span>
            </h3>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              All registered guardians can post unlimited answers on every plan.
            </p>

            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Your Relevant Experience or Credentials (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Registered Vet Tech, Golden Retriever Guardian 10 yrs, Canine Nutritionist"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-bold border-2 border-black rounded-xl bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Your Answer & Guidance
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail step-by-step guidance, dosages, recovery timelines, and brand recommendations..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium border-2 border-black rounded-xl bg-white dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FFE600] hover:bg-[#EBD400] text-black font-display font-black text-base rounded-2xl border-3 border-black pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing Answer..." : "Post Answer to Community"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#FFFDF5] dark:bg-slate-800 border-3 border-black rounded-3xl p-6 text-center pop-shadow">
            <h4 className="font-display font-black text-lg text-slate-900 dark:text-white">
              Want to contribute your pet care wisdom?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1 mb-4">
              Sign in to write answers and help other pet guardians navigate health challenges.
            </p>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow hover:scale-105 inline-block"
            >
              Sign In to Answer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuestionDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 border-3 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-bold text-slate-700 dark:text-slate-300">Loading community wisdom...</p>
        </div>
      }
    >
      <QuestionDetailContent />
    </Suspense>
  );
}
