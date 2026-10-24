import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export default function MedicalDisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b-2 border-black/10">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-2xl pop-shadow">
            🩺
          </div>
          <div>
            <span className="font-display font-black text-xs uppercase text-[#FF4D6D]">
              LEGAL & SAFETY DISCLOSURES
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white">
              Veterinary Medical Disclaimer
            </h1>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              1. Educational Guidance Only
            </h2>
            <p>
              The articles, meal plans, calculators, herbal formulas, exercise regimens, and community forum discussions published on {siteConfig.name} (&quot;Platform&quot;) are intended solely for general educational, nutritional, and informational purposes. Nothing contained on this site is intended to serve as veterinary diagnostic services or clinical treatment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              2. No Veterinarian-Client-Patient Relationship (VCPR)
            </h2>
            <p>
              Browsing {siteConfig.name}, submitting questions through the contact form or forum, or consuming content reviewed by our veterinary advisory panel does not establish a Veterinarian-Client-Patient Relationship (VCPR) as defined by veterinary medical boards. Always consult your primary licensed veterinarian before implementing substantial changes to your pet&apos;s diet, supplement regimen, or exercise routine.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              3. No Claims to Cure or Treat Serious Diseases
            </h2>
            <p>
              Integrative pet wellness focuses on vitality, prevention, and complementary comfort. We do not make representations or warranties that raw feeding, herbal tinctures, acupuncture, or laser therapy will cure, mitigate, or reverse systemic pathology, cancer, or life-threatening acute infections.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              4. Affiliate & Sponsorship Disclosure
            </h2>
            <p>
              {siteConfig.name} participates in affiliate and brand partner programs. When you redeem promo codes or click affiliate links to purchase fresh food, functional supplements, or testing kits, we may receive a commission at no additional cost to you. We strictly review ingredients and never accept endorsements for products containing artificial dyes, ethoxyquin, or questionable synthetic additives.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t-2 border-black/10 flex justify-between items-center text-xs font-bold">
          <Link href="/" className="text-[#FF4D6D] underline">
            ← Return to Home
          </Link>
          <span className="text-slate-400">Last Revised: March 2026</span>
        </div>
      </div>
    </div>
  );
}
