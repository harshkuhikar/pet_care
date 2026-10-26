"use client";

import React, { useState } from "react";
import { PetWallPhoto } from "@/types";
import { likePetWallPhoto, reportPetWallPhoto } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Heart, Flag, Sparkles, Check } from "lucide-react";

interface PetWallCardProps {
  photo: PetWallPhoto;
  onOpenLightbox: (photo: PetWallPhoto) => void;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PetWallCard({
  photo,
  onOpenLightbox,
  isOwner = false,
  onDelete,
}: PetWallCardProps) {
  const [likes, setLikes] = useState(photo.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [reported, setReported] = useState(false);
  const [likeBurst, setLikeBurst] = useState(false);
  const { requireAuth } = useAuth();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    requireAuth(() => {
      if (hasLiked) return;
      const newCount = likePetWallPhoto(photo.id);
      setLikes(newCount);
      setHasLiked(true);
      setLikeBurst(true);
      setTimeout(() => setLikeBurst(false), 800);
    }, "Please sign in or create an account to like pets on the Community Wall!");
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();

    requireAuth(() => {
      if (reported) return;
      if (confirm("Would you like to report this photo for review by our moderation team?")) {
        reportPetWallPhoto(photo.id);
        setReported(true);
        alert("Thank you. Our moderators will review this photo within 24 hours.");
      }
    }, "Please sign in or create an account to submit a community report.");
  };

  // Polaroid tilt style
  const rotation = photo.rotationDeg ?? 0;

  return (
    <div
      onClick={() => onOpenLightbox(photo)}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="group cursor-pointer bg-white dark:bg-slate-900 border-3 border-black rounded-3xl p-3 pb-4 pop-shadow hover:!rotate-0 hover:-translate-y-2 hover:scale-105 hover:shadow-[8px_8px_0px_#181126] dark:hover:shadow-[8px_8px_0px_#FFE600] hover:z-20 transition-all duration-300 select-none relative break-inside-avoid mb-6"
    >
      {/* Decorative Washi Tape on Top Center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FFE600] dark:bg-[#FFE600]/80 border-2 border-black rotate-1 shadow-sm rounded-sm pointer-events-none group-hover:rotate-3 transition-transform" />

      {/* Pet Photo Frame (NO pet name, NO caption, NO bio, strictly as required) */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-black bg-slate-100">
        <img
          src={photo.imageUrl}
          alt={`Companion photo posted by ${photo.ownerDisplayName}`}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Floating Like Heart with Particle Burst */}
        <div className="absolute bottom-2.5 right-2.5">
          {likeBurst && (
            <div className="absolute -top-6 -left-2 pointer-events-none flex gap-1 animate-bounce">
              <span className="text-sm">💖</span>
              <span className="text-xs">✨</span>
            </div>
          )}
          <button
            onClick={handleLike}
            aria-label="Like photo"
            type="button"
            className={`px-3 py-1.5 rounded-full border-2 border-black pop-shadow flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
              likeBurst ? "animate-heart-burst scale-110" : ""
            } ${
              hasLiked
                ? "bg-[#FF4D6D] text-white"
                : "bg-white/95 text-[#181126] hover:bg-[#FF4D6D] hover:text-white"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-white" : ""}`} />
            <span>{likes}</span>
          </button>
        </div>
      </div>

      {/* Polaroid Bottom Caption: STRICTLY owner's display name only */}
      <div className="mt-3 px-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-base group-hover:scale-125 transition-transform">🐾</span>
          <p className="font-hand font-black text-xl text-[#181126] dark:text-white truncate">
            {photo.ownerDisplayName}
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {isOwner && onDelete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete your photo?")) {
                  onDelete(photo.id);
                }
              }}
              type="button"
              className="text-[10px] font-black text-rose-700 bg-rose-50 border-2 border-rose-300 rounded-lg px-2 py-0.5 hover:bg-rose-100"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={handleReport}
              type="button"
              aria-label="Report photo"
              title="Report inappropriate photo"
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-600 transition-opacity"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
