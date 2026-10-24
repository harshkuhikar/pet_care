import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl space-y-8">
        <div className="pb-6 border-b-2 border-black/10">
          <span className="font-display font-black text-xs uppercase text-[#00BB9C]">
            PRIVACY & DATA PROTECTION
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white mt-1">
            Privacy Policy
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              1. Our Data Minimization Commitment
            </h2>
            <p>
              At {siteConfig.name}, we believe pet wellness should never compromise guardian privacy. We only collect the minimal information necessary to deliver your subscription, process Razorpay billing, and allow you to participate in community discussions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              2. Pet Wall Automatic EXIF & GPS Metadata Stripping
            </h2>
            <p>
              When you upload a companion photo to the public Pet Wall, our client-side software automatically strips all EXIF camera information, GPS coordinates, device serial numbers, and timestamp headers before rendering. The public wall displays strictly the pet photograph and your chosen display name. We never expose your email, real identity, geographic location, or private pet health records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              3. Private Pet Health Records
            </h2>
            <p>
              All health notes, dietary sensitivities, and allergy records logged under your profile are strictly private and stored with row-level security. They are never indexed publicly or shared with commercial sponsor partners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              4. GDPR & CCPA Rights: Export and Deletion
            </h2>
            <p>
              Under global data privacy frameworks (including GDPR, CCPA, and UK GDPR), you hold the right to export a complete copy of all your account data in standard JSON format or permanently delete your account at any time directly through your Profile Dashboard.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t-2 border-black/10 flex justify-between items-center text-xs font-bold">
          <Link href="/" className="text-[#FF4D6D] underline">
            ← Return to Home
          </Link>
          <span className="text-slate-400">Effective Date: March 2026</span>
        </div>
      </div>
    </div>
  );
}
