"use client";

import React from "react";
import Link from "next/link";
import { SEED_ARTICLES } from "@/lib/seedData";
import { ArticleCard } from "@/components/ArticleCard";
import { VetDisclaimerBanner } from "@/components/VetDisclaimerBanner";
import { Sparkles, Download, Flame, ShieldAlert } from "lucide-react";
import { firePawsConfetti } from "@/lib/confetti";

export default function TherapiesTopicPage() {
  const therapyArticles = SEED_ARTICLES.filter(
    (a) => a.topic === "acupuncture" || a.topic === "herbal" || a.topic === "massage"
  );

  const handleDownload = () => {
    firePawsConfetti();
    alert("Downloading: 'PawsWell Holistic Pet Botanical & Herbal Safety Compendium (PDF)'!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Topic Hero Banner (Grape Purple & Gold Theme) */}
      <div className="bg-[#7928CA] text-white border-4 border-black rounded-3xl p-8 sm:p-14 pop-shadow-xl relative overflow-hidden mb-12">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-1.5deg] pop-shadow">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>PILLAR 3: EVIDENCE-BASED COMPLEMENTARY THERAPIES</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-tight">
            Acupuncture, Botanicals & Healing Touch
          </h1>

          <p className="text-base sm:text-lg text-purple-200 font-medium leading-relaxed">
            Harnessing the synergistic power of Traditional Chinese Veterinary Medicine (TCVM), cold laser photobiomodulation, functional mushroom beta-glucans, and therapeutic canine massage.
          </p>
        </div>

        {/* Decorative Doodles */}
        <div className="absolute right-6 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
          ✨ 🌿 🪡
        </div>
      </div>

      <div className="mb-10">
        <VetDisclaimerBanner />
      </div>

      {/* Safety Notice: Feline Glucuronidation Alert */}
      <div className="bg-amber-100 dark:bg-amber-950/60 border-3 border-black rounded-3xl p-6 pop-shadow mb-12 flex items-start gap-4 animate-pulse-badge">
        <div className="text-3xl shrink-0 animate-bounce">⚠️</div>
        <div>
          <h4 className="font-display font-black text-lg text-amber-950 dark:text-amber-200">
            Crucial Herbal Safety Rule: Cats Are Not Small Dogs
          </h4>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-amber-100 mt-1 leading-relaxed">
            Felines possess unique hepatic metabolism deficiencies (specifically glucuronyl transferase). Never administer essential oils, tea tree oil, garlic, or canine herbal tinctures to cats without board-certified veterinary oversight.
          </p>
        </div>
      </div>

      {/* Featured Therapy Guides */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-1deg] inline-block mb-1 pop-shadow">
              CLINICAL MODALITIES
            </span>
            <h2 className="font-display font-black text-3xl text-[#181126] dark:text-white">
              Featured Alternative Therapy Guides
            </h2>
          </div>
          <Link href="/blog?topic=acupuncture" className="text-xs font-black uppercase text-[#7928CA] dark:text-[#FFE600] hover:underline">
            View all therapies ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapyArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Downloadable PDF */}
      <section className="bg-[#7928CA] border-4 border-black rounded-3xl p-8 pop-shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>MEMBER HERBAL MATERIA MEDICA</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
            Download the Holistic Pet Herb Safety & Dosing Compendium
          </h3>
          <p className="text-xs sm:text-sm font-medium text-purple-200">
            A comprehensive reference covering Boswellia, Milk Thistle, Reishi, Turkey Tail, and Chamomile with weight-based dosage tables and drug interaction checks.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="px-6 py-4 bg-[#FFE600] hover:bg-[#FFF385] text-black font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-purple-700" />
          <span>Download Herbal Compendium</span>
        </button>
      </section>
    </div>
  );
}
