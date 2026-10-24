"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/storage";
import { UserProfile } from "@/types";
import { ThemeToggle } from "./ThemeToggle";
import {
  Menu,
  X,
  Sparkles,
  Heart,
  Search,
  User as UserIcon,
  Crown,
  Camera,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleSync = () => {
      setUser(getCurrentUser());
    };
    handleSync();

    if (typeof window !== "undefined") {
      window.addEventListener("pawswell_user_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("pawswell_user_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, [pathname]);

  const isUserPremium = Boolean(
    user &&
      (user.role === "premium" ||
        user.role === "pro" ||
        user.role === "admin" ||
        user.plan === "monthly" ||
        user.plan === "yearly" ||
        user.plan === "pro" ||
        user.plan === "premium")
  );

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="bg-[#FFE600] border-b-2 border-black py-1.5 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-between overflow-hidden text-black select-none">
        <div className="flex items-center gap-2">
          <span className="bg-black text-[#FFE600] px-2 py-0.5 rounded-full text-[10px]">
            NEW ISSUE
          </span>
          <span className="hidden sm:inline">
            Sunday Dispatch #84: Spring Canine Liver Detox Myths & Vet Truths
          </span>
          <span className="sm:hidden">Sunday Dispatch #84 is Live!</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/newsletter"
            className="underline hover:text-purple-800 transition-colors"
          >
            Read Free ➔
          </Link>
          <span className="hidden md:inline font-normal text-slate-700">|</span>
          <Link
            href="/membership"
            className="hidden md:flex items-center gap-1 text-purple-900 font-extrabold hover:text-purple-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Save 20% on Annual</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FFFDF5] dark:bg-[#1A1229] border-b-3 border-black transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] border-2 border-black flex items-center justify-center pop-shadow group-hover:rotate-6 transition-transform">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                {siteConfig.name}
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] border border-black inline-block animate-ping" />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7928CA] dark:text-[#FFE600] -mt-1 hidden sm:block">
                Integrative Pet Health
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/blog"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                isActive("/blog")
                  ? "bg-[#FFE600] border-black text-black pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#FFE600] hover:text-black hover:scale-105"
              }`}
            >
              Learn Hub
            </Link>

            <Link
              href="/nutrition"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                isActive("/nutrition")
                  ? "bg-[#FF4D6D] border-black text-white pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#FF4D6D] hover:text-white hover:scale-105"
              }`}
            >
              Nutrition
            </Link>

            <Link
              href="/exercise"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                isActive("/exercise")
                  ? "bg-[#00F5D4] border-black text-black pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#00F5D4] hover:text-black hover:scale-105"
              }`}
            >
              Movement
            </Link>

            <Link
              href="/therapies"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                isActive("/therapies")
                  ? "bg-[#7928CA] border-black text-white pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#7928CA] hover:text-white hover:scale-105"
              }`}
            >
              Therapies
            </Link>

            <Link
              href="/pet-wall"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive("/pet-wall")
                  ? "bg-[#06D6A0] border-black text-black pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#06D6A0] hover:text-black hover:scale-105"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Pet Wall</span>
              <span className="bg-[#FF4D6D] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-black animate-radar">
                LIVE
              </span>
            </Link>

            <Link
              href="/qa"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer flex items-center gap-1 ${
                isActive("/qa")
                  ? "bg-[#FFE600] border-black text-black pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-[#FFE600] hover:text-black hover:scale-105"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
              <span>Pet Q&A</span>
            </Link>

            <Link
              href="/community"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                isActive("/community")
                  ? "bg-amber-300 border-black text-black pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-amber-300 hover:text-black hover:scale-105"
              }`}
            >
              Community
            </Link>

            <Link
              href="/partners"
              className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                isActive("/partners")
                  ? "bg-purple-200 border-black text-black pop-shadow scale-105"
                  : "border-transparent text-[#181126] dark:text-slate-200 hover:border-black hover:bg-purple-200 hover:text-black hover:scale-105"
              }`}
            >
              Perks
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 pop-shadow hover:scale-105 transition-transform cursor-pointer"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Member Profile or Auth CTA */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-black rounded-xl p-1.5 pr-3 pop-shadow hover:scale-102 transition-transform"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-lg object-cover border border-black"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-black truncate max-w-[100px] leading-tight">
                      {user.displayName}
                    </p>
                    <span className="text-[10px] font-black uppercase px-1 py-0.2 rounded bg-[#FFE600] text-black">
                      {user.role}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-[#FF4D6D]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 font-display font-black text-sm bg-[#FFE600] text-black border-2 border-black rounded-xl pop-shadow hover:scale-105 active:scale-95 transition-all"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Go Premium CTA Button (Only show if not already premium) */}
            {!isUserPremium ? (
              <Link
                href="/membership"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 font-display font-black text-sm bg-[#FF4D6D] hover:bg-[#E63956] text-white border-2 border-black rounded-xl pop-shadow-coral hover:scale-108 active:scale-95 transition-all animate-wiggle hover:animate-none group cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#FFE600] group-hover:rotate-12 transition-transform" />
                <span>Go Premium</span>
                <Sparkles className="w-3 h-3 text-[#FFE600] animate-spin-slow" />
              </Link>
            ) : (
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 font-display font-black text-xs bg-[#FFE600] text-black border-2 border-black rounded-xl pop-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-purple-700" />
                <span>VIP Active</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border-2 border-black bg-white dark:bg-slate-800 pop-shadow"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF5] dark:bg-[#1E152F] border-b-3 border-black p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/blog"
                className="p-3 bg-white dark:bg-slate-800 border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                📚 Learn Hub
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/nutrition"
                className="p-3 bg-[#FF4D6D] text-white border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                🥩 Nutrition
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/exercise"
                className="p-3 bg-[#00F5D4] text-black border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                🎾 Movement
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/therapies"
                className="p-3 bg-[#7928CA] text-white border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                ✨ Therapies
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/pet-wall"
                className="p-3 bg-[#06D6A0] text-black border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow flex items-center justify-center gap-1"
              >
                📸 Pet Wall
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/qa"
                className="p-3 bg-[#FFE600] text-black border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                ❓ Pet Q&A
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/community"
                className="p-3 bg-amber-200 text-black border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                💬 Community
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/partners"
                className="p-3 bg-purple-100 text-black border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                🏷️ Partner Perks
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                href="/newsletter"
                className="p-3 bg-rose-100 text-black border-2 border-black rounded-xl font-bold text-sm text-center pop-shadow"
              >
                💌 Newsletter
              </Link>
            </div>

            <div className="pt-2 border-t-2 border-black/10 flex flex-col gap-2">
              {!isUserPremium ? (
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/membership"
                  className="w-full text-center py-3 bg-[#FF4D6D] text-white font-display font-black rounded-xl border-2 border-black pop-shadow"
                >
                  👑 Go Premium (Save 20%)
                </Link>
              ) : (
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/profile"
                  className="w-full text-center py-3 bg-[#FFE600] text-black font-display font-black rounded-xl border-2 border-black pop-shadow"
                >
                  ⭐ VIP Membership Active (Manage Perks)
                </Link>
              )}
              {!user && (
                <div className="flex gap-2">
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href="/login"
                    className="flex-1 text-center py-2.5 bg-white dark:bg-slate-800 font-bold rounded-xl border-2 border-black pop-shadow"
                  >
                    Sign In
                  </Link>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href="/signup"
                    className="flex-1 text-center py-2.5 bg-[#FFE600] text-black font-bold rounded-xl border-2 border-black pop-shadow"
                  >
                    Join Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 pop-shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔎</span>
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  Search Integrative Pet Health
                </h3>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg border-2 border-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
                  setSearchOpen(false);
                }
              }}
              className="relative"
            >
              <input
                type="text"
                autoFocus
                placeholder="Search gut health, arthritis, acupuncture, rabbit stasis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pr-12 text-base font-semibold border-3 border-black rounded-2xl bg-[#FFFDF5] dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#00F5D4]"
              />
              <button
                type="submit"
                className="absolute right-3 top-3.5 bg-[#FFE600] p-2 rounded-xl border-2 border-black font-bold hover:scale-105"
              >
                ➔
              </button>
            </form>

            <div className="mt-4 pt-4 border-t-2 border-slate-200 dark:border-slate-800">
              <p className="text-xs font-black uppercase text-slate-500 mb-2">
                Popular Health Topics:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Canine Microbiome",
                  "Feline Kidney CKD",
                  "Laser Therapy",
                  "Senior Dog Exercises",
                  "Acupressure Calming",
                  "Elimination Diet",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?search=${encodeURIComponent(tag)}`}
                    onClick={() => setSearchOpen(false)}
                    className="text-xs font-bold bg-[#FFF0F3] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-black rounded-lg px-2.5 py-1 hover:bg-[#FFE600] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
