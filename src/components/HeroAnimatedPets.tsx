"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function HeroAnimatedPets() {
  const [activeSpeech, setActiveSpeech] = useState<string | null>("Woof! Real meat in my bowl please!");
  const [dogHappy, setDogHappy] = useState(false);
  const [catHappy, setCatHappy] = useState(false);
  const [bunnyHappy, setBunnyHappy] = useState(false);

  // Playful procedural chimes (zero external audio files needed!)
  const playCuteChime = (freq1: number, freq2: number) => {
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
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio not permitted or muted
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      {/* Dynamic Interactive Speech Bubble */}
      {activeSpeech && (
        <div className="relative z-20 mb-3 animate-float-slow">
          <div className="bg-white dark:bg-slate-900 border-3 border-black rounded-2xl px-5 py-2.5 pop-shadow flex items-center gap-2">
            <span className="text-xl animate-bounce">💬</span>
            <p className="font-hand text-lg md:text-xl font-black text-[#181126] dark:text-yellow-300">
              {activeSpeech}
            </p>
          </div>
          <div className="w-3.5 h-3.5 bg-white dark:bg-slate-900 border-r-3 border-b-3 border-black rotate-45 mx-auto -mt-2" />
        </div>
      )}

      {/* Hero Illustration Collage Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[380px] bg-[#FFF0F3] dark:bg-[#251633] border-4 border-black rounded-3xl pop-shadow-xl overflow-hidden flex items-end justify-center p-4">
        {/* Decorative Background Elements */}
        <div className="absolute top-4 left-6 text-3xl opacity-80 animate-bounce">☀️</div>
        <div className="absolute top-6 right-8 text-2xl animate-float-slow">⭐</div>
        <div className="absolute top-16 left-1/3 text-xl opacity-75 animate-spin-slow">✨</div>

        {/* Big Sticker Tag */}
        <div className="absolute top-4 right-4 bg-[#FFE600] text-black font-display text-xs md:text-sm font-black px-3.5 py-1.5 rounded-full border-2 border-black rotate-3 pop-shadow flex items-center gap-1.5 animate-wiggle">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>VET REVIEWED</span>
        </div>

        {/* 1. TAIL-WAGGING DOG (Golden / Lab) */}
        <div
          onClick={() => {
            playCuteChime(440, 660);
            setActiveSpeech("Tail wags 100x faster after bone broth!");
            setDogHappy(true);
            setTimeout(() => setDogHappy(false), 2200);
          }}
          className="relative z-10 cursor-pointer group transition-transform hover:scale-110 active:scale-95"
          title="Click Buster the dog!"
        >
          {dogHappy && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm bg-[#FFE600] text-black font-display font-black px-2 py-0.5 rounded-full border-2 border-black pop-shadow animate-bounce">
              <span>🦴 Wag!</span>
            </div>
          )}
          <svg
            width="170"
            height="180"
            viewBox="0 0 170 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Animated Tail */}
            <g className={dogHappy ? "animate-tail-wag" : "animate-tail-wag origin-[140px_130px]"}>
              <path
                d="M135 120 C160 100, 175 75, 160 55 C150 45, 140 60, 130 90"
                stroke="#E5A638"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Dog Body */}
            <path
              d="M35 110 C35 70, 75 70, 110 80 C135 90, 145 130, 140 160 C135 170, 35 170, 35 110 Z"
              fill="#F9BA48"
              stroke="#181126"
              strokeWidth="3.5"
            />
            {/* Belly spot */}
            <path
              d="M55 125 C55 100, 85 95, 110 110 C105 145, 60 145, 55 125 Z"
              fill="#FDE68A"
            />

            {/* Back Legs */}
            <ellipse cx="125" cy="155" rx="18" ry="12" fill="#E5A638" stroke="#181126" strokeWidth="3" />
            <ellipse cx="45" cy="158" rx="16" ry="10" fill="#E5A638" stroke="#181126" strokeWidth="3" />
            <ellipse cx="75" cy="158" rx="16" ry="10" fill="#E5A638" stroke="#181126" strokeWidth="3" />

            {/* Dog Head */}
            <circle cx="68" cy="65" r="38" fill="#F9BA48" stroke="#181126" strokeWidth="3.5" />

            {/* Floppy Dog Ears */}
            <path
              d="M38 50 C20 50, 18 90, 35 95 C45 98, 48 70, 38 50 Z"
              fill="#D97706"
              stroke="#181126"
              strokeWidth="3.5"
            />
            <path
              d="M98 50 C116 50, 118 90, 101 95 C91 98, 88 70, 98 50 Z"
              fill="#D97706"
              stroke="#181126"
              strokeWidth="3.5"
            />

            {/* Eyes */}
            <circle cx="56" cy="60" r="5" fill="#181126" />
            <circle cx="58" cy="58" r="1.8" fill="#FFFFFF" />
            <circle cx="80" cy="60" r="5" fill="#181126" />
            <circle cx="82" cy="58" r="1.8" fill="#FFFFFF" />

            {/* Snout & Nose */}
            <ellipse cx="68" cy="74" rx="14" ry="10" fill="#FDE68A" stroke="#181126" strokeWidth="2.5" />
            <path d="M63 70 Q68 67 73 70 Q68 76 63 70 Z" fill="#181126" />
            {/* Cute Smile / Tongue */}
            <path d="M68 74 Q68 82 68 82" stroke="#181126" strokeWidth="2.5" />
            <path
              d="M64 80 Q68 92 72 80"
              fill="#FF4D6D"
              stroke="#181126"
              strokeWidth="2"
            />

            {/* Red Collar with Gold Medallion */}
            <path d="M48 95 Q68 102 88 95" stroke="#FF4D6D" strokeWidth="7" strokeLinecap="round" />
            <circle cx="68" cy="103" r="6" fill="#FFE600" stroke="#181126" strokeWidth="2" />
          </svg>
        </div>

        {/* 2. BLINKING CAT (Tuxedo / Calico) */}
        <div
          onClick={() => {
            playCuteChime(580, 880);
            setActiveSpeech("Purrr... Fresh spring water & acupuncture please!");
            setCatHappy(true);
            setTimeout(() => setCatHappy(false), 2200);
          }}
          className="relative z-20 -ml-4 cursor-pointer group transition-transform hover:scale-110 active:scale-95"
          title="Click Luna the cat!"
        >
          {catHappy && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm bg-[#00F5D4] text-black font-display font-black px-2 py-0.5 rounded-full border-2 border-black pop-shadow animate-bounce">
              <span>🐟 Purr!</span>
            </div>
          )}
          <svg
            width="135"
            height="155"
            viewBox="0 0 135 155"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Cat Body */}
            <path
              d="M30 90 C30 65, 75 65, 95 90 C105 105, 110 135, 105 145 C100 152, 25 152, 25 135 Z"
              fill="#181126"
              stroke="#FFE600"
              strokeWidth="2.5"
            />
            {/* White Tuxedo Chest */}
            <path
              d="M48 90 C55 90, 75 90, 78 115 C75 140, 50 140, 48 115 Z"
              fill="#FFFDF5"
            />

            {/* Cat Head */}
            <circle cx="62" cy="52" r="30" fill="#181126" stroke="#FFE600" strokeWidth="2.5" />

            {/* Pointy Cat Ears */}
            <polygon points="38,32 30,5 50,24" fill="#181126" stroke="#FFE600" strokeWidth="2.5" />
            <polygon points="40,28 34,14 48,24" fill="#FF4D6D" />
            <polygon points="74,24 94,5 86,32" fill="#181126" stroke="#FFE600" strokeWidth="2.5" />
            <polygon points="76,24 90,14 84,28" fill="#FF4D6D" />

            {/* Animated Blinking Eyes */}
            <g className="animate-cat-blink origin-[62px_48px]">
              <ellipse cx="50" cy="48" rx="6" ry="6" fill="#00F5D4" />
              <ellipse cx="50" cy="48" rx="2" ry="5.5" fill="#181126" />
              <ellipse cx="74" cy="48" rx="6" ry="6" fill="#00F5D4" />
              <ellipse cx="74" cy="48" rx="2" ry="5.5" fill="#181126" />
            </g>

            {/* Pink Nose & Whiskers */}
            <polygon points="59,57 65,57 62,61" fill="#FF4D6D" />
            {/* Whiskers */}
            <line x1="32" y1="58" x2="16" y2="54" stroke="#FFFDF5" strokeWidth="2" />
            <line x1="32" y1="62" x2="14" y2="64" stroke="#FFFDF5" strokeWidth="2" />
            <line x1="92" y1="58" x2="108" y2="54" stroke="#FFFDF5" strokeWidth="2" />
            <line x1="92" y1="62" x2="110" y2="64" stroke="#FFFDF5" strokeWidth="2" />
          </svg>
        </div>

        {/* 3. HOPPING BUNNY */}
        <div
          onClick={() => {
            playCuteChime(660, 440);
            setActiveSpeech("Thump! High-fiber dandelion greens are life!");
            setBunnyHappy(true);
            setTimeout(() => setBunnyHappy(false), 2200);
          }}
          className="relative z-10 -ml-2 cursor-pointer group transition-transform hover:scale-110 active:scale-95 animate-bunny-hop"
          title="Click Clover the bunny!"
        >
          {bunnyHappy && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm bg-[#FF4D6D] text-white font-display font-black px-2 py-0.5 rounded-full border-2 border-black pop-shadow animate-bounce">
              <span>🥕 Hop!</span>
            </div>
          )}
          <svg
            width="105"
            height="130"
            viewBox="0 0 105 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Long Floppy Ears */}
            <ellipse cx="40" cy="22" rx="7" ry="22" fill="#E2E8F0" stroke="#181126" strokeWidth="2.5" />
            <ellipse cx="40" cy="22" rx="3.5" ry="16" fill="#FFCCD5" />

            <ellipse cx="58" cy="24" rx="7" ry="22" fill="#E2E8F0" stroke="#181126" strokeWidth="2.5" />
            <ellipse cx="58" cy="24" rx="3.5" ry="16" fill="#FFCCD5" />

            {/* Bunny Head */}
            <circle cx="50" cy="58" r="22" fill="#FFFFFF" stroke="#181126" strokeWidth="2.5" />

            {/* Bunny Body */}
            <ellipse cx="54" cy="98" rx="26" ry="22" fill="#FFFFFF" stroke="#181126" strokeWidth="2.5" />

            {/* Big Hind Foot */}
            <ellipse cx="76" cy="112" rx="14" ry="8" fill="#FFFFFF" stroke="#181126" strokeWidth="2" />

            {/* Bunny Eyes */}
            <circle cx="43" cy="55" r="3.5" fill="#7928CA" />
            <circle cx="44" cy="54" r="1.2" fill="#FFFFFF" />
            <circle cx="59" cy="55" r="3.5" fill="#7928CA" />
            <circle cx="60" cy="54" r="1.2" fill="#FFFFFF" />

            {/* Bunny Nose & Cheeks */}
            <ellipse cx="51" cy="63" rx="2.5" ry="1.8" fill="#FF4D6D" />
            <path d="M47 67 Q51 70 55 67" stroke="#181126" strokeWidth="1.8" fill="none" />
          </svg>
        </div>

        {/* Small Floating Treat / Toy */}
        <div className="absolute bottom-3 left-4 bg-white dark:bg-slate-800 border-2 border-black rounded-full px-2.5 py-1 text-xs font-bold pop-shadow flex items-center gap-1">
          <span>🥕</span>
          <span className="font-display">Fresh Food</span>
        </div>
      </div>

      {/* Interactive Micro-CTA */}
      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
        <Heart className="w-3.5 h-3.5 text-brand-coral animate-pulse" />
        <span>Tap any pet to hear what they crave!</span>
      </div>
    </div>
  );
}
