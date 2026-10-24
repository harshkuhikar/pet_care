"use client";

import React, { useState, useEffect } from "react";
import { firePawsConfetti } from "@/lib/confetti";
import { Sparkles, Heart } from "lucide-react";

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export function FloatingPetAnimations() {
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [partyCount, setPartyCount] = useState(0);
  const [mascotBubbleOpen, setMascotBubbleOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  const petTips = [
    "🐾 Buster says: Did you know? Fresh blueberries provide rich brain antioxidants for senior dogs!",
    "🐟 Luna says: Feline kidney health loves moisture! Try adding warm bone broth to their bowl.",
    "🐇 Clover says: Timothy hay should make up 80% of a bunny's daily diet for optimal digestion!",
    "🧘 Mobility tip: 5 minutes of daily post-walk gentle paw massage boosts circulation by 40%!",
    "✨ Holistic fact: TCVM herbal formulas should always be tailored to your pet's constitution.",
    "📸 Pet Wall: Frame your furry companion on our public wall to share the joy worldwide!",
  ];

  const playChime = (freq1 = 520, freq2 = 780) => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio muted or not allowed
    }
  };

  // Click-to-spawn joyful pet reaction particles
  useEffect(() => {
    const emojis = ["🐾", "❤️", "🦴", "✨", "🥕", "🐟", "⭐", "🎾", "💖"];

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        return;
      }

      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const newParticle: ClickParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: randomEmoji,
      };

      setParticles((prev) => [...prev.slice(-12), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handlePartyBurst = () => {
    playChime(440, 880);
    firePawsConfetti();
    setPartyCount((c) => c + 1);
  };

  const handleMascotClick = () => {
    playChime(600, 900);
    setTipIndex((prev) => (prev + 1) % petTips.length);
    setMascotBubbleOpen(true);
    firePawsConfetti();
  };

  return (
    <>
      {/* 1. Global Click Floating Reaction Particles */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              animation: "floatUpParticle 1s ease-out forwards",
            }}
            className="absolute text-2xl font-bold filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* 2. Floating Edge Pets & Toys (Desktop Margins) */}
      <div className="hidden xl:block pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
        {/* Left Side: Floating Waving Puppy */}
        <div
          onClick={handlePartyBurst}
          className="pointer-events-auto absolute left-3 top-1/3 p-2 bg-[#FFE600] border-2 border-black rounded-2xl pop-shadow animate-float-slow cursor-pointer hover:scale-120 active:scale-90 transition-transform group"
          title="Click the pup for a celebration burst!"
        >
          <span className="text-3xl block group-hover:rotate-12 transition-transform">🐶</span>
          <span className="font-hand font-black text-xs text-black block text-center -mt-1">
            Woof!
          </span>
        </div>

        {/* Left Side: Bouncing Squeaky Bone */}
        <div
          onClick={handlePartyBurst}
          className="pointer-events-auto absolute left-6 top-2/3 p-2 bg-[#FFF0F3] border-2 border-black rounded-full pop-shadow animate-bunny-hop cursor-pointer hover:scale-125 transition-transform"
          title="Squeak!"
        >
          <span className="text-2xl block">🦴</span>
        </div>

        {/* Right Side: Floating Blinking Kitty */}
        <div
          onClick={handlePartyBurst}
          className="pointer-events-auto absolute right-3 top-1/4 p-2 bg-[#00F5D4] border-2 border-black rounded-2xl pop-shadow animate-float-slower cursor-pointer hover:scale-120 active:scale-90 transition-transform group"
          title="Click the kitty for confetti!"
        >
          <span className="text-3xl block group-hover:-rotate-12 transition-transform">🐱</span>
          <span className="font-hand font-black text-xs text-black block text-center -mt-1">
            Purr!
          </span>
        </div>

        {/* Right Side: Hopping Bunny */}
        <div
          onClick={handlePartyBurst}
          className="pointer-events-auto absolute right-5 top-3/5 p-2 bg-[#F5EDFF] border-2 border-black rounded-2xl pop-shadow animate-float-slow cursor-pointer hover:scale-125 transition-transform"
          title="Thump!"
        >
          <span className="text-2xl block">🐇</span>
        </div>

        {/* Right Side: Floating Tennis Ball */}
        <div
          onClick={handlePartyBurst}
          className="pointer-events-auto absolute right-7 bottom-28 p-2 bg-[#FFE600] border-2 border-black rounded-full pop-shadow animate-bounce cursor-pointer hover:scale-125 transition-transform"
          title="Catch!"
        >
          <span className="text-2xl block">🎾</span>
        </div>
      </div>

      {/* 3. Floating Bottom-Left Party Confetti Launcher Button */}
      <div className="fixed bottom-5 left-5 z-40 select-none">
        <button
          onClick={handlePartyBurst}
          type="button"
          aria-label="Launch Confetti"
          className="bg-[#FF4D6D] hover:bg-[#E63956] text-white border-3 border-black rounded-2xl px-4 py-2.5 pop-shadow-coral font-display font-black text-xs sm:text-sm flex items-center gap-2 hover:scale-115 active:scale-95 transition-all cursor-pointer animate-wiggle"
          title="Click to burst colorful pet confetti!"
        >
          <span className="text-xl">🎉</span>
          <span className="hidden sm:inline">Paws Party!</span>
          {partyCount > 0 && (
            <span className="bg-[#FFE600] text-black font-black text-[10px] px-2 py-0.5 rounded-full border border-black animate-bounce">
              {partyCount}
            </span>
          )}
        </button>
      </div>

      {/* 4. Interactive Floating Pet Mascot with Wisdom Bubble (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 select-none flex flex-col items-end">
        {mascotBubbleOpen && (
          <div className="mb-2 max-w-[280px] sm:max-w-xs bg-white dark:bg-slate-900 border-3 border-black rounded-2xl p-3 pop-shadow relative animate-pop-bounce">
            <button
              onClick={() => setMascotBubbleOpen(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF4D6D] text-white rounded-full border border-black flex items-center justify-center text-[10px] font-black cursor-pointer hover:scale-110"
              title="Close tip"
            >
              ✕
            </button>
            <p className="text-xs font-bold text-[#181126] dark:text-yellow-300 leading-snug">
              {petTips[tipIndex]}
            </p>
            <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-wider flex items-center gap-1">
              <span>✨ Click mascot for next tip!</span>
            </p>
          </div>
        )}

        <div
          onClick={handleMascotClick}
          className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-black flex items-center justify-center text-3xl pop-shadow cursor-pointer hover:scale-115 hover:rotate-6 active:scale-90 transition-all animate-bounce"
          title="Tap Buster for a pet health tip & confetti!"
        >
          🐾
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatUpParticle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -100px) scale(1.3) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -160px) scale(1.6) rotate(30deg);
          }
        }
      `}</style>
    </>
  );
}
