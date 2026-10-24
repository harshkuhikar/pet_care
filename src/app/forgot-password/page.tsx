"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { firePawsConfetti } from "@/lib/confetti";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    firePawsConfetti();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-3xl mx-auto pop-shadow mb-4">
          🔑
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mb-2">
          Reset Your Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-6">
          Enter your registered email and we&apos;ll send you instructions to choose a new password.
        </p>

        {submitted ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-display font-black text-lg text-emerald-900">
              Reset Email Dispatched!
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              We&apos;ve sent a reset link to <span className="font-bold">{email}</span>. Please check your inbox and spam folder.
            </p>
            <Link
              href="/reset-password?token=mock_token_123"
              className="inline-block mt-3 px-4 py-2 bg-[#00F5D4] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow"
            >
              Demo: Follow Mock Reset Link ➔
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t-2 border-slate-100 dark:border-slate-800">
          <Link href="/login" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
