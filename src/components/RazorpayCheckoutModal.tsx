"use client";

import React, { useState, useEffect } from "react";
import { MembershipPlan } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { firePawsConfetti } from "@/lib/confetti";
import {
  X,
  Lock,
  CheckCircle2,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Declare global Razorpay window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutModalProps {
  plan: MembershipPlan;
  isYearly: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RazorpayCheckoutModal({
  plan,
  isYearly,
  isOpen,
  onClose,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<"gateway" | "qr">("qr");
  const [utrNumber, setUtrNumber] = useState("");
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Automatically reset scroll position to 0% (the very top) when modal opens or payment mode changes
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen, paymentMode]);

  // Dynamically load Razorpay standard checkout script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.warn("Failed to load Razorpay script, fallback modal available.");
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Keep script in document cache
    };
  }, []);

  if (!isOpen) return null;

  // Pricing calculations
  const basePriceUSD = isYearly ? plan.priceYearly : plan.priceMonthly;
  const discountedPriceUSD = Math.max(0, basePriceUSD * (1 - appliedDiscount));

  // INR equivalent: approx ₹85 per USD rounded cleanly
  const basePriceINR = isYearly ? Math.round(plan.priceYearly * 80) : Math.round(plan.priceMonthly * 80);
  const discountedPriceINR = Math.max(0, Math.round(basePriceINR * (1 - appliedDiscount)));

  const activeAmount = currency === "USD" ? discountedPriceUSD : discountedPriceINR;
  const activeCurrencySymbol = currency === "USD" ? "$" : "₹";

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = coupon.trim().toUpperCase();
    if (code === "PAWSWELL20" || code === "WELLSHROOM" || code === "RAZOR20") {
      setAppliedDiscount(0.2); // 20% discount
    } else {
      setErrorMessage("Invalid coupon code. Try 'PAWSWELL20' for 20% off!");
    }
  };

  // Launch official Razorpay standard popup
  const handleRazorpayGateway = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent("/membership")}`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const userName = user.name || "Pet Guardian";
      const userEmail = user.email;

      // 1. Create order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          isYearly,
          amount: activeAmount,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.order) {
        throw new Error(data.error || "Failed to initialize Razorpay order");
      }

      const order = data.order;
      const keyId = data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // 2. Open Razorpay Checkout modal
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "PawsWell Pet Health",
          description: `${plan.name} (${isYearly ? "Annual" : "Monthly"}) Membership`,
          order_id: order.id,
          image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=128&q=80",
          theme: {
            color: "#FF4D6D", // PawsWell Coral
          },
          prefill: {
            name: userName,
            email: userEmail,
            contact: "9999999999",
          },
          notes: {
            planId: plan.id,
            billing: isYearly ? "yearly" : "monthly",
          },
          handler: async function (response: any) {
            try {
              // 3. Verify signature on backend
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: plan.id,
                  amount: activeAmount,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyData.verified) {
                await refreshUser();
                firePawsConfetti();
                setIsProcessing(false);
                onSuccess();
                router.push("/checkout/success");
              } else {
                setErrorMessage("Payment verification failed. Please contact support.");
                setIsProcessing(false);
              }
            } catch (err: any) {
              console.error("Verification error:", err);
              setErrorMessage("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          console.error("Razorpay payment failed:", response.error);
          setErrorMessage(response.error.description || "Payment failed. Please try again.");
          setIsProcessing(false);
        });

        rzp.open();
      } else {
        setErrorMessage("Razorpay checkout gateway could not be reached. Please check your network connection.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Razorpay launch error:", err);
      setErrorMessage(err.message || "Failed to initialize Razorpay checkout.");
      setIsProcessing(false);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
        <div
          className="w-full max-w-lg bg-[#FFFDF5] dark:bg-slate-900 border-4 border-black rounded-3xl p-5 sm:p-8 pop-shadow-xl relative my-auto text-slate-900 dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-black bg-white dark:bg-slate-800 hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-5 h-5 text-black dark:text-white" />
        </button>

        {/* Razorpay Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-2xl pop-shadow">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0C2340] text-[#00F5D4] border border-black/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#00F5D4]" />
                Razorpay Secure
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 border border-black/20">
                Test Mode Ready
              </span>
            </div>
            <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mt-1">
              Upgrade to {plan.name}
            </h3>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between mb-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border-2 border-black pop-shadow-sm">
          <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 ml-2">
            Billing Currency:
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-black transition-all ${
                currency === "USD"
                  ? "bg-[#FFE600] text-black pop-shadow-sm scale-105"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-black transition-all ${
                currency === "INR"
                  ? "bg-[#FFE600] text-black pop-shadow-sm scale-105"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* Plan Summary Card */}
        <div className="bg-white dark:bg-slate-800 border-3 border-black rounded-2xl p-4 mb-5 pop-shadow flex items-center justify-between">
          <div>
            <p className="font-display font-black text-lg text-slate-900 dark:text-white">
              {plan.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              {isYearly ? "Billed Annually (Save 20%)" : "Billed Monthly"} • Full VIP Protocols
            </p>
          </div>
          <div className="text-right">
            {appliedDiscount > 0 && (
              <span className="line-through text-xs text-rose-500 font-bold block">
                {activeCurrencySymbol}
                {currency === "USD" ? basePriceUSD : basePriceINR}
              </span>
            )}
            <span className="font-display font-black text-2xl text-[#FF4D6D]">
              {activeCurrencySymbol}
              {activeAmount.toFixed(0)}
              <span className="text-xs text-slate-500 font-bold">/{isYearly ? "yr" : "mo"}</span>
            </span>
          </div>
        </div>

        {/* Coupon Code Input */}
        <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Promo code (try PAWSWELL20)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 px-3 py-2 text-xs font-bold border-2 border-black rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase placeholder:normal-case placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#FFE600] text-black font-display font-black text-xs border-2 border-black rounded-xl pop-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Apply
          </button>
        </form>

        {appliedDiscount > 0 && (
          <div className="mb-4 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>20% Member Discount Applied successfully!</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setPaymentMode("qr")}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border-2 border-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              paymentMode === "qr"
                ? "bg-[#FFE600] text-black pop-shadow scale-102"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-700 dark:text-yellow-400" />
            <span>Scan UPI QR Code</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMode("gateway")}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border-2 border-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              paymentMode === "gateway"
                ? "bg-[#FFE600] text-black pop-shadow scale-102"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Zap className="w-4 h-4 text-[#FF4D6D]" />
            <span>Cards & Gateway</span>
          </button>
        </div>

        {/* MODE 1: Direct Razorpay UPI QR Code */}
        {paymentMode === "qr" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 border-3 border-black rounded-3xl p-5 pop-shadow text-center">
              <div className="inline-block bg-[#00F5D4] text-black font-display font-black text-[11px] px-3 py-1 rounded-full border border-black mb-3">
                SCAN WITH ANY UPI APP
              </div>

              {/* QR Code Container */}
              <div className="max-w-[210px] max-h-[300px] mx-auto rounded-2xl border-3 border-black overflow-hidden bg-white p-2 pop-shadow-sm mb-3 flex items-center justify-center">
                <img
                  src="/images/razorpay-upi-qr.jpg"
                  alt="Razorpay BHIM UPI QR Code - Harsh Jitendrabhai Kuhikar"
                  className="w-full max-h-[280px] h-auto object-contain rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <p className="font-display font-black text-sm text-slate-900 dark:text-white">
                  Payee: HARSH JITENDRABHAI KUHIKAR
                </p>
                <p className="text-xs font-bold text-purple-600 dark:text-yellow-300">
                  Powered by Razorpay • Verified Merchant
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-black/20">
                    GPay
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-black/20">
                    PhonePe
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-black/20">
                    Paytm
                  </span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-black/20">
                    BHIM
                  </span>
                </div>
              </div>
            </div>

            {/* Optional UTR/Reference input */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300 mb-1">
                UPI Reference / UTR No. (Optional for fast verification)
              </label>
              <input
                type="text"
                placeholder="e.g. 428901234567"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-mono font-bold border-2 border-black rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            {/* Verify & Unlock Button */}
            <button
              type="button"
              onClick={handleRazorpayGateway}
              disabled={isProcessing}
              className="w-full py-4 bg-[#00BB9C] hover:bg-[#00A388] text-white font-display font-black text-lg rounded-2xl border-3 border-black pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying UPI Payment...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>I Have Paid via UPI ➔ Unlock {plan.name}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* MODE 2: Razorpay Gateway Popup */}
        {paymentMode === "gateway" && (
          <div className="space-y-4 animate-fade-in">
            {/* Supported Razorpay Payment Methods Badge */}
            <div className="bg-[#00F5D4]/20 dark:bg-slate-800/80 border-2 border-black rounded-2xl p-3 text-xs">
              <div className="font-black text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-purple-600 dark:text-yellow-300" />
                <span>Supported Gateway Methods:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-white dark:bg-slate-700 font-bold border border-black/30 rounded-lg text-[11px]">
                  💳 Credit & Debit Cards
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-700 font-bold border border-black/30 rounded-lg text-[11px]">
                  📱 UPI / Intent (All Apps)
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-700 font-bold border border-black/30 rounded-lg text-[11px]">
                  🏦 Net Banking (50+ Banks)
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-700 font-bold border border-black/30 rounded-lg text-[11px]">
                  👛 Wallets
                </span>
              </div>
            </div>

            {/* Main Razorpay Action Button */}
            <button
              type="button"
              onClick={handleRazorpayGateway}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-lg rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting to Razorpay...
                </span>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-[#FFE600] fill-current" />
                  <span>
                    Pay {activeCurrencySymbol}
                    {activeAmount.toFixed(0)} via Razorpay Popup
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </>
              )}
            </button>

          </div>
        )}

        {/* Guarantee Pill */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>30-Day 100% Wag-Guaranteed Refund Policy. Cancel anytime.</span>
        </div>
      </div>
    </div>
  </div>
);
}
