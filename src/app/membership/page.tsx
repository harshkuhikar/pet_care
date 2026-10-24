"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEED_PLANS } from "@/lib/seedData";
import { MembershipPlan, UserProfile } from "@/types";
import { getCurrentUser } from "@/lib/storage";
import { RazorpayCheckoutModal } from "@/components/RazorpayCheckoutModal";
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Zap,
  Heart,
  ArrowRight,
  QrCode,
  Smartphone,
  Lock,
} from "lucide-react";

export default function MembershipPage() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setUser(getCurrentUser());
    };
    handleSync();

    if (typeof window !== "undefined") {
      window.addEventListener("pawswell_user_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("pawswell_user_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, []);

  const getUserPlanId = () => {
    if (!user) return null;
    if (user.role === "pro" || user.plan === "pro") return "pro";
    if (
      user.role === "premium" ||
      user.role === "admin" ||
      user.plan === "monthly" ||
      user.plan === "yearly" ||
      user.plan === "premium"
    )
      return "premium";
    return "free";
  };
  const activePlanId = getUserPlanId();

  const handleSelectPlan = (plan: MembershipPlan) => {
    if (plan.id === activePlanId) {
      router.push("/profile");
      return;
    }
    if (plan.id === "free") {
      router.push("/signup");
      return;
    }
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  const comparisonFeatures = [
    { name: "Sunday Dispatch Newsletter", free: true, premium: true, pro: true },
    { name: "Public Pet Wall Photo Uploads", free: true, premium: true, pro: true },
    { name: "Community Forum Reading", free: true, premium: true, pro: true },
    { name: "350+ Deep-Dive Clinical Vet Protocols", free: false, premium: true, pro: true },
    { name: "Printable Longevity & Diet Recipe PDFs", free: false, premium: true, pro: true },
    { name: "Active Posting & Replying in Community Forum", free: false, premium: true, pro: true },
    { name: "Monthly Live Q&A with Holistic Vets", free: false, premium: true, pro: true },
    { name: "Ad-Light Reading Experience", free: false, premium: true, pro: true },
    { name: "Exclusive 15% - 30% Partner Brand Discounts", free: false, premium: true, pro: true },
    { name: "Unlimited Pet Profiles & Health Notes", free: false, premium: false, pro: true },
    { name: "Monthly Seasonal Health Checklist per Pet", free: false, premium: false, pro: true },
    { name: "Priority Vet Q&A Submissions & Review", free: false, premium: false, pro: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
      {/* Page Header with High-Contrast Typography & Animations */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        <div className="absolute -top-4 left-6 text-3xl animate-float-slow hidden sm:block">👑</div>
        <div className="absolute -top-2 right-8 text-3xl animate-bounce hidden sm:block">🌟</div>

        <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-4 py-1.5 rounded-full border-2 border-black rotate-[-2deg] mb-3 pop-shadow animate-wiggle">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>JOIN 48,000+ DEVOTED PET GUARDIANS</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#181126] dark:text-white leading-tight">
          Invest in Years of More Tail Wags & Headbutts.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-bold max-w-2xl mx-auto">
          Choose a plan that fits your pack. Enjoy unfiltered access to holistic protocols, personalized recipes, and our veterinary advisory collective.
        </p>

        {/* Monthly vs Yearly Billing Toggle with "Save 20%" Sticker */}
        <div className="mt-8 inline-flex items-center gap-3 bg-white dark:bg-slate-900 border-3 border-black rounded-2xl p-2 pop-shadow">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-black transition-all cursor-pointer ${
              !isYearly
                ? "bg-[#FFE600] text-black pop-shadow scale-105"
                : "text-slate-800 dark:text-slate-200 hover:text-black"
            }`}
          >
            Monthly Billing
          </button>

          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-black transition-all relative cursor-pointer ${
              isYearly
                ? "bg-[#FF4D6D] text-white pop-shadow scale-105"
                : "text-slate-800 dark:text-slate-200 hover:text-black"
            }`}
          >
            <span>Annual Billing</span>
            {/* Sticker with continuous wiggle */}
            <span className="absolute -top-3.5 -right-3 bg-[#FFE600] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black rotate-12 pop-shadow animate-wiggle">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
        {SEED_PLANS.map((plan) => {
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          const billingSuffix = isYearly ? "/year" : "/month";
          const isCurrentPlan = plan.id === activePlanId;

          return (
            <div
              key={plan.id}
              className={`relative border-4 border-black rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all pop-shadow-xl ${
                isCurrentPlan
                  ? "bg-white dark:bg-slate-900 ring-4 ring-[#00F5D4] scale-102 z-10"
                  : plan.popular
                  ? "bg-white dark:bg-slate-900 ring-4 ring-[#FF4D6D] scale-102 z-10"
                  : "bg-white dark:bg-slate-900"
              }`}
            >
              {/* Badge */}
              {isCurrentPlan ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00F5D4] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-1deg] pop-shadow whitespace-nowrap">
                  ✓ YOUR CURRENT ACTIVE PLAN
                </div>
              ) : plan.badge ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-1deg] pop-shadow whitespace-nowrap">
                  {plan.badge}
                </div>
              ) : null}

              <div>
                {/* Title */}
                <h3 className="font-display font-black text-2xl text-[#181126] dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold mb-6 min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-black text-5xl text-[#181126] dark:text-white">
                      ${price}
                    </span>
                    <span className="text-sm font-black text-slate-600 dark:text-slate-400">
                      {price > 0 ? billingSuffix : " forever"}
                    </span>
                  </div>
                  {isYearly && price > 0 && (
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 block mt-1">
                      Just ${(price / 12).toFixed(1)}/month billed annually
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00BB9C] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-4 rounded-2xl border-3 border-black font-display font-black text-base flex items-center justify-center gap-2 pop-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isCurrentPlan
                    ? "bg-[#00F5D4] text-black font-black"
                    : plan.popular
                    ? "bg-[#FF4D6D] hover:bg-[#E63956] text-white pop-shadow-coral animate-pulse-badge"
                    : "bg-[#FFE600] hover:bg-[#FFF385] text-black"
                }`}
              >
                {isCurrentPlan ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-black" />
                    <span>Active Plan (Manage in Profile)</span>
                  </>
                ) : (
                  <>
                    {plan.popular && <Crown className="w-5 h-5 text-[#FFE600]" />}
                    <span>
                      {plan.id === "free"
                        ? "Join Free Explorer"
                        : activePlanId === "premium" && plan.id === "pro"
                        ? "Upgrade to Family Pro"
                        : `Get ${plan.name}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Direct UPI QR Code Payment Showcase Block */}
      <section className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl mb-16 relative overflow-hidden">
        <div className="absolute top-3 right-4 hidden sm:inline-flex items-center gap-1.5 bg-[#00F5D4] text-black font-display font-black text-xs px-3 py-1 rounded-full border border-black rotate-2 pop-shadow">
          <Smartphone className="w-3.5 h-3.5" />
          <span>INSTANT UPI ACTIVATION</span>
        </div>

        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-1deg] mb-2 pop-shadow">
            <QrCode className="w-3.5 h-3.5 text-purple-700" />
            <span>PAY WITH ANY UPI APP</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
            Scan & Pay Directly via Razorpay BHIM UPI
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1 max-w-2xl">
            Scan the verified merchant QR code with Google Pay, PhonePe, Paytm, or BHIM. Your membership activates immediately upon verification!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
          {/* Left: Merchant QR Code Card */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="bg-[#FFFDF5] dark:bg-slate-800 border-3 border-black rounded-2xl p-4 pop-shadow text-center max-w-[260px] w-full">
              <div className="bg-[#00F5D4] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black inline-block mb-2">
                VERIFIED MERCHANT QR
              </div>
              <div className="rounded-xl border-2 border-black overflow-hidden bg-white p-2 mb-2">
                <img
                  src="/images/razorpay-upi-qr.jpg"
                  alt="Razorpay BHIM UPI QR Code - Harsh Jitendrabhai Kuhikar"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
              <p className="font-display font-black text-xs text-slate-900 dark:text-white leading-tight">
                HARSH JITENDRABHAI KUHIKAR
              </p>
              <p className="text-[11px] font-bold text-purple-600 dark:text-yellow-400 mt-0.5">
                Powered by Razorpay
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-black/20">GPay</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-black/20">PhonePe</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-black/20">Paytm</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-black/20">BHIM</span>
              </div>
            </div>
          </div>

          {/* Right: How to Pay & Quick Activation Steps */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-3.5 pop-shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center font-display font-black text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
                    Scan with any UPI App
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Open Google Pay, PhonePe, Paytm, or BHIM and scan the QR code above.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-3.5 pop-shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#00F5D4] border-2 border-black flex items-center justify-center font-display font-black text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
                    Select Your Plan Amount
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <strong>PawsWell Premium:</strong> ₹960/yr ($12/mo) • <strong>Family Pro:</strong> ₹1,920/yr ($24/mo)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-3.5 pop-shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#FF4D6D] text-white border-2 border-black flex items-center justify-center font-display font-black text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
                    Complete & Enjoy VIP Protocols
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Click the button below to launch checkout or enter your UTR reference for instant upgrade.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const premiumPlan = SEED_PLANS.find((p) => p.id === "premium") || SEED_PLANS[1];
                  handleSelectPlan(premiumPlan);
                }}
                className="flex-1 py-3.5 px-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#FFE600]" />
                <span>Launch UPI Checkout (Premium)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const proPlan = SEED_PLANS.find((p) => p.id === "pro") || SEED_PLANS[2];
                  handleSelectPlan(proPlan);
                }}
                className="py-3.5 px-4 bg-[#FFE600] hover:bg-[#FFF385] text-black font-display font-black text-sm rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Family Pro Checkout ➔</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 30-Day Wag-Guaranteed Refund Badge */}
      <div className="max-w-2xl mx-auto bg-[#FFF385] dark:bg-amber-950/60 border-3 border-black rounded-3xl p-6 pop-shadow-lg text-center mb-20 flex flex-col sm:flex-row items-center gap-4 justify-center">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-black flex items-center justify-center text-3xl pop-shadow shrink-0">
          🛡️
        </div>
        <div className="text-left">
          <h4 className="font-display font-black text-lg text-black dark:text-amber-200">
            30-Day Wag-Guaranteed 100% Refund Policy
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-amber-100 font-medium">
            If our guides don&apos;t bring tangible vibrancy, comfort, and joy to your companion, email us for a prompt, courteous full refund. No questions asked.
          </p>
        </div>
      </div>

      {/* Full Feature Comparison Table */}
      <section id="compare" className="mb-20">
        <div className="text-center mb-10">
          <h2 className="font-display font-black text-3xl text-slate-950 dark:text-white">
            Feature Comparison Matrix
          </h2>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 border-4 border-black rounded-3xl pop-shadow-xl p-4 sm:p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-3 border-black">
                <th className="p-4 font-display font-black text-sm uppercase text-slate-500">
                  Feature / Capability
                </th>
                <th className="p-4 font-display font-black text-center text-sm text-slate-900 dark:text-white">
                  Free Explorer
                </th>
                <th className="p-4 font-display font-black text-center text-sm text-[#FF4D6D] bg-[#FFF0F3] dark:bg-slate-800 rounded-t-xl">
                  PawsWell Premium
                </th>
                <th className="p-4 font-display font-black text-center text-sm text-purple-700 dark:text-purple-300">
                  Family Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-semibold">
              {comparisonFeatures.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 text-slate-900 dark:text-white">{feat.name}</td>
                  <td className="p-4 text-center">
                    {feat.free ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center bg-[#FFF0F3]/50 dark:bg-slate-800/40">
                    {feat.premium ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {feat.pro ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Razorpay Checkout Modal Trigger */}
      {selectedPlan && (
        <RazorpayCheckoutModal
          plan={selectedPlan}
          isYearly={isYearly}
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            setCheckoutOpen(false);
            router.push("/checkout/success");
          }}
        />
      )}
    </div>
  );
}
