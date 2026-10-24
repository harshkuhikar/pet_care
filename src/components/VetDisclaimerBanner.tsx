import React from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function VetDisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-[#FFF385] dark:bg-amber-950/40 border-2 border-black rounded-xl p-3 pop-shadow flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-amber-200">
        <ShieldAlert className="w-4 h-4 text-brand-coral shrink-0" />
        <span>
          Educational only. Never substitute for direct veterinary clinical care.{" "}
          <Link href="/disclaimer" className="underline font-bold hover:text-brand-coral">
            Read medical disclaimer
          </Link>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF385] dark:bg-[#2A2010] border-3 border-black rounded-2xl p-4 md:p-5 pop-shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-black pop-shadow flex items-center justify-center shrink-0 text-2xl">
          🩺
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm uppercase tracking-wider text-black dark:text-amber-300 bg-white dark:bg-slate-800 border-2 border-black px-2.5 py-0.5 rounded-full">
              Veterinary Notice
            </span>
            <span className="font-hand font-bold text-base text-purple-700 dark:text-purple-300">
              For Loving Pet Parents
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-amber-100/90 leading-relaxed">
            Content provided on PawsWell is for educational and wellness guidance purposes only and does not diagnose, cure, treat, or replace tailored care from a licensed veterinarian. Always review diet changes, botanical supplements, or exercise protocols with your primary vet.
          </p>
        </div>
      </div>
    </div>
  );
}
