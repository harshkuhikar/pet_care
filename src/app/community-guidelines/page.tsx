import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl space-y-8">
        <div className="pb-6 border-b-2 border-black/10">
          <span className="font-display font-black text-xs uppercase text-[#FF4D6D]">
            RESPECT & SAFETY
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white mt-1">
            Community & Pet Wall Guidelines
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          <div className="bg-[#FFF0F3] dark:bg-slate-800 border-2 border-black rounded-2xl p-4 pop-shadow">
            <h3 className="font-display font-black text-base text-[#FF4D6D] mb-1">
              Our Core Golden Rule
            </h3>
            <p>
              Every animal and pet parent arrives here with a unique journey. Treat fellow members with empathy, kindness, and open-minded encouragement.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              Pet Wall Photo Rules
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>No Human Faces:</strong> To protect privacy and keep the spotlight solely on our companions, do not upload photos clearly depicting identifiable human faces.
              </li>
              <li>
                <strong>You Must Own the Photo:</strong> Only upload pictures of pets you personally parent, foster, or have explicit permission to showcase.
              </li>
              <li>
                <strong>No Graphic Distress or Trauma:</strong> Photos depicting open surgical wounds, animal cruelty, or severe distress will be removed immediately.
              </li>
              <li>
                <strong>No Advertising or Links in Images:</strong> Do not watermark or embed promotional URLs or contact phone numbers onto photos.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              Discussion Forum Etiquette
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>Never Instruct Another Guardian to Defy Emergency Care:</strong> Always respect clinical diagnoses and encourage communication with treating veterinarians.
              </li>
              <li>
                <strong>Respect Dietary Differences:</strong> Guardians feed kibble, gently-cooked, dehydrated, and raw based on their animal&apos;s tolerances and household circumstances. Judgmental shaming is not tolerated.
              </li>
              <li>
                <strong>Zero Tolerance for Harassment:</strong> Hate speech, personal attacks, or aggressive behavior results in immediate account suspension.
              </li>
            </ul>
          </section>
        </div>

        <div className="pt-6 border-t-2 border-black/10 flex justify-between items-center text-xs font-bold">
          <Link href="/community" className="text-[#FF4D6D] underline">
            ← Back to Community Forum
          </Link>
          <span className="text-slate-400">PawsWell Moderation Collective</span>
        </div>
      </div>
    </div>
  );
}
