"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SEED_ARTICLES } from "@/lib/seedData";
import { ArticleCard } from "@/components/ArticleCard";
import { VetDisclaimerBanner } from "@/components/VetDisclaimerBanner";
import { Download, Sparkles, CheckCircle2, Bone, Utensils, Scale } from "lucide-react";
import { firePawsConfetti } from "@/lib/confetti";

export default function NutritionTopicPage() {
  const [petWeight, setPetWeight] = useState<number>(30);
  const [activityLevel, setActivityLevel] = useState<"low" | "medium" | "high">("medium");

  // Approximate daily raw/fresh food calculation (2.5% body weight)
  const multiplier = activityLevel === "low" ? 0.02 : activityLevel === "medium" ? 0.025 : 0.03;
  const dailyOunces = (petWeight * multiplier * 16).toFixed(1);

  const nutritionArticles = SEED_ARTICLES.filter((a) => a.topic === "nutrition");

  const handleDownload = () => {
    firePawsConfetti();
    alert("Downloading: 'PawsWell 7-Day Microbiome Reset & Elimination Diet Guide (PDF)'!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Topic Hero Banner (Hot Coral & Sunshine Yellow Theme) */}
      <div className="bg-[#FF4D6D] text-white border-4 border-black rounded-3xl p-8 sm:p-14 pop-shadow-xl relative overflow-hidden mb-12">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-2deg] pop-shadow">
            <Utensils className="w-3.5 h-3.5" />
            <span>PILLAR 1: BIOLOGICALLY APPROPRIATE NOURISHMENT</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-tight">
            Integrative Pet Nutrition & Gut Longevity
          </h1>

          <p className="text-base sm:text-lg text-rose-100 font-medium leading-relaxed">
            Over 70% of canine and feline immune resilience resides in the gut microbiome. Discover raw feeding frameworks, gently cooked anti-inflammatory recipes, and vet-approved bowl boosters.
          </p>
        </div>

        {/* Decorative Floating Doodles */}
        <div className="absolute right-6 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
          🥩 🥕 🥦
        </div>
      </div>

      <div className="mb-10">
        <VetDisclaimerBanner />
      </div>

      {/* Interactive Fresh Food Portion Calculator */}
      <section className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl mb-14">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-6 h-6 text-[#FF4D6D] animate-bounce" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white">
            Quick Fresh Food Portion Calculator
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-6 font-bold leading-relaxed">
          Estimate your companion&apos;s daily fresh meat & organ intake based on body weight and metabolic activity level.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-2">
              Pet Body Weight: <span className="text-[#FF4D6D] text-lg font-display font-black">{petWeight} lbs</span>
            </label>
            <input
              type="range"
              min="5"
              max="120"
              value={petWeight}
              onChange={(e) => setPetWeight(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF4D6D]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-2">
              Activity Level
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActivityLevel(lvl)}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl border-2 border-black capitalize transition-all cursor-pointer ${
                    activityLevel === lvl
                      ? "bg-[#FFE600] text-black pop-shadow scale-105"
                      : "bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:scale-105"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FFF0F3] dark:bg-slate-800 border-3 border-black rounded-2xl p-5 text-center pop-shadow animate-pulse-badge">
            <span className="text-xs font-black text-slate-900 dark:text-slate-300 block mb-1">
              Recommended Daily Fresh Portion:
            </span>
            <span className="font-display font-black text-4xl text-[#FF4D6D] flex items-center justify-center gap-1">
              <span>~{dailyOunces}</span>
              <span className="text-2xl text-slate-900 dark:text-white">oz</span>
            </span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-400 block mt-1">
              Split into 2 meals/day • 🥩 + 🥕
            </span>
          </div>
        </div>
      </section>

      {/* Featured Nutrition Guides */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-1deg] inline-block mb-1">
              CLINICAL GUIDES
            </span>
            <h2 className="font-display font-black text-3xl text-slate-950 dark:text-white">
              Featured Nutrition Articles & Diets
            </h2>
          </div>
          <Link href="/blog?topic=nutrition" className="text-xs font-black uppercase text-[#FF4D6D] hover:underline">
            View all nutrition ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Downloadable Premium Resource Card */}
      <section className="bg-[#FFE600] border-4 border-black rounded-3xl p-8 pop-shadow-xl text-black flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black text-[#FFE600] font-display font-black text-xs px-3 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MEMBER EXCLUSIVE DOWNLOAD</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl">
            Download the 7-Day Microbiome Reset & Elimination Diet PDF
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            A comprehensive 24-page clinical handbook including single-protein rotation schedules, prebiotic broth recipes, and stool monitoring logs.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="px-6 py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Protocol PDF</span>
        </button>
      </section>
    </div>
  );
}
