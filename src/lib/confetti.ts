"use client";

import confetti from "canvas-confetti";

export function firePawsConfetti() {
  if (typeof window === "undefined") return;

  // Maximalist palette: Hot coral, electric teal, sunshine yellow, grape purple, leaf green
  const colors = ["#FF4D6D", "#00F5D4", "#FFE600", "#7928CA", "#06D6A0"];

  // Burst 1
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.7 },
    colors,
    shapes: ["circle", "square"],
    scalar: 1.2,
  });

  // Burst 2 (delayed slightly)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.75 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.75 },
      colors,
    });
  }, 200);
}
