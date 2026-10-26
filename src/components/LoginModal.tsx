"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { firePawsConfetti } from "@/lib/confetti";
import {
  X,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Edit2,
  ShieldCheck,
} from "lucide-react";

export function LoginModal() {
  const {
    isLoginModalOpen,
    loginModalMode,
    loginModalMessage,
    closeLoginModal,
    refreshUser,
    executePendingAction,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [step, setStep] = useState<"email" | "otp">("email");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);

  // Status & feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Timers
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(600);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync mode with trigger
  useEffect(() => {
    if (isLoginModalOpen) {
      setMode(loginModalMode || "signup");
      setStep("email");
      setErrorMessage(null);
      setSuccessNotice(null);
      setOtpDigits(["", "", "", "", "", ""]);
      setCooldownSeconds(0);
      setExpirySeconds(600);

      // Scroll lock
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLoginModalOpen, loginModalMode]);

  // Esc key to close
  useEffect(() => {
    if (!isLoginModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLoginModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // OTP expiry countdown
  useEffect(() => {
    if (step !== "otp" || expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  if (!isLoginModalOpen) return null;

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (mode === "signup" && !agreeTerms) {
      setErrorMessage("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

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
        body: JSON.stringify({ email: trimmedEmail, purpose: mode }),
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
      setSuccessNotice(`We emailed your 6-digit confirmation code to ${trimmedEmail}.`);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      handlePastedCode(cleaned);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleaned;
    setOtpDigits(nextDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (cleaned && index === 5) {
      const fullCode = nextDigits.join("");
      if (fullCode.length === 6) {
        submitVerification(fullCode);
      }
    }
  };

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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
          name: fullName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Verification failed. Please check the code and try again.");
        setIsSubmitting(false);
        return;
      }

      firePawsConfetti();
      await refreshUser();
      closeLoginModal();
      // Resume the pending action that prompted login!
      await executePendingAction();
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLoginModal();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#FFFDF5] dark:bg-slate-900 border-3 border-black dark:border-white rounded-3xl p-6 sm:p-8 pop-shadow relative max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer pop-shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#FFE600] rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-3 pop-shadow-sm text-2xl">
            🐾
          </div>
          <h2 id="login-modal-title" className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {step === "otp"
              ? "Check Your Inbox"
              : mode === "signup"
              ? "Create Free Account"
              : "Welcome Back"}
          </h2>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
            {loginModalMessage ||
              (step === "otp"
                ? "Enter your 6-digit one-time code to proceed"
                : mode === "signup"
                ? "Join 48,000+ dedicated pet guardians exploring integrative health."
                : "Sign in with your email — zero passwords required.")}
          </p>
        </div>

        {/* Mode Selector Tabs (only on email step) */}
        {step === "email" && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-black dark:border-white mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-black dark:border-white pop-shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Sign Up (Free)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-black dark:border-white pop-shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-2xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-bold"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* STEP 1: EMAIL ENTRY */}
        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Guardian Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harsh J kuhikar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-black dark:border-white rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="e.g. guardian@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-black dark:border-white rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]"
                />
              </div>
            </div>

            {mode === "signup" && (
              <label className="flex items-start gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-black accent-[#FF4D6D] mt-0.5 cursor-pointer"
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FFE600] hover:bg-[#FFD600] text-slate-900 font-display font-black text-sm rounded-2xl border-3 border-black dark:border-white pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Code...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signup" ? "Create Account with OTP" : "Send Verification Code"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: 6-DIGIT OTP ENTRY */
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                <span>Enter 6-Digit Code</span>
                <span className="text-rose-500 font-mono">Expires: {formatTime(expirySeconds)}</span>
              </div>

              <div className="flex justify-between gap-1.5 sm:gap-2">
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
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black font-mono bg-white dark:bg-slate-800 border-2 sm:border-3 border-black dark:border-white rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] pop-shadow-sm"
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => submitVerification()}
              disabled={isSubmitting || otpDigits.join("").length !== 6}
              className="w-full py-3.5 bg-[#00BB9C] hover:bg-[#00A388] text-white font-display font-black text-sm rounded-2xl border-3 border-black dark:border-white pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t-2 border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleRequestOtp()}
                disabled={cooldownSeconds > 0 || isSubmitting}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {cooldownSeconds > 0 ? `Resend in ${cooldownSeconds}s` : "Resend Code"}
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
        <div className="mt-6 pt-4 border-t-2 border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero passwords to remember. 100% secure OTP.</span>
        </div>
      </div>
    </div>
  );
}
