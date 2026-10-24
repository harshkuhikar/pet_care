"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SEED_ARTICLES } from "@/lib/seedData";
import { ArticleCard } from "@/components/ArticleCard";
import { PetSpecies, HealthTopic } from "@/types";
import { Search, Filter, Sparkles, X, Heart } from "lucide-react";

function BlogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialPetType = searchParams.get("petType") as PetSpecies | null;
  const initialTopic = searchParams.get("topic") as HealthTopic | null;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPetType, setSelectedPetType] = useState<PetSpecies | "all">(
    initialPetType || "all"
  );
  const [selectedTopic, setSelectedTopic] = useState<HealthTopic | "all">(
    initialTopic || "all"
  );
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "premium">("all");

  const petTypes: { id: PetSpecies | "all"; label: string; icon: string }[] = [
    { id: "all", label: "All Pets", icon: "🐾" },
    { id: "dog", label: "Dogs", icon: "🐕" },
    { id: "cat", label: "Cats", icon: "🐈" },
    { id: "rabbit", label: "Rabbits", icon: "🐇" },
    { id: "bird", label: "Birds", icon: "🦜" },
    { id: "small-pet", label: "Small Pets", icon: "🐹" },
    { id: "reptile", label: "Reptiles", icon: "🦎" },
  ];

  const topics: { id: HealthTopic | "all"; label: string }[] = [
    { id: "all", label: "All Topics" },
    { id: "nutrition", label: "Nutrition & Diets" },
    { id: "exercise", label: "Movement & Fitness" },
    { id: "acupuncture", label: "Acupuncture & TCVM" },
    { id: "herbal", label: "Herbal Remedies" },
    { id: "massage", label: "Massage & TTouch" },
    { id: "senior-care", label: "Senior Care" },
  ];

  const filteredArticles = useMemo(() => {
    return SEED_ARTICLES.filter((article) => {
      // Pet Type Filter
      if (selectedPetType !== "all" && article.petType !== selectedPetType) {
        return false;
      }
      // Topic Filter
      if (selectedTopic !== "all" && article.topic !== selectedTopic) {
        return false;
      }
      // Tier Filter
      if (tierFilter === "free" && article.isPremium) return false;
      if (tierFilter === "premium" && !article.isPremium) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAuthor = article.author.name.toLowerCase().includes(q);
        return matchesTitle || matchesExcerpt || matchesTags || matchesAuthor;
      }

      return true;
    });
  }, [searchQuery, selectedPetType, selectedTopic, tierFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPetType("all");
    setSelectedTopic("all");
    setTierFilter("all");
  };

  const hasActiveFilters =
    searchQuery || selectedPetType !== "all" || selectedTopic !== "all" || tierFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Page Header with High-Contrast Typography & Animations */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative">
        {/* Floating animated sparkles around header */}
        <div className="absolute -top-4 left-6 text-3xl animate-float-slow select-none hidden sm:block">🐾</div>
        <div className="absolute -top-2 right-8 text-3xl animate-bounce select-none hidden sm:block">📚</div>
        <div className="absolute top-12 -left-6 text-2xl animate-spin-slow select-none hidden lg:block">✨</div>

        <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-4 py-1.5 rounded-full border-2 border-black rotate-[-1.5deg] mb-3 pop-shadow animate-wiggle">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>INTEGRATIVE PET HEALTH ARCHIVE</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#181126] dark:text-white leading-tight">
          Learn Hub & Vet Protocols
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-bold max-w-2xl mx-auto">
          Search over 350+ clinician-reviewed guides on species-appropriate nutrition, gentle rehabilitation, and holistic therapies.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl mb-12 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by symptom, ingredient, therapy, or species (e.g. gut, arthritis, kidney, rabbit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 pl-12 text-sm sm:text-base font-bold border-3 border-black rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
          />
          <Search className="w-5 h-5 absolute left-4 top-4.5 text-slate-700 dark:text-slate-300" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-4.5 text-slate-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Pet Type Filter Pills */}
        <div>
          <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider block mb-2">
            Filter by Companion Species:
          </span>
          <div className="flex flex-wrap gap-2">
            {petTypes.map((pt) => {
              const active = selectedPetType === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPetType(pt.id)}
                  className={`px-3.5 py-2 rounded-xl border-2 border-black text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all pop-shadow cursor-pointer ${
                    active
                      ? "bg-[#FF4D6D] text-white scale-105 animate-pulse-badge"
                      : "bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-[#FFE600] hover:text-black hover:scale-105"
                  }`}
                >
                  <span className="text-base">{pt.icon}</span>
                  <span>{pt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics & Free/Premium Bar */}
        <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Topic Select */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-black uppercase text-slate-900 dark:text-slate-200 mr-1">Topic:</span>
            {topics.map((t) => {
              const active = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                    active
                      ? "bg-[#00F5D4] text-black border-black pop-shadow scale-105"
                      : "border-black/30 bg-white dark:bg-slate-800 text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#FFE600] hover:text-black hover:scale-105"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Free vs Premium Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-900 dark:text-slate-200">Tier:</span>
            <div className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-xl p-1 flex gap-1 text-xs font-black pop-shadow">
              <button
                onClick={() => setTierFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  tierFilter === "all" ? "bg-black text-white pop-shadow" : "text-slate-800 dark:text-slate-200 hover:text-black"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTierFilter("free")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  tierFilter === "free" ? "bg-[#00F5D4] text-black border border-black pop-shadow" : "text-slate-800 dark:text-slate-200 hover:text-black"
                }`}
              >
                Free Only
              </button>
              <button
                onClick={() => setTierFilter("premium")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  tierFilter === "premium" ? "bg-[#FFE600] text-black border border-black pop-shadow" : "text-slate-800 dark:text-slate-200 hover:text-black"
                }`}
              >
                Premium Only
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-black text-[#FF4D6D] hover:underline ml-2 cursor-pointer uppercase tracking-wider"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar with Floating Badge */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-200">
          Showing <span className="font-display font-black text-base text-[#FF4D6D]">{filteredArticles.length}</span>{" "}
          vet-reviewed articles
        </p>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-12 text-center pop-shadow max-w-lg mx-auto">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-2">
            No health guides found
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Try adjusting your search keywords or switching filters to see more articles.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-[#FFE600] text-black font-display font-black text-sm rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading Health Archive...</div>}>
      <BlogContent />
    </Suspense>
  );
}
