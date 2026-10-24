"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PawCursorTrail } from "@/components/PawCursorTrail";

import { AuthProvider } from "@/context/AuthContext";

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
