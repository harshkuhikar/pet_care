"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SEED_ARTICLES } from "@/lib/seedData";
import { getCurrentUser, isArticleSaved, toggleSaveArticle } from "@/lib/storage";
import { Article, UserProfile } from "@/types";
import { ArticleCard } from "@/components/ArticleCard";
import { VetDisclaimerBanner } from "@/components/VetDisclaimerBanner";
import { firePawsConfetti } from "@/lib/confetti";
import { renderArticleMarkdown } from "@/lib/markdown";
import {
  Heart,
  Clock,
  ShieldCheck,
  Share2,
  Lock,
  Sparkles,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Copy,
  ChevronRight,
  Send,
} from "lucide-react";

function ArticleDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<
    { id: string; author: string; avatar: string; text: string; date: string }[]
  >([
    {
      id: "c1",
      author: "Marcus & Luna",
      avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
      text: "Our vet actually reviewed this exact protocol with us last Tuesday! The broth temperature tip made all the difference.",
      date: "2 days ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const found = SEED_ARTICLES.find((a) => a.slug === slug);
    if (found) {
      setArticle(found);
      setSaved(isArticleSaved(found.id));
    }
    const handleSync = () => {
      setUser(getCurrentUser());
    };
    handleSync();

    if (typeof window !== "undefined") {
      window.addEventListener("pawswell_user_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("pawswell_user_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-black text-3xl mb-4">Guide Not Found</h2>
        <p className="text-slate-600 mb-6">The article you are looking for may have moved or been updated.</p>
        <Link
          href="/blog"
          className="px-6 py-3 bg-[#FFE600] text-black font-display font-black rounded-xl border-2 border-black pop-shadow"
        >
          Return to Learn Hub
        </Link>
      </div>
    );
  }

  const isUserPremium = Boolean(
    user &&
      (user.role === "premium" ||
        user.role === "pro" ||
        user.role === "admin" ||
        user.plan === "monthly" ||
        user.plan === "yearly" ||
        user.plan === "pro" ||
        user.plan === "premium")
  );
  const isPaywalled = article.isPremium && !isUserPremium;

  const handleToggleSave = () => {
    const state = toggleSaveArticle(article.id);
    setSaved(state);
    if (state) firePawsConfetti();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setComments([
      ...comments,
      {
        id: `c_${Date.now()}`,
        author: user.displayName,
        avatar: user.avatarUrl,
        text: newComment,
        date: "Just now",
      },
    ]);
    setNewComment("");
  };

  const relatedArticles = SEED_ARTICLES.filter(
    (a) => a.id !== article.id && (a.topic === article.topic || a.petType === article.petType)
  ).slice(0, 3);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:underline">Learn Hub</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#FF4D6D] uppercase">{article.topic}</span>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl mb-10 space-y-4">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black pop-shadow uppercase">
            {article.topic}
          </span>
          <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-display font-bold text-xs px-2.5 py-0.5 rounded-full border-2 border-black">
            {article.petType}
          </span>
          {article.isPremium ? (
            <span className="bg-[#FF4D6D] text-white font-display font-black text-xs px-2.5 py-1 rounded-full border-2 border-black pop-shadow flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#FFE600]" />
              <span>PREMIUM PROTOCOL</span>
            </span>
          ) : (
            <span className="bg-[#00F5D4] text-black font-display font-black text-xs px-2.5 py-1 rounded-full border-2 border-black pop-shadow">
              FREE GUIDE
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#181126] dark:text-white leading-[1.1]">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base sm:text-xl text-slate-900 dark:text-slate-100 font-bold leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author & Vet Review Meta Bar */}
        <div className="pt-4 border-y-2 border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-black pop-shadow"
            />
            <div>
              <p className="font-display font-black text-sm text-[#181126] dark:text-white">
                {article.author.name}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{article.author.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-purple-600" />
              {article.readingTime}
            </span>
            {article.vetReviewed && (
              <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 font-black pop-shadow">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Vet Reviewed by {article.vetName}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-5xl aspect-[21/9] overflow-hidden rounded-3xl border-4 border-black pop-shadow-xl mb-12 bg-slate-100">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl">
        {/* Left Sticky Sidebar: Table of Contents & Social Actions */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Action Buttons Box */}
          <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-5 pop-shadow flex items-center justify-around gap-2">
            <button
              onClick={handleToggleSave}
              className={`flex-1 py-2.5 px-3 rounded-xl border-2 border-black font-display font-black text-xs flex items-center justify-center gap-1.5 transition-all pop-shadow ${
                saved
                  ? "bg-[#FF4D6D] text-white"
                  : "bg-white text-slate-900 hover:bg-[#FF4D6D] hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
              <span>{saved ? "Saved" : "Save Guide"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl border-2 border-black bg-[#FFE600] text-black font-display font-black text-xs flex items-center justify-center gap-1.5 pop-shadow hover:scale-105"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>

          {/* Table of Contents */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="bg-[#FFFDF5] dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow sticky top-28">
              <span className="font-display font-black text-xs uppercase text-slate-500 tracking-wider block mb-3">
                TABLE OF CONTENTS
              </span>
              <ul className="space-y-2.5 text-xs font-bold">
                {article.tableOfContents.map((item, idx) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-slate-800 dark:text-slate-200 hover:text-[#FF4D6D] hover:underline flex items-start gap-2"
                    >
                      <span className="text-slate-400 font-mono">{idx + 1}.</span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Member Sponsor Callout */}
          <div className="bg-[#00F5D4] border-3 border-black rounded-3xl p-6 pop-shadow-lg text-black space-y-2">
            <span className="bg-black text-[#00F5D4] font-display font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
              VETTED SPONSOR
            </span>
            <h4 className="font-display font-black text-lg">
              RawBelly Fresh Organics
            </h4>
            <p className="text-xs font-medium text-slate-900">
              Board-certified veterinary clinical nutrition formulas delivered to your door.
            </p>
            <div className="pt-2">
              <span className="bg-white border-2 border-black font-mono font-bold text-xs px-2 py-1 rounded-lg">
                Code: PAWSWELL20
              </span>
            </div>
          </div>
        </aside>

        {/* Right Column: Article Rich Content & Paywall Modal */}
        <main className="lg:col-span-8 space-y-8">
          {/* Medical Disclaimer Banner */}
          <VetDisclaimerBanner compact />

          {/* Article Body */}
          {isPaywalled ? (
            /* Blurred Paywall View */
            <div className="relative">
              {/* Peek text */}
              <div className="space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-base select-none filter blur-sm opacity-50 pointer-events-none">
                <p>
                  Broad-spectrum clinical therapies must be paired with individualized biological moisture protocols. When addressing progressive tissue degradation, therapeutic amino acids provide cellular resilience without renal compromise.
                </p>
                <p>
                  In canine and feline models, standard chemical therapies only address outward symptoms. By examining the holistic inflammatory pathway, we uncover the exact dosages required for long-term health.
                </p>
                <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              </div>

              {/* Paywall Overlay Card */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 pop-shadow-xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-3xl mx-auto pop-shadow">
                    👑
                  </div>
                  <span className="bg-[#FF4D6D] text-white font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black pop-shadow inline-block">
                    PREMIUM MEMBER PROTOCOL
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white">
                    Unlock This Full Clinical Protocol
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                    This deep-dive guide includes dosage tables, printable PDF transition formulas, and clinical contraindication checks.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/membership"
                      className="px-6 py-3.5 bg-[#FF4D6D] text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow-coral hover:scale-108 active:scale-95 transition-all cursor-pointer animate-pulse-badge"
                    >
                      Unlock for $12/mo
                    </Link>
                    <Link
                      href="/login"
                      className="px-4 py-3.5 bg-white dark:bg-slate-800 text-black dark:text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Already a member? Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full Accessible Rich Content with High-Contrast Typography & Structured Elements */
            <div className="max-w-none text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderArticleMarkdown(article.content),
                }}
              />
            </div>
          )}

          {/* Tags */}
          <div className="pt-6 border-t-2 border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#FFFDF5] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-black rounded-xl px-3 py-1 text-xs font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Member Discussion Comments Section */}
          <section className="pt-10 border-t-3 border-black">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6 text-[#FF4D6D]" />
              <h3 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                Member Experiences ({comments.length})
              </h3>
            </div>

            {/* Comment Post Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-8 space-y-3">
                <textarea
                  required
                  rows={3}
                  placeholder={`Share your experience with ${article.author.name}'s protocol...`}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 text-sm font-semibold border-3 border-black rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </form>
            ) : (
              <div className="bg-[#FFF0F3] border-2 border-black rounded-2xl p-4 pop-shadow mb-8 text-center text-xs font-bold">
                <span>Join our pet collective to ask questions and share protocol results! </span>
                <Link href="/login" className="underline font-black text-[#FF4D6D]">
                  Sign in here
                </Link>
              </div>
            )}

            {/* Existing Comments */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-800 border-2 border-black rounded-2xl p-4 pop-shadow space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.avatar}
                        alt={c.author}
                        className="w-7 h-7 rounded-full object-cover border border-black"
                      />
                      <span className="font-display font-black text-xs text-slate-900 dark:text-white">
                        {c.author}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{c.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Related Posts Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-20 pt-12 border-t-4 border-black">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white">
              Related Longevity Guides
            </h3>
            <Link href="/blog" className="text-xs font-black uppercase text-[#FF4D6D] hover:underline">
              View all ➔
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export default function ArticleDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="font-display font-black text-xl text-slate-800 dark:text-slate-200">
            Loading Integrative Guide...
          </p>
        </div>
      }
    >
      <ArticleDetailContent />
    </Suspense>
  );
}
