import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl space-y-8">
        <div className="pb-6 border-b-2 border-black/10">
          <span className="font-display font-black text-xs uppercase text-purple-600">
            AGREEMENT & SUBSCRIPTIONS
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white mt-1">
            Terms of Service
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or creating a membership on {siteConfig.name}, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              2. Subscription Billing & Automatic Renewals
            </h2>
            <p>
              Paid memberships (Monthly and Annual tiers) renew automatically at the conclusion of each billing cycle unless cancelled prior to the renewal date. You may cancel anytime directly through your billing portal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              3. 30-Day Wag-Guaranteed Refund Policy
            </h2>
            <p>
              We stand proudly behind our integrative clinical guides. If you are unsatisfied for any reason within 30 days of your initial subscription purchase, email our support team for a full refund of your current charge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              4. Pet Wall & Community Content Ownership
            </h2>
            <p>
              You retain all ownership rights to any photographs you upload to the Pet Wall or discussions you initiate. By uploading, you grant {siteConfig.name} a non-exclusive license to display the photo on our public gallery. You confirm that uploaded images do not contain human faces, copyrighted material, or personal phone numbers.
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
