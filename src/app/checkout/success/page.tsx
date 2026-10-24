"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { firePawsConfetti } from "@/lib/confetti";
import { CheckCircle2, Sparkles, ArrowRight, Download, Heart } from "lucide-react";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    firePawsConfetti();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl space-y-6">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 rounded-3xl bg-[#00F5D4] border-3 border-black flex items-center justify-center text-4xl mx-auto pop-shadow animate-bounce">
          🎉
        </div>

        <div className="inline-block bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-2deg] pop-shadow">
          WELCOME TO PAWSWELL PREMIUM!
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-950 dark:text-white leading-tight">
          Your Pack Just Got Stronger!
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Your payment was processed securely via Razorpay. A copy of your receipt and subscription confirmation has been dispatched to your email.
        </p>

        {/* Benefits Unlocked Pill */}
        <div className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-5 text-left space-y-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Unlocked: All 350+ Clinical Protocols & Meal Recipes</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Unlocked: Active Member Forum Posting & Expert Q&A</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Unlocked: Exclusive 15%-30% Partner Perks Directory</span>
          </div>
        </div>

        {/* Next Steps Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/welcome"
            className="px-6 py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Pet Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/profile"
            className="px-6 py-4 bg-[#FFE600] text-black font-display font-bold text-sm rounded-2xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all"
          >
            View My Profile & Pets
          </Link>
        </div>
      </div>
    </div>
  );
}
