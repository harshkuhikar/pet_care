"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { firePawsConfetti } from "@/lib/confetti";
import {
  Mail,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Edit2,
  ShieldCheck,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();

  const rawNext = searchParams.get("next");
  const nextUrl =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
      ? rawNext
      : "/profile";

  // If already logged in, redirect to nextUrl
  useEffect(() => {
    if (user) {
      router.replace(nextUrl);
    }
  }, [user, nextUrl, router]);

  // Form State
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Timer states
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(600); // 10 minutes

  // Digit input refs for auto-focus/advance
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Expiry countdown effect
  useEffect(() => {
    if (step !== "otp" || expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, purpose: "login" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to send verification code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setStep("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setCooldownSeconds(60);
      setExpirySeconds(600);
      setSuccessNotice(`We emailed a 6-digit login code to ${trimmedEmail}.`);

      // Auto-focus first input box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Digit Change
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");

    // Handle full paste into single box
    if (cleaned.length > 1) {
      handlePastedCode(cleaned);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleaned;
    setOtpDigits(nextDigits);

    // Auto-advance to next box
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically verify!
    if (cleaned && index === 5) {
      const fullCode = nextDigits.join("");
      if (fullCode.length === 6) {
        submitVerification(fullCode);
      }
    }
  };

  // Handle Paste
  const handlePastedCode = (pasted: string) => {
    const digitsOnly = pasted.replace(/\D/g, "").slice(0, 6);
    if (!digitsOnly) return;

    const nextDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < digitsOnly.length; i++) {
      nextDigits[i] = digitsOnly[i];
    }
    setOtpDigits(nextDigits);

    if (digitsOnly.length === 6) {
      inputRefs.current[5]?.focus();
      submitVerification(digitsOnly);
    } else {
      inputRefs.current[Math.min(digitsOnly.length, 5)]?.focus();
    }
  };

  // Key Down Handling (Backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Step 2: Submit Verification
  const submitVerification = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Verification failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      firePawsConfetti();
      await refreshUser();
      router.push(nextUrl);
      router.refresh();
    } catch {
      setErrorMessage("Network error verifying code. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl relative">
        {/* Header Icon */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-black text-2xl pop-shadow mb-1">
            🐾
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {step === "email" ? "Sign In / Join PawsWell" : "Check Your Inbox"}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
            {step === "email"
              ? "Passwordless email login. Quick, secure, and spam-free."
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-2xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {step === "email" ? (
          /* STEP 1: EMAIL INPUT FORM */
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-semibold border-3 border-black rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#FFE600]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-name"
                className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1"
              >
                Your Name <span className="text-slate-400 font-normal lowercase">(optional for new members)</span>
              </label>
              <input
                id="login-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Sarah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 text-sm font-semibold border-3 border-black rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#FFE600]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-[#FF4D6D] hover:bg-[#E63956] disabled:opacity-60 text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Send Login Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: 6-DIGIT OTP BOXES */
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={(e) => {
                    e.preventDefault();
                    handlePastedCode(e.clipboardData.getData("text"));
                  }}
                  className="w-11 sm:w-12 h-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black border-3 border-black rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#FFE600] pop-shadow-sm"
                />
              ))}
            </div>

            {/* Expiry Countdown */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Code expires in:</span>
              <span
                className={`font-mono font-black ${
                  expirySeconds < 120 ? "text-rose-500 animate-pulse" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {formatTime(expirySeconds)}
              </span>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => submitVerification()}
              disabled={isSubmitting || otpDigits.join("").length !== 6}
              className="w-full py-4 bg-[#FFE600] hover:bg-[#F2DA00] disabled:opacity-50 text-black font-display font-black text-base rounded-2xl border-3 border-black pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm Code & Enter</span>
                </>
              )}
            </button>

            {/* Resend & Change Email Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleRequestOtp()}
                disabled={cooldownSeconds > 0 || isSubmitting}
                className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {cooldownSeconds > 0
                    ? `Resend in ${cooldownSeconds}s`
                    : "Resend Code"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setErrorMessage(null);
                  setSuccessNotice(null);
                }}
                className="text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Change Email</span>
              </button>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero passwords to remember. One-time verification link.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
