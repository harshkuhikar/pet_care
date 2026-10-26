"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/storage";
import { UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { firePawsConfetti } from "@/lib/confetti";
import {
  MessageSquare,
  HelpCircle,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Award,
  Filter,
  X,
  ShieldAlert,
} from "lucide-react";

export default function QAPage() {
  const { user: authUser, requireAuth } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSpecies, setActiveSpecies] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "answered" | "unanswered" | "popular">("newest");

  // User unlock stats for usage meter
  const [userStats, setUserStats] = useState<{
    unlockedCount: number;
    limit: number | string;
    remaining: number | string;
    isPro: boolean;
  } | null>(null);

  // Ask Question Modal
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newCategory, setNewCategory] = useState("nutrition");
  const [newSpecies, setNewSpecies] = useState("dog");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (activeSpecies !== "all") params.set("species", activeSpecies);
      if (search) params.set("search", search);
      params.set("sort", sortBy);

      const res = await fetch(`/api/qa/questions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (currentUser: UserProfile | null) => {
    if (!currentUser) return;
    try {
      const res = await fetch(
        `/api/qa/user-stats?userId=${currentUser.id}&userRole=${currentUser.role}&userPlan=${currentUser.plan}`
      );
      if (res.ok) {
        const data = await res.json();
        setUserStats(data);
      }
    } catch (err) {
      console.error("Error fetching user Q&A stats:", err);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchUserStats({
        id: authUser.id,
        displayName: authUser.name,
        email: authUser.email,
        role: (authUser.role === "admin" ? "admin" : "member") as "member" | "premium" | "pro" | "admin",
        plan: (authUser.plan as any) || "free",
        avatarUrl: authUser.avatarUrl,
        joinedAt: new Date().toISOString(),
        newsletterSubscribed: false,
        newsletterFrequency: "weekly",
      });
    } else {
      setUserStats(null);
    }
  }, [authUser]);

  useEffect(() => {
    fetchQuestions();
  }, [activeCategory, activeSpecies, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetails.trim() || !authUser) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/qa/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: authUser.id,
          authorName: authUser.name,
          authorAvatar: authUser.avatarUrl,
          authorRole: authUser.role,
          title: newTitle,
          details: newDetails,
          category: newCategory,
          petSpecies: newSpecies,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewDetails("");
        setAskModalOpen(false);
        firePawsConfetti();
        fetchQuestions();
      }
    } catch (err) {
      console.error("Ask question error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative">
        <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-4 py-1.5 rounded-full border-2 border-black rotate-[-2deg] mb-3 pop-shadow animate-wiggle">
          <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
          <span>PAWSWELL COMMUNITY Q&A</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#181126] dark:text-white leading-tight">
          Ask Anything. <span className="text-[#FF4D6D]">Learn Everything.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-bold mt-3 max-w-2xl mx-auto leading-relaxed">
          Ask unlimited questions and share verified companion care experiences. Clinician-reviewed answers, dietary advice, and holistic recovery protocols.
        </p>

        {/* Action Button: Ask Question */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() =>
              requireAuth(
                () => setAskModalOpen(true),
                "Please sign in or create an account to post a question to the community!"
              )
            }
            className="px-6 py-3.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ask a Question (Unlimited)</span>
          </button>

          <Link
            href="/membership"
            className="px-5 py-3.5 bg-white dark:bg-slate-800 font-display font-black text-xs rounded-2xl border-2 border-black pop-shadow-sm hover:scale-105 transition-all text-slate-900 dark:text-white flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Unlock Unlimited Answers</span>
          </Link>
        </div>
      </div>

      {/* Plan Usage Meter Banner */}
      {authUser && userStats && (
        <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-5 mb-10 pop-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-2xl pop-shadow-sm shrink-0">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-base text-slate-900 dark:text-white">
                  Monthly Answer Unlock Meter
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFE600] text-black border border-black/30">
                  {authUser.plan === "pro" || authUser.plan === "family" || authUser.role === "admin"
                    ? "Family / Pro Pack"
                    : authUser.plan === "premium" || authUser.isVIP
                    ? "PawsWell Premium"
                    : "Free Explorer"}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-0.5">
                {userStats.isPro ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    🎉 Unlimited monthly question answers unlocked!
                  </span>
                ) : (
                  <span>
                    Used <strong className="text-[#FF4D6D]">{userStats.unlockedCount}</strong> of{" "}
                    <strong>{userStats.limit}</strong> unlocked question answers this month.
                  </span>
                )}
              </p>
            </div>
          </div>

          {!userStats.isPro && (
            <Link
              href="/membership"
              className="px-4 py-2 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-xs rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              Upgrade for More Answers ➔
            </Link>
          )}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 mb-8 pop-shadow-xl space-y-5">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search symptoms, ingredients, therapies, or species (e.g. gut dysbiosis, renal failure, rabbit GI stasis)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3.5 pl-11 text-sm font-bold bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none"
            />
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#FFE600] text-black font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Species Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 mr-2">
            Species:
          </span>
          {[
            { id: "all", label: "🐾 All Pets" },
            { id: "dog", label: "🐕 Dogs" },
            { id: "cat", label: "🐈 Cats" },
            { id: "small-pets", label: "🐇 Small Pets" },
            { id: "bird", label: "🦜 Birds" },
          ].map((sp) => (
            <button
              key={sp.id}
              onClick={() => setActiveSpecies(sp.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-black transition-all cursor-pointer ${
                activeSpecies === sp.id
                  ? "bg-[#00F5D4] text-black pop-shadow-sm scale-105"
                  : "bg-[#FFFDF5] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Category Pills & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-2 border-black/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 mr-2">
              Topics:
            </span>
            {[
              { id: "all", label: "All Topics" },
              { id: "gut-health", label: "Gut Health" },
              { id: "nutrition", label: "Nutrition & Diet" },
              { id: "mobility", label: "Joints & Mobility" },
              { id: "senior-care", label: "Senior Care" },
              { id: "therapies", label: "Holistic Therapies" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border border-black/40 transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#FFE600] text-black font-black pop-shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="answered">Most Answered</option>
              <option value="unanswered">Unanswered</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-bold text-slate-600 dark:text-slate-400">Loading community questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-8 pop-shadow">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
              No questions found
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Be the first companion guardian to ask a question in this category!
            </p>
          </div>
        ) : (
          questions.map((q) => (
            <Link
              key={q.id}
              href={`/qa/${q.id}`}
              className="block bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover:-translate-y-1 hover:border-[#FF4D6D] transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFE600] text-black border border-black/30">
                      {q.category}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-black/20 uppercase">
                      {q.petSpecies}
                    </span>
                    {q.hasBestAnswer && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-400 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600" />
                        Best Answer Selected
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-xl text-slate-900 dark:text-white group-hover:text-[#FF4D6D] transition-colors leading-snug">
                    {q.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                    {q.details}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span>Asked by</span>
                      <strong className="text-slate-900 dark:text-white">{q.authorName}</strong>
                    </span>
                    <span>•</span>
                    <span>{q.createdAt?.split("T")[0]}</span>
                  </div>
                </div>

                {/* Answers Badge */}
                <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 md:min-w-[120px] md:border-l-2 md:border-black/10 md:pl-6">
                  <div className="text-center">
                    <span className="font-display font-black text-2xl text-purple-700 dark:text-yellow-400 block">
                      {q.answersCount}
                    </span>
                    <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase">
                      {q.answersCount === 1 ? "Answer" : "Answers"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#FF4D6D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View ➔
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ASK QUESTION MODAL */}
      {askModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setAskModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#FFFDF5] dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl relative my-8 text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAskModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-black bg-white dark:bg-slate-800 hover:scale-110 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-2xl pop-shadow">
                ❓
              </div>
              <div>
                <h3 className="font-display font-black text-2xl">Ask the Community</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                  Unlimited asking on all plans. Experienced guardians & vets will reply.
                </p>
              </div>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to help a senior dog with osteoarthritis stairs difficulty?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold border-2 border-black rounded-xl bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Companion Species
                  </label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold border-2 border-black rounded-xl bg-white dark:bg-slate-800"
                  >
                    <option value="dog">🐕 Dog</option>
                    <option value="cat">🐈 Cat</option>
                    <option value="small-pets">🐇 Small Pets / Rabbit</option>
                    <option value="bird">🦜 Bird</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Health Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold border-2 border-black rounded-xl bg-white dark:bg-slate-800"
                  >
                    <option value="gut-health">Gut Health</option>
                    <option value="nutrition">Nutrition & Diet</option>
                    <option value="mobility">Joints & Mobility</option>
                    <option value="senior-care">Senior Care</option>
                    <option value="therapies">Therapies & Herbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Full Details & Context
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide age, current diet, veterinary diagnoses, and specific questions..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-medium border-2 border-black rounded-xl bg-white dark:bg-slate-800"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Community answers are not a substitute for clinical veterinary diagnosis. For acute emergencies, consult your local emergency hospital.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Publishing Question..." : "Publish Question to Community"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
