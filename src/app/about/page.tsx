"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, Heart, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const advisors = [
    {
      name: "Dr. Aris Thorne, DVM, CVA",
      role: "Chief Integrative Officer & TCVM Acupuncturist",
      bio: "18 years clinical practice specializing in microbiome repopulation, non-invasive laser therapy, and palliative senior canine care.",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      tag: "Canine TCVM",
    },
    {
      name: "Dr. Elena Rostova, DVM",
      role: "Board Certified Feline Specialist",
      bio: "Former university clinician passionate about gentle kidney hydration strategies, low-stress handling, and feline behavioral enrichment.",
      avatar: "https://images.unsplash.com/photo-1594824813627-2c90c74b8686?auto=format&fit=crop&w=400&q=80",
      tag: "Feline Nephrology",
    },
    {
      name: "Dr. Lilian Ward, MRCVS",
      role: "Exotic & Small Companion Veterinarian",
      bio: "Dedicated lagomorph, avian, and exotic mammal expert championing high-fiber botanical forage and digestive stasis prevention.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      tag: "Exotics & Rabbits",
    },
    {
      name: "Travis Sterling, CCRP",
      role: "Canine Physical Rehabilitation Director",
      bio: "Certified canine rehab practitioner helping arthritic and post-operative dogs regain joyful mobility with hydrotherapy and cavaletti drills.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      tag: "Mobility & Rehab",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black font-display font-black text-xs px-3.5 py-1 rounded-full border-2 border-black rotate-[-2deg] pop-shadow">
          <Heart className="w-3.5 h-3.5 text-[#FF4D6D] fill-[#FF4D6D]" />
          <span>OUR STORY & PHILOSOPHY</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-950 dark:text-white leading-tight">
          Where Clinical Science Meets Fierce Pet Love
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {siteConfig.name} was born from a simple conviction: companion animals deserve medical care that treats the whole being—nourishing the gut, preserving joint freedom, and honoring their emotional lives.
        </p>
      </div>

      {/* Story & Mission Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-[#FFF0F3] dark:bg-slate-900 border-4 border-black rounded-3xl p-8 pop-shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-4xl block mb-2">🐾</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white">
              The Integrative Philosophy
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
              We do not reject modern medicine—we elevate it. We believe bloodwork, radiography, and diagnostics must be paired with fresh real food, acupuncture, physical conditioning, and restorative sleep to cultivate genuine longevity.
            </p>
          </div>
          <div className="pt-4 border-t-2 border-black/10 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Strictly zero miracle cure claims. Vet verified only.</span>
          </div>
        </div>

        <div className="bg-[#E8FFF9] dark:bg-slate-900 border-4 border-black rounded-3xl p-8 pop-shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-4xl block mb-2">🤝</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white">
              An Open Guardian Collective
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
              Pet parenting can be overwhelming when navigating chronic illnesses like arthritis, kidney disease, or allergies. PawsWell provides a warm, respectful community where no question is silly and every tail wag is celebrated.
            </p>
          </div>
          <div className="pt-4 border-t-2 border-black/10 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Over 48,000 active guardians nationwide.</span>
          </div>
        </div>
      </div>

      {/* Veterinary Advisory Board */}
      <section id="advisory" className="pt-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-[#00F5D4] text-black font-display font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[1deg] inline-block mb-2 pop-shadow">
            CLINICAL EXCELLENCE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 dark:text-white">
            Our Veterinary Advisory Board
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            Every protocol, recipe calculation, and therapy overview is vetted by our clinical panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisors.map((adv) => (
            <div
              key={adv.name}
              className="bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-6 pop-shadow hover-wiggle flex flex-col justify-between"
            >
              <div>
                <img
                  src={adv.avatar}
                  alt={adv.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-black pop-shadow mb-4 mx-auto"
                />
                <span className="bg-[#FFE600] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black uppercase block w-fit mx-auto mb-2">
                  {adv.tag}
                </span>
                <h3 className="font-display font-black text-lg text-slate-950 dark:text-white text-center leading-snug">
                  {adv.name}
                </h3>
                <p className="text-xs text-[#FF4D6D] font-bold text-center mb-3">
                  {adv.role}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-center">
                  {adv.bio}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] font-black text-purple-700 dark:text-[#FFE600]">
                  Verified DVM / Practitioner
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
