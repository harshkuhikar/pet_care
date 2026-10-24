"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SEED_PARTNERS } from "@/lib/seedData";
import { Partner } from "@/types";
import { firePawsConfetti } from "@/lib/confetti";
import {
  Sparkles,
  Tag,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  Users,
  Mail,
  Award,
} from "lucide-react";

export default function PartnersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>("all");

  // Media kit request form state
  const [brandName, setBrandName] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandCategory, setBrandCategory] = useState("Fresh Food");
  const [mediaKitSent, setMediaKitSent] = useState(false);

  const handleCopyCode = (partner: Partner) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(partner.discountCode);
      setCopiedId(partner.id);
      firePawsConfetti();
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleMediaKitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandEmail) return;
    setMediaKitSent(true);
    firePawsConfetti();
  };

  const filteredPartners = SEED_PARTNERS.filter((p) => {
    if (partnerTypeFilter === "all") return true;
    return p.category === partnerTypeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-2deg] mb-3 pop-shadow">
          <Tag className="w-3.5 h-3.5" />
          <span>VETTED PARTNER DIRECTORY & EXCLUSIVE CODES</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-950 dark:text-white leading-tight">
          Holistic Brands We Trust With Our Own Pets
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
          Every brand featured here passes our veterinary team&apos;s stringent ingredient and ethical sourcing review.
        </p>
      </div>

      {/* Compliance Disclaimer Banner */}
      <div className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-4 pop-shadow mb-10 flex items-center justify-between gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>
            <strong>Transparency Pledge:</strong> Some links below are affiliate partnerships. When you save with our exclusive codes, PawsWell may earn a small commission that funds independent laboratory food testing.
          </span>
        </div>
        <Link href="/disclaimer" className="underline font-black hover:text-[#FF4D6D] shrink-0">
          Affiliate Disclosure
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          "all",
          "Fresh Food",
          "Supplements",
          "Holistic Gear",
          "Testing & DNA",
          "Aromatherapy",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setPartnerTypeFilter(cat)}
            className={`px-4 py-2 rounded-xl border-2 border-black font-display font-black text-xs transition-all cursor-pointer ${
              partnerTypeFilter === cat
                ? "bg-[#FF4D6D] text-white pop-shadow scale-105"
                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-black"
            }`}
          >
            {cat === "all" ? "All Vetted Brands" : cat}
          </button>
        ))}
      </div>

      {/* Partners Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 pop-shadow-xl flex flex-col justify-between hover-wiggle transition-all"
          >
            <div>
              {/* Header with Logo & Sponsored Tag */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black flex items-center justify-center text-3xl pop-shadow">
                  {partner.logo}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-[#FFE600] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black uppercase">
                    {partner.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {partner.isSponsored ? "Sponsored Partner" : "Vetted Affiliate"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-black text-2xl text-slate-950 dark:text-white mb-2">
                {partner.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                {partner.description}
              </p>

              {/* Exclusive Perk Pill */}
              <div className="bg-[#FFF0F3] dark:bg-slate-800 border border-black/20 rounded-xl p-2.5 mb-6 text-xs font-bold text-[#FF4D6D] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Bonus: {partner.exclusivePerk}</span>
              </div>
            </div>

            {/* Discount Code Box & CTA */}
            <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-xl p-2.5">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Exclusive Code:
                  </span>
                  <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                    {partner.discountCode}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(partner)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-black font-display font-black text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    copiedId === partner.id
                      ? "bg-emerald-400 text-black"
                      : "bg-[#FFE600] text-black hover:scale-105"
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === partner.id ? "Copied!" : partner.discountPercent}</span>
                </button>
              </div>

              <a
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-black hover:bg-slate-800 text-white font-display font-black text-xs rounded-xl border border-black flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
              >
                <span>Visit Brand Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* "BECOME A PARTNER" / MEDIA KIT REQUEST SECTION */}
      <section id="media-kit" className="bg-[#7928CA] text-white border-4 border-black rounded-3xl p-8 sm:p-14 pop-shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Media Kit Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-2deg]">
              <Award className="w-3.5 h-3.5 text-purple-700" />
              <span>SPONSORSHIP & BRAND COLLABORATIONS</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl text-white leading-tight">
              Put Your Pet Brand in Front of 48,000+ Highly Engaged Guardians
            </h2>

            <p className="text-sm sm:text-base text-purple-200 font-medium leading-relaxed">
              Our audience consists of passionate dog, cat, rabbit, and companion parents who invest actively in raw food, veterinary botanicals, rehabilitation gear, and wellness products.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#5C1D99] border-2 border-black rounded-2xl p-4">
                <span className="font-display font-black text-3xl text-[#FFE600]">68.4%</span>
                <p className="text-xs font-bold text-purple-200 mt-1">Average Newsletter Open Rate</p>
              </div>
              <div className="bg-[#5C1D99] border-2 border-black rounded-2xl p-4">
                <span className="font-display font-black text-3xl text-[#00F5D4]">$180k+</span>
                <p className="text-xs font-bold text-purple-200 mt-1">Member Discount Value Redeemed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Media Kit Form */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl text-black dark:text-white">
            <h3 className="font-display font-black text-2xl mb-1 text-slate-950 dark:text-white">
              Request Our 2026 Partner Media Kit
            </h3>
            <p className="text-xs text-slate-500 font-bold mb-6">
              Receive pricing for newsletter sponsorship slots, dedicated email blasts, and featured articles.
            </p>

            {mediaKitSent ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-display font-black text-lg text-emerald-950">
                  Media Kit Sent to Your Inbox!
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Our partnerships team will reach out within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMediaKitSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Earth Animal Botanicals"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partnerships@brand.com"
                    value={brandEmail}
                    onChange={(e) => setBrandEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Product Category
                  </label>
                  <select
                    value={brandCategory}
                    onChange={(e) => setBrandCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  >
                    <option value="Fresh Food">Fresh / Raw Pet Food</option>
                    <option value="Supplements">Functional Supplements & Herbs</option>
                    <option value="Holistic Gear">Orthopedic & Mobility Gear</option>
                    <option value="Diagnostics">At-Home Microbiome & DNA Testing</option>
                    <option value="Other">Other Holistic Wellness</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Media Kit & Rate Card</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
