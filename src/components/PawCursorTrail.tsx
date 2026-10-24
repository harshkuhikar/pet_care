"use client";

import React, { useEffect, useState } from "react";

interface PawPoint {
  id: number;
  x: number;
  y: number;
  side: "left" | "right";
}

export function PawCursorTrail() {
  const [paws, setPaws] = useState<PawPoint[]>([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setEnabled(false);
      return;
    }

    let lastTime = 0;
    let nextSide: "left" | "right" = "left";

    const handleMouseMove = (e: MouseEvent) => {
      if (!enabled) return;
      const now = Date.now();
      // Throttle creating paw every 180ms
      if (now - lastTime < 180) return;
      lastTime = now;

      // Small offset for alternating left/right paws
      const offsetX = nextSide === "left" ? -14 : 14;
      nextSide = nextSide === "left" ? "right" : "left";

      const newPaw: PawPoint = {
        id: now,
        x: e.clientX + offsetX,
        y: e.clientY + 12,
        side: nextSide,
      };

      setPaws((prev) => [...prev.slice(-12), newPaw]);

      // Remove after 1.5s
      setTimeout(() => {
        setPaws((prev) => prev.filter((p) => p.id !== newPaw.id));
      }, 1400);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled]);

  if (!enabled || paws.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {paws.map((paw) => (
        <span
          key={paw.id}
          style={{
            left: `${paw.x}px`,
            top: `${paw.y}px`,
            transform: `translate(-50%, -50%) rotate(${paw.side === "left" ? "-15deg" : "15deg"}) scale(0.9)`,
            animation: "fadeOutPaw 1.4s ease-out forwards",
          }}
          className="absolute text-brand-coral drop-shadow-[0_2px_4px_rgba(255,77,109,0.4)] opacity-90 transition-opacity"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Pad */}
            <ellipse cx="12" cy="15.5" rx="5" ry="4.2" fill="#FF4D6D" />
            {/* Toe 1 */}
            <circle cx="6.5" cy="8.5" r="2.4" fill="#00BB9C" />
            {/* Toe 2 */}
            <circle cx="10" cy="5.5" r="2.5" fill="#FFE600" />
            {/* Toe 3 */}
            <circle cx="14" cy="5.5" r="2.5" fill="#FFE600" />
            {/* Toe 4 */}
            <circle cx="17.5" cy="8.5" r="2.4" fill="#7928CA" />
          </svg>
        </span>
      ))}
      <style jsx global>{`
        @keyframes fadeOutPaw {
          0% {
            opacity: 0.95;
            transform: scale(1);
          }
          70% {
            opacity: 0.5;
            transform: scale(0.85);
          }
          100% {
            opacity: 0;
            transform: scale(0.6) translateY(6px);
          }
        }
      `}</style>
    </div>
  );
}
