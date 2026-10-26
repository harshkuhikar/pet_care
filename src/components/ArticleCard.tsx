"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Article, UserProfile } from "@/types";
import { isArticleSaved, toggleSaveArticle } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Heart, Clock, ShieldCheck, Lock, Sparkles } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  const [saved, setSaved] = useState(false);
  const [bursting, setBursting] = useState(false);
  const { user: authUser, requireAuth, status } = useAuth();

  useEffect(() => {
    if (status === "authenticated" && authUser) {
      setSaved(isArticleSaved(article.id));
    } else {
      setSaved(false); // Guests see neutral unsaved state
    }
  }, [article.id, status, authUser]);

  const isUserPremium = Boolean(
    authUser &&
      (authUser.role === "admin" ||
        authUser.isVIP ||
        authUser.plan === "premium" ||
        authUser.plan === "family" ||
        authUser.plan === "pro")
  );

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      const newState = toggleSaveArticle(article.id);
      setSaved(newState);
      if (newState) {
        setBursting(true);
        setTimeout(() => setBursting(false), 800);
      }
    }, "Please sign in or create a free account to save guides to your reading list.");
  };

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case "nutrition":
        return "bg-[#FF4D6D] text-white";
      case "exercise":
        return "bg-[#00F5D4] text-black";
      case "acupuncture":
      case "therapies":
        return "bg-[#7928CA] text-white";
      case "herbal":
        return "bg-[#06D6A0] text-black";
      default:
        return "bg-[#FFE600] text-black";
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border-3 border-black rounded-3xl overflow-hidden pop-shadow hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[8px_8px_0px_#181126] dark:hover:shadow-[8px_8px_0px_#FFE600] flex flex-col h-full transition-all duration-300">
      {/* Top Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b-3 border-black">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Tilted Sticker Badges with gentle hover wiggle */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`font-display font-black text-xs px-2.5 py-1 rounded-full border-2 border-black pop-shadow uppercase tracking-wider group-hover:rotate-2 transition-transform ${getTopicColor(
              article.topic
            )}`}
          >
            {article.topic}
          </span>
          <span className="bg-white dark:bg-slate-800 text-[#181126] dark:text-white font-display text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-black pop-shadow group-hover:-rotate-2 transition-transform">
            {article.petType}
          </span>
        </div>

        {/* Premium / Free Lock Pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {article.isPremium ? (
            isUserPremium ? (
              <span className="bg-[#00F5D4] text-black font-display font-black text-xs px-2.5 py-1 rounded-full border-2 border-black pop-shadow flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-700" />
                <span>UNLOCKED</span>
              </span>
            ) : (
              <span className="bg-[#FFE600] text-black font-display font-black text-xs px-2.5 py-1 rounded-full border-2 border-black pop-shadow flex items-center gap-1 animate-pulse-badge">
                <Lock className="w-3 h-3 text-black" />
                <span>PREMIUM</span>
              </span>
            )
          ) : (
            <span className="bg-[#00F5D4] text-black font-display font-black text-xs px-2.5 py-1 rounded-full border-2 border-black pop-shadow">
              FREE
            </span>
          )}
        </div>

        {/* Bookmark Heart Button with Burst Animation */}
        <div className="absolute bottom-3 right-3">
          {bursting && (
            <div className="absolute -top-6 -left-3 pointer-events-none flex gap-1 animate-bounce">
              <span className="text-sm">❤️</span>
              <span className="text-xs">✨</span>
            </div>
          )}
          <button
            onClick={handleToggleSave}
            type="button"
            aria-label={saved ? "Remove bookmark" : "Bookmark article"}
            className={`w-10 h-10 rounded-2xl border-2 border-black flex items-center justify-center pop-shadow transition-transform hover:scale-115 active:scale-90 cursor-pointer ${
              bursting ? "animate-heart-burst" : ""
            } ${
              saved
                ? "bg-[#FF4D6D] text-white"
                : "bg-white text-slate-800 hover:text-[#FF4D6D]"
            }`}
          >
            <Heart className={`w-5 h-5 ${saved ? "fill-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              {article.readingTime}
            </span>
            {article.vetReviewed && (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Vet Reviewed
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/blog/${article.slug}`}>
            <h3 className="font-display font-black text-lg md:text-xl text-[#181126] dark:text-white leading-snug group-hover:text-[#FF4D6D] transition-colors mb-2">
              {article.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-2 mb-4 leading-relaxed font-medium">
            {article.excerpt}
          </p>
        </div>

        {/* Author Footer */}
        <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-7 h-7 rounded-full object-cover border-2 border-black"
            />
            <span className="text-xs font-black text-[#181126] dark:text-slate-100 truncate max-w-[140px]">
              {article.author.name}
            </span>
          </div>

          <Link
            href={`/blog/${article.slug}`}
            className="text-xs font-black uppercase text-[#7928CA] dark:text-[#FFE600] flex items-center gap-1 group-hover:underline"
          >
            <span>Read</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
