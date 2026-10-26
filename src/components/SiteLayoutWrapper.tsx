"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PawCursorTrail } from "@/components/PawCursorTrail";
import { LoginModal } from "@/components/LoginModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CheckCircle2 } from "lucide-react";

function GlobalActionToast() {
  const { toastMessage } = useAuth();
  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl border-2 border-black dark:border-white pop-shadow animate-fade-in text-sm font-bold shadow-xl"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
}

function SiteLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes are completely isolated: NO public Navbar, NO public Footer, NO playful pets
    return <main className="min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  return (
    <>
      {/* Interactive Desktop Paw Cursor Trail */}
      <PawCursorTrail />

      {/* Global Public Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Global Public Footer */}
      <Footer />

      {/* Global Login Gate Modal */}
      <LoginModal />

      {/* Global Toast Feedback */}
      <GlobalActionToast />
    </>
  );
}

export function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={<main className="flex-1 min-h-screen">{children}</main>}>
        <SiteLayoutContent>{children}</SiteLayoutContent>
      </Suspense>
    </AuthProvider>
  );
}
