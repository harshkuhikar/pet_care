"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { subscribeToNewsletter } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import { VetDisclaimerBanner } from "./VetDisclaimerBanner";
import {
  Heart,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    subscribeToNewsletter(email);
    setSubscribed(true);
    firePawsConfetti();
  };

  return (
    <footer className="mt-20 border-t-4 border-black bg-[#FFFDF5] dark:bg-[#120B1C] transition-colors relative overflow-hidden">
      {/* Decorative Top Scallop / Stripe Strip */}
      <div className="h-3 w-full bg-gradient-to-r from-[#FF4D6D] via-[#FFE600] to-[#00F5D4]" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {/* Newsletter Callout Box (Maximalist Card) */}
        <div className="relative mb-14 bg-[#FF4D6D] text-white border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl overflow-hidden">
          {/* Background Decorative Doodles */}
          <div className="absolute top-2 right-4 text-5xl opacity-20 pointer-events-none select-none">
            🐾 🥩 🌿
          </div>
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-2deg] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>THE SUNDAY DISPATCH • 48,000+ READERS</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-4xl leading-tight mb-2">
              Transform Your Pet&apos;s Longevity Every Sunday Morning.
            </h3>
            <p className="text-sm sm:text-base text-rose-100 font-medium mb-6">
              Get 1 vet-reviewed nutrition recipe, 1 physical rehab tip, and exclusive member discount codes. No spam, no ultra-processed junk.
            </p>

            {subscribed ? (
              <div className="bg-white text-black border-2 border-black rounded-2xl p-4 pop-shadow flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Welcome to the Pack!</h4>
                  <p className="text-xs text-slate-600">
                    Your first free Longevity Starter Kit is winging its way to your inbox!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your favorite human email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-black font-semibold text-sm px-4 py-3.5 rounded-2xl border-3 border-black pop-shadow focus:outline-none focus:ring-4 focus:ring-[#FFE600]"
                />
                <button
                  type="submit"
                  className="bg-[#FFE600] hover:bg-[#FFF385] text-black font-display font-black text-sm px-6 py-3.5 rounded-2xl border-3 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Subscribe Free</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#00F5D4] border-2 border-black flex items-center justify-center pop-shadow">
                <span className="text-xl">🐾</span>
              </div>
              <span className="font-display font-black text-2xl text-slate-900 dark:text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium max-w-sm">
              The premier integrative pet wellness magazine and community. Supporting companion animals with whole foods, therapeutic movement, and holistic healing modalities.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-bold bg-[#FFE600] text-black px-2.5 py-1 rounded-lg border border-black">
                WCAG AA Compliant
              </span>
              <span className="text-xs font-bold bg-[#00F5D4] text-black px-2.5 py-1 rounded-lg border border-black">
                Vet Advisory Board
              </span>
            </div>
          </div>

          {/* Column: Health Guides */}
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Health Pillars
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {siteConfig.footerNav.topics.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#FF4D6D] hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Community & Perks */}
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {siteConfig.footerNav.community.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#FF4D6D] hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Platform & Legal */}
          <div>
            <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {siteConfig.footerNav.company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#FF4D6D] hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vet Medical Disclaimer Banner */}
        <div className="mb-8">
          <VetDisclaimerBanner />
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t-2 border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          <p>© 2026 {siteConfig.name} Integrative Collective. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:underline">Medical Disclaimer</Link>
            <span>•</span>
            <Link href="/community-guidelines" className="hover:underline">Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
