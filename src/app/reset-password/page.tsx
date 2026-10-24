"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { firePawsConfetti } from "@/lib/confetti";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg("Please enter your account email address.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to update password.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      firePawsConfetti();
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 pop-shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-3xl mx-auto pop-shadow mb-4">
          🔐
        </div>

        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mb-2">
          Set New Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-6">
          Enter your email and new secure password for your PawsWell account.
        </p>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-display font-black text-emerald-900">
              Password Successfully Updated in MongoDB!
            </h4>
            <p className="text-xs text-emerald-800">Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                Account Email
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

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Updating MongoDB..." : "Update Password"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
