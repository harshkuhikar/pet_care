"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SEED_FORUM_CATEGORIES } from "@/lib/seedData";
import { getForumThreads, addForumThread, getCurrentUser } from "@/lib/storage";
import { ForumThread, UserProfile } from "@/types";
import { VetDisclaimerBanner } from "@/components/VetDisclaimerBanner";
import { firePawsConfetti } from "@/lib/confetti";
import {
  MessageSquare,
  Sparkles,
  Heart,
  Plus,
  ShieldAlert,
  Flame,
  Pin,
  Lock,
  X,
  ChevronRight,
} from "lucide-react";

export default function CommunityPage() {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Thread Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(SEED_FORUM_CATEGORIES[0].id);
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setUser(getCurrentUser());
    setThreads(getForumThreads());
  }, []);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !user) return;

    const cat = SEED_FORUM_CATEGORIES.find((c) => c.id === newCategory) || SEED_FORUM_CATEGORIES[0];

    const created = addForumThread({
      categoryId: cat.id,
      categoryName: cat.name,
      title: newTitle.trim(),
      content: newContent.trim(),
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      authorRole: user.role,
      tags: newTag ? [newTag.trim()] : ["Community Experience"],
    });

    setThreads([created, ...threads]);
    setCreateModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setNewTag("");
    firePawsConfetti();
  };

  const filteredThreads = threads.filter((t) => {
    if (activeCategory === "all") return true;
    return t.categoryId === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Page Header with Floating Stickers & High-Contrast Typography */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative">
        <div className="absolute -top-4 left-6 text-3xl animate-float-slow hidden sm:block">💬</div>
        <div className="absolute -top-2 right-8 text-3xl animate-bounce hidden sm:block">🐾</div>
        <div className="absolute top-10 -left-6 text-2xl animate-spin-slow hidden lg:block">✨</div>

        <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-4 py-1.5 rounded-full border-2 border-black rotate-[-2deg] mb-3 pop-shadow animate-wiggle">
          <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
          <span>PAWSWELL COMMUNITY FORUM</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#181126] dark:text-white leading-tight">
          Guardian Discussions & Experiences
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-bold max-w-2xl mx-auto">
          A compassionate space to share diet transition journals, physical recovery milestones, and senior pet love.
        </p>
      </div>

      {/* Persistent Medical Advice Banner */}
      <div className="mb-10">
        <div className="bg-[#FFF0F3] dark:bg-rose-950/40 border-3 border-black rounded-2xl p-4 pop-shadow flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-rose-100">
              <strong className="text-[#FF4D6D]">Important Reminder:</strong> Community forum discussions reflect personal guardian experiences and must never replace diagnostic veterinary medicine.
            </p>
          </div>
          <Link
            href="/community-guidelines"
            className="text-xs font-black uppercase text-[#FF4D6D] underline shrink-0 hover:text-purple-700"
          >
            Guidelines ➔
          </Link>
        </div>
      </div>

      {/* Main Forum Grid: Categories & Threads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Categories */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 pop-shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
              <h3 className="font-display font-black text-lg text-[#181126] dark:text-white">
                Forum Categories
              </h3>
              <span className="text-xs font-black text-slate-600 dark:text-slate-400">{threads.length} Threads</span>
            </div>

            <button
              onClick={() => setActiveCategory("all")}
              className={`w-full p-3.5 rounded-xl border-2 border-black text-left text-xs font-black transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#FFE600] text-black pop-shadow scale-102"
                  : "bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-slate-200 hover:scale-102 hover:border-black"
              }`}
            >
              🌟 All Recent Discussions
            </button>

            {SEED_FORUM_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full p-3.5 rounded-xl border-2 border-black text-left flex items-start justify-between text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#00F5D4] text-black font-black pop-shadow scale-102"
                      : "bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-slate-200 hover:scale-102 hover:border-black"
                  }`}
                >
                  <div>
                    <p className="font-display font-bold text-sm">{cat.name}</p>
                    <p className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* New Discussion Trigger Button */}
          {user ? (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Discussion</span>
            </button>
          ) : (
            <div className="bg-[#FFE600] border-3 border-black rounded-2xl p-5 pop-shadow text-center space-y-2">
              <p className="font-display font-black text-sm text-black">
                Want to post a question?
              </p>
              <p className="text-xs font-bold text-slate-800">
                Sign in or create a free membership to participate in discussions.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 px-4 py-2 bg-black text-white font-display font-black text-xs rounded-xl"
              >
                Sign In to Post
              </Link>
            </div>
          )}
        </aside>

        {/* Right Area: Threads List */}
        <div className="lg:col-span-8 space-y-4">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover-wiggle flex flex-col justify-between transition-all"
            >
              <div>
                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFE600] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black uppercase">
                      {thread.categoryName}
                    </span>
                    {thread.isPinned && (
                      <span className="bg-[#00F5D4] text-black text-[10px] font-black px-2 py-0.5 rounded-full border border-black flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {thread.createdAt.split("T")[0]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-black text-xl text-slate-950 dark:text-white leading-snug mb-2">
                  {thread.title}
                </h3>

                {/* Content Snippet */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                  {thread.content}
                </p>
              </div>

              {/* Author & Stats Footer */}
              <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={thread.authorAvatar}
                    alt={thread.authorName}
                    className="w-7 h-7 rounded-full object-cover border border-black"
                  />
                  <span className="font-display font-black text-xs text-slate-900 dark:text-white">
                    {thread.authorName}
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                    {thread.authorRole}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#FF4D6D] fill-[#FF4D6D]" />
                    {thread.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    {thread.repliesCount} Replies
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start New Thread Modal */}
      {createModalOpen && user && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                Start a New Discussion
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-xl border border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                >
                  {SEED_FORUM_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Thread Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broth ratio that worked for our picky senior cat"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Discussion Content & Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your companion's story, recipes tested, or question for the pack..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3.5 text-xs font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Optional Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Cat, Raw Diet, Allergies"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-4 py-2 text-xs font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl border border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF4D6D] text-white font-display font-black text-xs rounded-xl border-2 border-black pop-shadow-coral"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
