"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  FileText,
  LogOut,
  Camera,
  Activity,
  AlertTriangle,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);

  // If on admin login page, don't show the admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/admin-me");
        const data = await res.json();
        if (!res.ok || !data.authenticated) {
          router.push("/admin/login");
          return;
        }
        setAdminUser(data.admin);
        setLoading(false);
      } catch {
        router.push("/admin/login");
      }
    }

    checkAuth();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0A1A] flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-3 border-[#00F5D4] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-slate-400">Verifying Administrator Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0A1A] text-slate-100 flex flex-col font-sans">
      {/* Top Operations Header */}
      <header className="h-16 bg-[#161026] border-b-2 border-black/40 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 pop-shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center font-black text-xl pop-shadow-sm">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-white">
                PawsWell Operations Console
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF4D6D] text-white">
                Admin Secure
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Session: {adminUser?.email}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems Online</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 border-2 border-rose-500/40 text-rose-300 font-mono text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Admin Operations Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-xs font-mono text-slate-500">
        PawsWell Internal Operations Console • Restricted Authorized Use Only • All actions logged
      </footer>
    </div>
  );
}
