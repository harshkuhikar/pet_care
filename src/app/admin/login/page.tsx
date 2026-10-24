"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert, KeyRound, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please provide both administrator email and master password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Invalid admin credentials.");
        setIsSubmitting(false);
        return;
      }

      // Success: redirect to operations dashboard
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg("Failed to connect to authentication server. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0713] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Security Notice */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          PAWSWELL OS SECURE GATEWAY
        </span>
        <span className="text-slate-500">v2.4.0</span>
      </div>

      <div className="w-full max-w-md bg-[#130E22] border-3 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D6D]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00F5D4]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 rounded-2xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center text-3xl mx-auto pop-shadow mb-4 rotate-3">
            🛡️
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00F5D4] px-2.5 py-1 bg-black/40 rounded-full border border-[#00F5D4]/30">
            Internal Operations Console
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Administrator Access
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Restricted access portal for authorized platform staff only.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-2xl bg-rose-950/60 border-2 border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pawswell.pet"
                className="w-full px-4 py-3 pl-10 text-sm font-bold bg-[#1C1533] border-2 border-black rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F5D4] transition-all"
              />
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Master Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pl-10 text-sm font-bold bg-[#1C1533] border-2 border-black rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F5D4] transition-all"
              />
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-4 bg-[#FFE600] hover:bg-[#EBD400] text-black font-display font-black text-base rounded-2xl border-2 border-black pop-shadow hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Authenticating Session...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-black" />
                <span>Enter Operations Console</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            IP and hardware session headers are recorded for audit compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
