import React from "react";

interface TickerMarqueeProps {
  items?: string[];
  bgClass?: string;
  textClass?: string;
  speedClass?: string;
}

const DEFAULT_ITEMS = [
  "🐾 BIO-APPROPRIATE NUTRITION",
  "✨ TCVM & CANINE ACUPUNCTURE",
  "🎾 SENIOR JOINT PRESERVATION",
  "🌿 NON-TOXIC HERBAL WELLNESS",
  "🐱 FELINE HYDRATION SECRETS",
  "🐰 RABBIT GUT STASIS PREVENTION",
  "💛 48,000+ COMPANION LOVERS",
  "🥩 HUMAN-GRADE REAL FOOD",
  "🌟 VET-BACKED PROTOCOLS",
];

export function TickerMarquee({
  items = DEFAULT_ITEMS,
  bgClass = "bg-[#FFE600] border-y-2 border-black",
  textClass = "text-black font-black text-xs md:text-sm tracking-wider uppercase",
  speedClass = "animate-marquee",
}: TickerMarqueeProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap py-2 relative select-none ${bgClass}`}>
      <div className={`${speedClass} flex items-center gap-6`}>
        {items.concat(items).map((item, idx) => (
          <span key={idx} className={`flex items-center gap-4 ${textClass}`}>
            <span>{item}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-black/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
