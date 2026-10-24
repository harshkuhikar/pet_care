"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, addPet, saveUser } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import { PetSpecies, UserProfile } from "@/types";
import {
  Sparkles,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Crown,
  Bone,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [step, setStep] = useState(1);

  // Step 1: Health Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Gut & Microbiome Health",
    "Senior Joint Mobility",
  ]);

  // Step 2: First Pet Basics
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState<PetSpecies>("dog");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [healthNotes, setHealthNotes] = useState("");

  // Step 3: Newsletter Frequency
  const [frequency, setFrequency] = useState<"weekly" | "biweekly" | "monthly">("weekly");

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinish = () => {
    if (petName.trim() && user) {
      addPet({
        userId: user.id,
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || "Mixed Breed",
        age: petAge.trim() || "Adult",
        healthNotes: healthNotes.trim() || "Initial wellness baseline.",
      });
    }

    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        newsletterFrequency: frequency,
      };
      saveUser(updatedUser);
    }

    firePawsConfetti();
    router.push("/profile");
  };

  const allInterests = [
    { label: "Gut & Microbiome Health", icon: "🦠" },
    { label: "Senior Joint Mobility", icon: "🦮" },
    { label: "TCVM & Acupuncture", icon: "✨" },
    { label: "Herbal & Botanical Tinctures", icon: "🌿" },
    { label: "Feline Kidney Care", icon: "🐱" },
    { label: "Fresh & Raw Meal Formulations", icon: "🥩" },
    { label: "Rabbit Digestive Health", icon: "🐇" },
    { label: "Canine Conditioning & Agility", icon: "🎾" },
    { label: "Anxiety & Nervous System Resets", icon: "🧘" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      {/* Wizard Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-black uppercase text-slate-500 mb-2">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? "Health Goals" : step === 2 ? "Your Companion" : step === 3 ? "Email Frequency" : "Tailored Plan"}</span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full border-2 border-black overflow-hidden flex">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all ${
                s <= step ? "bg-[#FF4D6D]" : "bg-transparent"
              } ${s < 4 ? "border-r border-black" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Wizard Card Body */}
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl relative">
        {/* STEP 1: INTERESTS */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 animate-bounce">✨</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white">
                What Are Your Top Wellness Priorities?
              </h2>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold mt-1">
                We&apos;ll tailor your Learn Hub feed and Sunday Dispatch topics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {allInterests.map((item) => {
                const selected = selectedInterests.includes(item.label);
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => toggleInterest(item.label)}
                    className={`p-3.5 rounded-2xl border-2 border-black text-left flex items-center justify-between text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      selected
                        ? "bg-[#FFE600] text-black pop-shadow scale-102"
                        : "bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-slate-200 hover:scale-102 hover:border-black"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ADD PET BASICS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 animate-bounce">🐾</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white">
                Tell Us About Your Companion
              </h2>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold mt-1">
                Pet health notes are 100% private and visible only to you.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-1">
                  Pet&apos;s Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Barnaby, Mochi, Clover"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-1">
                  Species
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["dog", "cat", "rabbit", "bird", "small-pet", "reptile"] as const).map(
                    (s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setPetSpecies(s)}
                        className={`py-2 text-xs font-black rounded-xl border-2 border-black capitalize transition-all cursor-pointer ${
                          petSpecies === s
                            ? "bg-[#00F5D4] text-black font-black pop-shadow scale-105"
                            : "bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:scale-105 hover:border-black"
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Mix, Tabby"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4 years, Senior"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Private Health Notes & Sensitivities
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sensitive stomach with chicken, loves fermented goat milk..."
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  className="w-full p-3 text-xs font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-white dark:bg-slate-800 font-bold text-xs rounded-xl border-2 border-black pop-shadow"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3.5 bg-[#FF4D6D] text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: NEWSLETTER FREQUENCY */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 animate-bounce">💌</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white">
                How Often Would You Like Vet Insights?
              </h2>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold mt-1">
                Zero spam. Packed with whole food recipes and physical therapy drills.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  id: "weekly",
                  label: "Weekly (Recommended)",
                  desc: "Every Sunday morning at 8:00 AM — 1 recipe, 1 rehab drill, 1 perk code.",
                  badge: "Most Popular",
                },
                {
                  id: "biweekly",
                  label: "Bi-Weekly",
                  desc: "Every other Sunday morning — a condensed digest of top guides.",
                },
                {
                  id: "monthly",
                  label: "Monthly Roundup",
                  desc: "First of every month — complete seasonal care checklist.",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setFrequency(opt.id as any)}
                  className={`p-4 rounded-2xl border-3 border-black text-left flex items-start justify-between cursor-pointer transition-all ${
                    frequency === opt.id
                      ? "bg-[#FFE600] text-black pop-shadow scale-102"
                      : "bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-slate-200 hover:scale-101 hover:border-black"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-base">{opt.label}</h4>
                      {opt.badge && (
                        <span className="bg-[#FF4D6D] text-white text-[10px] font-black px-2 py-0.2 rounded-full border border-black animate-wiggle">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-300 font-medium mt-1">
                      {opt.desc}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === opt.id}
                    onChange={() => {}}
                    className="w-4 h-4 mt-1 accent-[#FF4D6D]"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 bg-white dark:bg-slate-800 font-bold text-xs rounded-xl border-2 border-black pop-shadow hover:scale-105 transition-all cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3.5 bg-[#FF4D6D] text-white font-display font-black text-sm rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Review Recommended Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUGGESTED PLAN & CELEBRATION */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#FFE600] border-3 border-black flex items-center justify-center text-3xl mx-auto pop-shadow animate-bounce">
              👑
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#181126] dark:text-white">
              You&apos;re All Set for Longevity!
            </h2>

            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold max-w-md mx-auto">
              Based on your interests, we recommend <span className="font-black text-[#FF4D6D]">PawsWell Premium</span> for full access to our veterinary clinical recipe calculators.
            </p>

            <div className="bg-[#FFF0F3] dark:bg-slate-800 border-3 border-black rounded-2xl p-5 text-left pop-shadow space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <p className="text-slate-600 dark:text-slate-400 font-black uppercase text-[10px]">
                Your Tailored Companion Profile:
              </p>
              <p className="text-sm font-display font-black text-[#181126] dark:text-white">
                🐾 {petName || "Your Companion"} ({petSpecies})
              </p>
              <p className="text-xs text-purple-700 dark:text-yellow-300">
                Focus Areas: {selectedInterests.slice(0, 3).join(" • ")}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Complete Setup & Go to Dashboard ➔
              </button>
              <Link
                href="/membership"
                className="px-6 py-4 bg-[#FFE600] text-black font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 transition-all"
              >
                Upgrade to Premium ($12/mo)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
