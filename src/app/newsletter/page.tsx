"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SEED_NEWSLETTERS } from "@/lib/seedData";
import { NewsletterIssue, UserProfile } from "@/types";
import { subscribeToNewsletter, getCurrentUser } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import {
  Mail,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Send,
  X,
  Crown,
  Download,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeIssue, setActiveIssue] = useState<NewsletterIssue | null>(null);
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

  const isUserPremium = Boolean(
    user &&
      (user.role === "premium" ||
        user.role === "pro" ||
        user.role === "admin" ||
        user.plan === "monthly" ||
        user.plan === "yearly" ||
        user.plan === "pro" ||
        user.plan === "premium")
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    subscribeToNewsletter(email);
    setSubscribed(true);
    firePawsConfetti();
  };

  const handleDownloadProtocol = (issueNumber: number) => {
    firePawsConfetti();
    alert(`Downloading: PawsWell Sunday Dispatch #${issueNumber} Printable Protocol (PDF)!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero Card */}
      <div className="bg-[#FFE600] text-black border-4 border-black rounded-3xl p-8 sm:p-14 pop-shadow-xl mb-14 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-black text-[#FFE600] font-display font-black text-xs px-3.5 py-1 rounded-full border border-black rotate-[-2deg]">
            <Mail className="w-3.5 h-3.5" />
            <span>THE SUNDAY DISPATCH • DELIVERED WEEKLY</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight text-slate-950">
            The #1 Integrative Pet Health Newsletter
          </h1>

          <p className="text-base sm:text-lg text-slate-900 font-bold leading-relaxed">
            Every Sunday morning, 48,000+ pet parents get 1 clinical vet recipe, 1 physical rehab drill, and 1 exclusive partner discount. 100% fluff-free.
          </p>

          {/* Member Status Box or Subscription Box */}
          <div className="pt-2">
            {isUserPremium ? (
              <div className="bg-white border-3 border-black rounded-2xl p-5 pop-shadow space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#00F5D4] text-black font-display font-black text-xs px-2.5 py-0.5 rounded-full border border-black flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-purple-700" />
                    <span>VIP SUBSCRIBER STATUS ACTIVE</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Delivering to {user?.email}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Welcome back, {user?.displayName}! You have full VIP access to every public and premium dispatch, masterclass recording, and downloadable diet chart below.
                </p>
              </div>
            ) : subscribed ? (
              <div className="bg-white border-3 border-black rounded-2xl p-4 pop-shadow flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-display font-black text-base text-slate-950">You&apos;re Subscribed!</h4>
                  <p className="text-xs font-bold text-slate-700">
                    Watch for Issue #85 in your inbox this upcoming Sunday morning!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-lg">
                <input
                  type="email"
                  required
                  placeholder="Enter your favorite human email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 text-sm font-bold rounded-2xl border-3 border-black bg-white text-slate-950 focus:outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Join Free</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Decorative Graphic */}
        <div className="absolute right-6 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
          💌 🐶 🐱
        </div>
      </div>

      {/* Past Issues Archive Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-black text-3xl text-[#181126] dark:text-white">
              The Sunday Dispatch Archive
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
              Browse past public and premium subscriber issues.
            </p>
          </div>
          <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400">
            {SEED_NEWSLETTERS.length} Issues Archived
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_NEWSLETTERS.map((issue) => {
            const isUnlocked = !issue.isPremium || isUserPremium;

            return (
              <div
                key={issue.id}
                className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[8px_8px_0px_#181126] dark:hover:shadow-[8px_8px_0px_#FFE600] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-slate-600 dark:text-slate-400 font-mono">
                      {issue.date}
                    </span>
                    {issue.isPremium ? (
                      isUserPremium ? (
                        <span className="bg-[#00F5D4] text-black font-display font-black text-[10px] px-2.5 py-0.5 rounded-full border border-black flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-purple-700" />
                          <span>UNLOCKED (PREMIUM VIP)</span>
                        </span>
                      ) : (
                        <span className="bg-[#FFE600] text-black font-display font-black text-[10px] px-2.5 py-0.5 rounded-full border border-black flex items-center gap-1 animate-pulse-badge">
                          <Lock className="w-2.5 h-2.5" />
                          <span>PREMIUM ISSUE</span>
                        </span>
                      )
                    ) : (
                      <span className="bg-[#00F5D4] text-black font-display font-black text-[10px] px-2.5 py-0.5 rounded-full border border-black">
                        FREE PUBLIC ISSUE
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-xl text-[#181126] dark:text-white leading-snug mb-2 hover:text-[#FF4D6D] transition-colors">
                    {issue.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed mb-4">
                    {issue.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-slate-200 text-[11px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{issue.readTime}</span>
                  <button
                    onClick={() => setActiveIssue(issue)}
                    className="text-xs font-display font-black uppercase text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isUnlocked ? "Read Full Issue ➔" : "Preview Issue ➔"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Issue Modal (Full Content for Premium, Gated Teaser for Free) */}
      {activeIssue && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-fade-in"
          onClick={() => setActiveIssue(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl relative my-auto text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveIssue(null)}
              aria-label="Close issue"
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-black bg-slate-100 dark:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5 text-black dark:text-white" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-slate-500">
                {activeIssue.date} • {activeIssue.readTime}
              </span>
              {activeIssue.isPremium && isUserPremium && (
                <span className="bg-[#00F5D4] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-700" />
                  <span>VIP UNLOCKED</span>
                </span>
              )}
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mb-4 pr-8">
              {activeIssue.title}
            </h3>

            {/* Check if Locked for non-premium user */}
            {activeIssue.isPremium && !isUserPremium ? (
              <div className="bg-[#FFF0F3] dark:bg-slate-800 border-3 border-black rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-2xl mx-auto pop-shadow">
                  👑
                </div>
                <h4 className="font-display font-black text-xl text-slate-950 dark:text-white">
                  Subscriber-Only Dispatch
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 max-w-md mx-auto">
                  {activeIssue.excerpt}
                </p>
                <div className="pt-2">
                  <Link
                    href="/membership"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all"
                  >
                    <Crown className="w-4 h-4 text-[#FFE600]" />
                    <span>Unlock with PawsWell Premium ($12/mo)</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Full Unlocked Content */
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <div className="p-4 bg-[#FFFDF5] dark:bg-slate-800 rounded-2xl border-2 border-black space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-display font-black text-xs uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Board-Certified Clinical Dispatch</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeIssue.excerpt}
                  </p>
                </div>

                {/* Issue Details Specific Breakdown */}
                {activeIssue.issueNumber === 83 && (
                  <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    <h4 className="font-display font-black text-lg text-slate-950 dark:text-white">
                      Clinical Protocol: Feline Moisture Balance & Broth Formulations
                    </h4>
                    <p>
                      Cats in early stages of chronic renal compromise require high-moisture nutrition (minimum 75-80% hydration) to prevent prerenal azotemia. Simmering pasture-raised chicken feet and beef marrow bones for 24 hours at 190°F extracts bioavailable glycine and proline without excessive phosphorus concentration.
                    </p>
                    <div className="overflow-x-auto border-2 border-black rounded-xl bg-white dark:bg-slate-800 p-3">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-black font-black">
                            <th className="p-2">Ingredient</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Clinical Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          <tr>
                            <td className="p-2 font-bold">Unsalted Chicken Feet</td>
                            <td className="p-2">1.5 lbs</td>
                            <td className="p-2">Natural collagen & joint GAGs</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold">Filtered Spring Water</td>
                            <td className="p-2">3 Liters</td>
                            <td className="p-2">Low-mineral hydration vehicle</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold">Apple Cider Vinegar</td>
                            <td className="p-2">1 tbsp</td>
                            <td className="p-2">Facilitates gentle mineral extraction</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeIssue.issueNumber === 81 && (
                  <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    <h4 className="font-display font-black text-lg text-slate-950 dark:text-white">
                      Masterclass Recording Transcript & Key Clinical Takeaways
                    </h4>
                    <p>
                      Dr. Aris Thorne outlines the three-tier intervention for canine cognitive decline: S-adenosylmethionine (SAMe) for cellular methylation, standardized Lion&apos;s Mane mushroom extract for nerve growth stimulation, and low-level red light therapy for circadian regulation.
                    </p>
                    <div className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-xl p-4 space-y-2">
                      <p className="font-black text-xs uppercase text-purple-700 dark:text-yellow-400">
                        Topical Dosing Summary:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-xs">
                        <li><strong>SAMe (Enteric Coated):</strong> 20mg/kg on an empty stomach 1 hour before breakfast.</li>
                        <li><strong>Lion&apos;s Mane (10:1 Extract):</strong> 250mg per 25 lbs body weight twice daily.</li>
                        <li><strong>Evening Red Spectrum Light:</strong> 15 minutes at dusk to trigger pineal melatonin synthesis.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeIssue.issueNumber === 84 && (
                  <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    <h4 className="font-display font-black text-lg text-slate-950 dark:text-white">
                      The Hepatic Phase II Conjugation Protocol
                    </h4>
                    <p>
                      Commercial &apos;detox&apos; blends often overstimulate Phase I Cytochrome P450 enzymes while failing to support Phase II glucuronidation, leading to accumulation of toxic intermediate metabolites. Real support requires silymarin from Milk Thistle standardized to 80% combined with NAC.
                    </p>
                  </div>
                )}

                {activeIssue.issueNumber === 82 && (
                  <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                    <h4 className="font-display font-black text-lg text-slate-950 dark:text-white">
                      Holistic Multi-Layered Tick Defense
                    </h4>
                    <p>
                      Formulate an organic Cedarwood oil mist (0.5% concentration in distilled water with organic witch hazel) applied to paws and underbelly prior to hiking in high-brush woodlands. Pair with daily manual tick checks using a fine-toothed flea comb.
                    </p>
                  </div>
                )}

                {/* Printable Action Card / Download */}
                <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <FileText className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Includes Printable PDF Reference Sheet</span>
                  </div>
                  <button
                    onClick={() => handleDownloadProtocol(activeIssue.issueNumber)}
                    className="px-4 py-2.5 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Protocol</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
