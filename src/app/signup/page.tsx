"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import { PetSpecies, UserProfile } from "@/types";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Heart,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [petSpecies, setPetSpecies] = useState<PetSpecies>("dog");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "Enter password", color: "bg-slate-200" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-400" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-[#00BB9C]" };
    return { score: 4, label: "Very Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          petSpecies,
          agreeTerms,
          newsletterOptIn,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Sync user profile to client storage
      if (data.user) {
        saveUser(data.user);
      }

      firePawsConfetti();
      setTimeout(() => {
        router.push("/welcome");
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  const handleSocialMock = (provider: "Google" | "Apple") => {
    const newUser: UserProfile = {
      id: `usr_soc_${Date.now()}`,
      email: `${provider.toLowerCase()}.user@example.com`,
      displayName: `${provider} Guardian`,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "member",
      plan: "free",
      joinedAt: new Date().toISOString().split("T")[0],
      newsletterSubscribed: true,
      newsletterFrequency: "weekly",
      savedArticlesCount: 0,
      petsCount: 0,
    };
    saveUser(newUser);
    firePawsConfetti();
    router.push("/welcome");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-3xl mx-auto pop-shadow mb-3 rotate-[-3deg]">
            🐾
          </div>
          <h1 className="font-display font-black text-3xl text-[#181126] dark:text-white">
            Join the PawsWell Pack
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold mt-1">
            Free forever account • Access articles, Pet Wall & weekly newsletter
          </p>
        </div>

        {/* Error Callout */}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Social Signups */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocialMock("Google")}
            className="py-2.5 px-3 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-display font-bold text-xs flex items-center justify-center gap-2 pop-shadow hover:scale-102 cursor-pointer"
          >
            <span>🌐</span>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialMock("Apple")}
            className="py-2.5 px-3 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-display font-bold text-xs flex items-center justify-center gap-2 pop-shadow hover:scale-102 cursor-pointer"
          >
            <span>🍏</span>
            <span>Apple</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t-2 border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-black uppercase text-slate-400 absolute">
            or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-1">
              Your Name / Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Sarah Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-sm font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
              />
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-sm font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
              />
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a strong password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-10 text-sm font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
              />
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full ${
                        step <= strength.score ? strength.color : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Strength: {strength.label}</span>
                  <span>Min 8 chars, 1 number, 1 special</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Re-enter password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
            />
          </div>

          {/* Optional Pet Companion Species */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
              Primary Companion (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "dog", label: "Dog 🐕" },
                  { id: "cat", label: "Cat 🐈" },
                  { id: "rabbit", label: "Rabbit 🐇" },
                  { id: "bird", label: "Bird 🦜" },
                  { id: "small-pet", label: "Small Pet 🐹" },
                  { id: "reptile", label: "Reptile 🦎" },
                ] as const
              ).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPetSpecies(p.id)}
                  className={`py-2 text-xs font-bold rounded-xl border-2 border-black transition-all cursor-pointer ${
                    petSpecies === p.id
                      ? "bg-[#FFE600] text-black font-black pop-shadow"
                      : "bg-[#FFFDF5] dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-black accent-[#FF4D6D]"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="underline font-bold hover:text-[#FF4D6D]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline font-bold hover:text-[#FF4D6D]">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-black accent-[#FF4D6D]"
              />
              <span>Email me the free Sunday Dispatch newsletter (unsubscribe anytime).</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            <Sparkles className="w-5 h-5 text-[#FFE600]" />
            <span>{isSubmitting ? "Creating Account..." : "Create Free Account"}</span>
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs font-bold text-slate-600 dark:text-slate-400">
          Already part of the pack?{" "}
          <Link href="/login" className="text-[#FF4D6D] underline font-black">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
