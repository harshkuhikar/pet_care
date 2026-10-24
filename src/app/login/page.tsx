"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginDemoUser, saveUser } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import { UserProfile } from "@/types";
import {
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Wand2,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("sarah.barnaby@example.com");
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [magicSent, setMagicSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid credentials.");
        return;
      }

      // Sync user profile to client state
      if (data.user) {
        saveUser(data.user);
      }

      firePawsConfetti();
      router.push("/profile");
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    }
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please provide a valid email.");
      return;
    }
    setMagicSent(true);
    firePawsConfetti();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14 sm:py-20">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-3xl mx-auto pop-shadow mb-3 rotate-3">
            🐾
          </div>
          <h1 className="font-display font-black text-3xl text-[#181126] dark:text-white">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold mt-1">
            Access your saved protocols, pet records & member perks
          </p>
        </div>

        {/* Tab Toggle: Standard Password vs Magic Link */}
        <div className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-xl p-1 flex gap-1 mb-6 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setMagicSent(false);
            }}
            className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
              mode === "password"
                ? "bg-[#FFE600] text-black pop-shadow"
                : "text-slate-800 dark:text-slate-200 hover:text-black"
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              mode === "magic"
                ? "bg-[#00F5D4] text-black pop-shadow"
                : "text-slate-800 dark:text-slate-200 hover:text-black"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Magic Link</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-900 dark:text-slate-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase text-slate-900 dark:text-slate-200">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-black text-[#FF4D6D] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm font-bold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 text-[#181126] dark:text-white focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-black accent-[#FF4D6D]"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : magicSent ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-display font-black text-lg text-emerald-900">
              Magic Link Dispatched!
            </h3>
            <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
              We emailed a passwordless login link to <span className="font-black">{email}</span>. Click the link to log in immediately!
            </p>
            <button
              type="button"
              onClick={() => {
                loginDemoUser("premium");
                router.push("/profile");
              }}
              className="mt-2 px-4 py-2 bg-[#00F5D4] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow"
            >
              Demo: Simulate Instant Click ➔
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
              />
            </div>
            <p className="text-xs font-semibold text-slate-500">
              We&apos;ll send you a secure one-click link to your inbox. No password needed!
            </p>
            <button
              type="submit"
              className="w-full py-4 bg-[#00F5D4] text-black font-display font-black text-base rounded-2xl border-3 border-black pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Send Magic Link</span>
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-[#FF4D6D] underline font-black">
              Join Free here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
