"use client";

import React, { useEffect } from "react";
import { PetWallPhoto } from "@/types";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface LightboxModalProps {
  photo: PetWallPhoto | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onLike?: (id: string) => void;
}

export function LightboxModal({
  photo,
  onClose,
  onNext,
  onPrev,
  onLike,
}: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-4 sm:p-6 pop-shadow-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-black flex items-center justify-center pop-shadow hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5 text-black dark:text-white" />
        </button>

        {/* Navigation Arrows */}
        {onPrev && (
          <button
            onClick={onPrev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center pop-shadow hover:scale-110 active:scale-95 cursor-pointer text-black"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center pop-shadow hover:scale-110 active:scale-95 cursor-pointer text-black"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Large Image Frame */}
        <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl border-3 border-black bg-slate-950">
          <img
            src={photo.imageUrl}
            alt={`Photo by ${photo.ownerDisplayName}`}
            className="max-h-[68vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Bottom Bar: Owner display name & like counter */}
        <div className="w-full mt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <div>
              <p className="font-hand font-bold text-2xl text-slate-900 dark:text-yellow-300">
                {photo.ownerDisplayName}
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Public Pet Wall Community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onLike && onLike(photo.id)}
              className="px-4 py-2 bg-[#FF4D6D] text-white border-2 border-black rounded-xl pop-shadow font-display font-black text-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{photo.likesCount} Loves</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
