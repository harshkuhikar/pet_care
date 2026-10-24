"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SEED_ARTICLES, SEED_PARTNERS, SEED_PET_WALL, SEED_PLANS } from "@/lib/seedData";
import { HeroAnimatedPets } from "@/components/HeroAnimatedPets";
import { TickerMarquee } from "@/components/TickerMarquee";
import { ArticleCard } from "@/components/ArticleCard";
import { PetWallCard } from "@/components/PetWallCard";
import { LightboxModal } from "@/components/LightboxModal";
import { PetWallPhoto } from "@/types";
import { subscribeToNewsletter } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import {
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Crown,
  ChevronDown,
  Star,
  Users,
  Award,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [heroEmail, setHeroEmail] = useState("");
  const [heroSubscribed, setHeroSubscribed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activePhoto, setActivePhoto] = useState<PetWallPhoto | null>(null);

  const handleHeroSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail || !heroEmail.includes("@")) return;
    subscribeToNewsletter(heroEmail);
    setHeroSubscribed(true);
    firePawsConfetti();
  };

  const faqs = [
    {
      q: "What makes integrative pet health different from conventional veterinary care?",
      a: "Integrative medicine blends conventional diagnostics (bloodwork, X-rays) with evidence-backed complementary therapies—like fresh nutrition, acupuncture, herbal medicine, and physical rehabilitation—to address root causes rather than merely masking symptoms.",
    },
    {
      q: "Can I share photos on the Pet Wall for free?",
      a: "Yes! Every registered member can post photos to celebrate their dogs, cats, bunnies, and birds. To protect guardian privacy, we strictly strip camera EXIF and GPS data and show only your display name.",
    },
    {
      q: "Are the nutrition guides and recipes formulated by real veterinary professionals?",
      a: "Every single guide, elimination protocol, and meal recipe is researched, reviewed, and approved by board-certified veterinarians (DVMs) and certified canine/feline clinical nutritionists.",
    },
    {
      q: "Can I cancel my Premium membership at any time?",
      a: "Yes! There are no contracts. You can manage or cancel your subscription with a single click inside your Razorpay member billing portal. We also offer a 30-day wag-guaranteed full refund.",
    },
    {
      q: "Do you offer multi-pet households special pricing?",
      a: "Our Family / Pro plan is explicitly designed for multi-pet homes, providing unlimited pet profiles, individualized monthly wellness checklists, and priority access to our vet team.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#140E20] transition-colors selection:bg-[#FFE600] selection:text-black">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-18 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Decorative Floating Stickers */}
        <div className="absolute top-10 left-6 hidden lg:block rotate-[-6deg] animate-float">
          <div className="bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black pop-shadow flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>VET-REVIEWED PROTOCOLS</span>
          </div>
        </div>

        <div className="absolute top-8 right-12 hidden lg:block rotate-[5deg] animate-float">
          <div className="bg-[#00F5D4] text-black font-display font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black pop-shadow flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#FF4D6D] fill-[#FF4D6D]" />
            <span>48,000+ HAPPY GUARDIANS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Big Bold Headlines & Conversion Funnel */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag with Wiggle Animation */}
            <div className="inline-flex items-center gap-2 bg-[#FFF0F3] dark:bg-purple-950/60 border-2 border-black rounded-full px-4 py-1.5 pop-shadow animate-wiggle">
              <span className="text-lg">🌿</span>
              <span className="font-display font-black text-xs sm:text-sm text-[#FF4D6D] uppercase tracking-wide">
                Integrative Wellness • Nutrition • Longevity
              </span>
            </div>

            {/* Huge Chunky Display Headline with High-Contrast Charcoal */}
            <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-[#181126] dark:text-white">
              Because They Deserve{" "}
              <span className="text-[#FF4D6D] underline decoration-[#FFE600] decoration-wavy decoration-4">
                Vibrant Health
              </span>{" "}
              & Long, Joyful Lives.
            </h1>

            {/* Subheading with Punchy Bold Weight */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-900 dark:text-slate-100 font-bold max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Transform your companion&apos;s vitality with vet-reviewed biological nutrition, gentle physical conditioning, and proven holistic therapies—supported by an affectionate pet parent collective.
            </p>

            {/* Email Signup Form (Primary Newsletter Funnel) */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              {heroSubscribed ? (
                <div className="bg-[#00F5D4] text-black border-3 border-black rounded-2xl p-4 pop-shadow-lg flex items-center gap-3 animate-pulse-badge">
                  <CheckCircle2 className="w-7 h-7 text-emerald-800 shrink-0" />
                  <div>
                    <h4 className="font-display font-black text-base">You&apos;re on the VIP Pack List!</h4>
                    <p className="text-xs font-bold text-slate-800">
                      Check your inbox for our free &apos;Pet Longevity Blueprint&apos; PDF.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleHeroSubscribe}
                  className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white dark:bg-slate-800 border-3 border-black rounded-2xl pop-shadow-lg"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to join 48k+ pet parents..."
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm font-bold text-[#181126] dark:text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFE600] hover:bg-[#FFF385] text-black font-display font-black text-sm px-6 py-3 rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse-badge"
                  >
                    <span>Get Free Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Social Proof Checklist */}
              <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-black text-slate-800 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Weekly Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Vet-Reviewed Advice
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No Spam, Ever
                </span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/membership"
                className="px-6 py-3.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-2 animate-bounce-slow"
              >
                <Crown className="w-5 h-5 text-[#FFE600] animate-spin-slow" />
                <span>Explore Premium Plans</span>
              </Link>
              <Link
                href="/pet-wall"
                className="px-5 py-3.5 bg-white dark:bg-slate-800 text-[#181126] dark:text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>📸 View Pet Wall</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Animated Pets */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <HeroAnimatedPets />
          </div>
        </div>
      </section>

      {/* 2. DUAL COUNTER-SCROLLING MARQUEES */}
      <div className="space-y-0 select-none">
        <TickerMarquee
          bgClass="bg-[#FFE600] border-y-3 border-black shadow-sm"
          textClass="text-black font-display font-black text-xs sm:text-sm tracking-wider uppercase"
          speedClass="animate-marquee-fast"
        />
        <TickerMarquee
          items={[
            "🥩 RAW & GENTLY-COOKED MEALS",
            "🦮 ELDERLY DOG MOBILITY ROUTINES",
            "🐱 FELINE HYDRATION SECRETS",
            "🐇 RABBIT GI MOTILITY FORAGE",
            "✨ 100% BOARD-CERTIFIED VET REVIEW",
            "🌿 SAFE HERBAL TINCTURE DOSING",
            "💖 48,000+ COMPANION LOVERS",
          ]}
          bgClass="bg-[#FF4D6D] border-b-3 border-black text-white"
          textClass="text-white font-display font-black text-xs sm:text-sm tracking-wider uppercase"
          speedClass="animate-marquee-reverse"
        />
      </div>

      {/* 3. "WHAT YOU'LL GET" — 3 CORE PILLARS */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block bg-[#00F5D4] text-black font-display font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black rotate-[-1deg] mb-2 pop-shadow animate-wiggle">
            THREE PILLARS OF LONGEVITY
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#181126] dark:text-white">
            An Integrative Blueprint for Every Life Stage
          </h2>
          <p className="mt-3 text-base text-slate-800 dark:text-slate-200 font-bold">
            Bridging clinical western veterinary science with time-tested holistic healing modalities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.pillars.map((pillar, idx) => {
            const rotations = ["rotate-[-1.5deg]", "rotate-[1deg]", "rotate-[-1deg]"];
            const bgBadge =
              pillar.color === "coral"
                ? "bg-[#FF4D6D] text-white"
                : pillar.color === "teal"
                ? "bg-[#00F5D4] text-black"
                : "bg-[#7928CA] text-white";

            return (
              <div
                key={pillar.id}
                className={`bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-7 pop-shadow-xl hover-wiggle flex flex-col justify-between ${rotations[idx]}`}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black flex items-center justify-center text-3xl pop-shadow mb-5">
                    {pillar.id === "nutrition" ? "🥩" : pillar.id === "exercise" ? "🎾" : "✨"}
                  </div>

                  <span
                    className={`inline-block font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black mb-3 ${bgBadge}`}
                  >
                    {pillar.tagline}
                  </span>

                  <h3 className="font-display font-black text-2xl text-slate-950 dark:text-white mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                <Link
                  href={pillar.slug}
                  className="w-full py-3 bg-[#FFE600] hover:bg-[#FFF385] text-black font-display font-black text-sm rounded-xl border-2 border-black pop-shadow flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
                >
                  <span>Explore Guides</span>
                  <span>➔</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED ARTICLES CAROUSEL / GRID */}
      <section className="py-14 bg-[#FFF0F3] dark:bg-[#1E142B] border-y-3 border-black transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="bg-[#FF4D6D] text-white font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black pop-shadow rotate-[-2deg] inline-block mb-2">
                FRESH FROM OUR VET COLLECTIVE
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white">
                Featured Health & Longevity Guides
              </h2>
            </div>
            <Link
              href="/blog"
              className="px-5 py-2.5 bg-white dark:bg-slate-800 text-black dark:text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>View All 350+ Articles</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEED_ARTICLES.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PET GALLERY PREVIEW (LIVE FROM PET WALL) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#06D6A0] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[2deg] mb-3 pop-shadow">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>LIVE COMMUNITY GALLERY</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 dark:text-white">
            Meet the Cherished Paws of PawsWell
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 font-medium">
            Over 62,900 happy companions enjoying fresh bowls, joyful zoomies, and loving care.
          </p>
        </div>

        {/* Polaroid Collage Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SEED_PET_WALL.slice(0, 4).map((photo) => (
            <PetWallCard
              key={photo.id}
              photo={photo}
              onOpenLightbox={(p) => setActivePhoto(p)}
            />
          ))}
        </div>

        {/* Join to Post Banner */}
        <div className="mt-8 bg-[#FFE600] border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-display font-black text-2xl text-black">
              Showcase Your Furry, Feathered, or Scaled Friend!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Free to upload. Automated privacy protection: EXIF stripped, only your display name shown.
            </p>
          </div>
          <Link
            href="/pet-wall"
            className="px-6 py-3.5 bg-[#FF4D6D] text-white font-display font-black text-base rounded-2xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            📸 Upload to Pet Wall
          </Link>
        </div>
      </section>

      {/* 6. TRUSTED SPONSOR & PARTNER STRIP */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y-3 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Trusted by Vetted Holistic Health Brands • Exclusive Member Discounts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
            {SEED_PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-3 pop-shadow text-center flex flex-col items-center justify-center hover:scale-105 transition-transform"
              >
                <span className="text-3xl mb-1">{partner.logo}</span>
                <p className="font-display font-bold text-xs truncate max-w-full text-slate-900 dark:text-white">
                  {partner.name}
                </p>
                <span className="bg-[#FFE600] text-black text-[10px] font-black px-1.5 py-0.2 rounded border border-black mt-1">
                  {partner.discountPercent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY STATS ANIMATED COUNTERS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#7928CA] text-white border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="font-display font-black text-4xl sm:text-5xl text-[#FFE600]">
              {siteConfig.stats.communityMembers}
            </span>
            <p className="font-display font-bold text-sm text-purple-200">
              Loving Guardians
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-display font-black text-4xl sm:text-5xl text-[#00F5D4]">
              {siteConfig.stats.petsSupported}
            </span>
            <p className="font-display font-bold text-sm text-purple-200">
              Pets Supported
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-display font-black text-4xl sm:text-5xl text-[#FF4D6D]">
              {siteConfig.stats.vetGuides}
            </span>
            <p className="font-display font-bold text-sm text-purple-200">
              Vet-Reviewed Guides
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-display font-black text-4xl sm:text-5xl text-white">
              {siteConfig.stats.partnerDiscountsSaved}
            </span>
            <p className="font-display font-bold text-sm text-purple-200">
              Saved in Member Perks
            </p>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS STYLED LIKE STICKER NOTES */}
      <section className="py-14 bg-pattern-stripes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-2deg] inline-block mb-2 pop-shadow">
              GUARDIAN LOVE LETTERS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white">
              Notes from Real Pet Parents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Note 1 */}
            <div className="bg-[#FFF385] text-black border-3 border-black rounded-3xl p-6 pop-shadow-lg rotate-[-2deg] relative">
              <div className="w-8 h-8 rounded-full bg-red-400 absolute -top-3 left-1/2 -translate-x-1/2 border border-black flex items-center justify-center text-xs">
                📌
              </div>
              <div className="flex gap-1 text-[#FF4D6D] mb-3">
                {"★★★★★"}
              </div>
              <p className="font-hand font-bold text-xl leading-relaxed mb-4">
                &ldquo;Our 11yo Lab Buster was limping badly on cold mornings. The senior cavaletti drills and turmeric protocol literally gave him back his puppy bounce.&rdquo;
              </p>
              <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-bold">
                <span>— Elena & Buster (Labrador)</span>
                <span className="bg-black text-white px-2 py-0.5 rounded">Verified Member</span>
              </div>
            </div>

            {/* Note 2 */}
            <div className="bg-[#FFCCD5] text-black border-3 border-black rounded-3xl p-6 pop-shadow-lg rotate-[1.5deg] relative">
              <div className="w-8 h-8 rounded-full bg-purple-400 absolute -top-3 left-1/2 -translate-x-1/2 border border-black flex items-center justify-center text-xs">
                📌
              </div>
              <div className="flex gap-1 text-[#FF4D6D] mb-3">
                {"★★★★★"}
              </div>
              <p className="font-hand font-bold text-xl leading-relaxed mb-4">
                &ldquo;The feline kidney hydration guide saved us from total despair after our cat was diagnosed with stage 2 CKD. Her blood numbers stabilized beautifully!&rdquo;
              </p>
              <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-bold">
                <span>— Marcus & Luna (Domestic Cat)</span>
                <span className="bg-black text-white px-2 py-0.5 rounded">Premium Member</span>
              </div>
            </div>

            {/* Note 3 */}
            <div className="bg-[#C7F9CC] text-black border-3 border-black rounded-3xl p-6 pop-shadow-lg rotate-[-1deg] relative">
              <div className="w-8 h-8 rounded-full bg-amber-400 absolute -top-3 left-1/2 -translate-x-1/2 border border-black flex items-center justify-center text-xs">
                📌
              </div>
              <div className="flex gap-1 text-[#FF4D6D] mb-3">
                {"★★★★★"}
              </div>
              <p className="font-hand font-bold text-xl leading-relaxed mb-4">
                &ldquo;Rabbit owners get ignored so often by generic pet sites. Finding real lagomorph herbal forage and GI stasis advice on PawsWell is pure gold!&rdquo;
              </p>
              <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-bold">
                <span>— Chloe & Clover (Lop Rabbit)</span>
                <span className="bg-black text-white px-2 py-0.5 rounded">Pro Family Member</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MEMBERSHIP TEASER */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF5] dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-14 pop-shadow-xl text-center max-w-4xl mx-auto">
          <span className="bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black pop-shadow rotate-[-2deg] inline-block mb-3">
            MEMBERSHIP TIERS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 dark:text-white mb-4">
            Invest in Years of More Tail Wags & Headbutts
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto mb-8">
            Start free, or unlock our complete veterinary library, live clinical Q&As, and partner brand discounts starting at just $12/month.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/membership"
              className="px-8 py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-lg rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all"
            >
              Compare All Membership Plans ➔
            </Link>
            <Link
              href="/signup"
              className="px-6 py-4 bg-white dark:bg-slate-800 text-black dark:text-white font-display font-bold text-base rounded-2xl border-3 border-black pop-shadow hover:scale-105 active:scale-95 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="bg-[#00F5D4] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black pop-shadow rotate-[1deg] inline-block mb-2">
            GOT QUESTIONS?
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border-3 border-black rounded-2xl pop-shadow overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-display font-black text-base sm:text-lg flex items-center justify-between gap-4 text-slate-950 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-[#FF4D6D]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-t-2 border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
      />
    </div>
  );
}
