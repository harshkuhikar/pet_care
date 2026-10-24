"use client";

import React from "react";
import Link from "next/link";
import { SEED_ARTICLES } from "@/lib/seedData";
import { ArticleCard } from "@/components/ArticleCard";
import { VetDisclaimerBanner } from "@/components/VetDisclaimerBanner";
import { Activity, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { firePawsConfetti } from "@/lib/confetti";

export default function ExerciseTopicPage() {
  const exerciseArticles = SEED_ARTICLES.filter((a) => a.topic === "exercise");

  const handleDownload = () => {
    firePawsConfetti();
    alert("Downloading: 'Senior Pet Daily Joint Mobility & Rehab Exercise Plan (PDF)'!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Topic Hero Banner (Electric Teal & Black Theme) */}
      <div className="bg-[#00F5D4] text-black border-4 border-black rounded-3xl p-8 sm:p-14 pop-shadow-xl relative overflow-hidden mb-12">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-black text-[#00F5D4] font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-1.5deg] pop-shadow">
            <Activity className="w-3.5 h-3.5" />
            <span>PILLAR 2: THERAPEUTIC MOVEMENT & REHABILITATION</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight">
            Preserving Joints, Muscle & Joyful Movement
          </h1>

          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
            From low-impact hydrotherapy drills and senior dog cavaletti routines to indoor feline predatory fitness, movement is preventative medicine for joints and minds.
          </p>
        </div>

        {/* Decorative Doodles */}
        <div className="absolute right-6 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
          🎾 🦮 🐾
        </div>
      </div>

      <div className="mb-10">
        <VetDisclaimerBanner />
      </div>

      {/* 3 Core Mobility Principles with Hover Lift & High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[8px_8px_0px_#181126] dark:hover:shadow-[8px_8px_0px_#00F5D4] transition-all duration-300">
          <span className="text-3xl block mb-2 animate-bounce">🧘</span>
          <h3 className="font-display font-black text-xl mb-2 text-[#181126] dark:text-white">
            Proprioception & Balance
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
            Unstable surfaces (foam cushions, wobble boards) recruit deep core stabilizer muscles that prevent cruciate tears.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover:-translate-y-2 hover:-rotate-[0.5deg] hover:shadow-[8px_8px_0px_#181126] dark:hover:shadow-[8px_8px_0px_#00F5D4] transition-all duration-300">
          <span className="text-3xl block mb-2 animate-float-slow">🌊</span>
          <h3 className="font-display font-black text-xl mb-2 text-[#181126] dark:text-white">
            Warm Water Unweighting
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
            Hydrotherapy eliminates 60%+ of gravity load, enabling arthritic dogs and post-IVDD pets to walk without concussive impact.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[8px_8px_0px_#181126] dark:hover:shadow-[8px_8px_0px_#00F5D4] transition-all duration-300">
          <span className="text-3xl block mb-2 animate-wiggle">🐈</span>
          <h3 className="font-display font-black text-xl mb-2 text-[#181126] dark:text-white">
            Feline Predatory Sequence
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
            Structured 10-minute daily wand toy play satisfies innate hunting drives, reducing obesity, night-time vocalization, and anxiety.
          </p>
        </div>
      </div>

      {/* Featured Movement Guides */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-1deg] inline-block mb-1">
              MOVEMENT PROTOCOLS
            </span>
            <h2 className="font-display font-black text-3xl text-slate-950 dark:text-white">
              Featured Fitness & Rehab Guides
            </h2>
          </div>
          <Link href="/blog?topic=exercise" className="text-xs font-black uppercase text-[#00BB9C] hover:underline">
            View all movement ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciseArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Downloadable PDF */}
      <section className="bg-[#00F5D4] border-4 border-black rounded-3xl p-8 pop-shadow-xl text-black flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black text-[#00F5D4] font-display font-black text-xs px-3 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRINTABLE REHAB WORKBOOK</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl">
            Download the Senior Pet Daily Joint Mobility Log
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            Includes illustrated cavaletti layouts, 5-minute pre-walk dynamic warmups, and range-of-motion tracking checklists.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="px-6 py-4 bg-black hover:bg-slate-800 text-white font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#00F5D4]" />
          <span>Download Mobility PDF</span>
        </button>
      </section>
    </div>
  );
}
