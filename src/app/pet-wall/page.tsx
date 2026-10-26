"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPetWallPhotos, getCurrentUser, deletePetWallPhoto } from "@/lib/storage";
import { PetWallPhoto, UserProfile } from "@/types";
import { PetWallCard } from "@/components/PetWallCard";
import { LightboxModal } from "@/components/LightboxModal";
import { UploadPhotoModal } from "@/components/UploadPhotoModal";
import { useAuth } from "@/context/AuthContext";
import { Camera, Sparkles, Shield, Heart, Plus } from "lucide-react";

export default function PetWallPage() {
  const [photos, setPhotos] = useState<PetWallPhoto[]>([]);
  const { user: authUser, requireAuth } = useAuth();
  const [activePhoto, setActivePhoto] = useState<PetWallPhoto | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    setPhotos(getPetWallPhotos());
  }, []);

  const handlePhotoUploaded = (newPhoto: PetWallPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  const handleDeletePhoto = (id: string) => {
    deletePetWallPhoto(id);
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setActivePhoto(photos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setActivePhoto(photos[prevIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Page Header with Floating Stickers & High-Contrast Typography */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative">
        <div className="absolute -top-4 left-4 text-3xl animate-float-slow hidden sm:block">📸</div>
        <div className="absolute -top-2 right-6 text-3xl animate-bounce hidden sm:block">🐶</div>
        <div className="absolute top-10 -left-6 text-2xl animate-spin-slow hidden lg:block">✨</div>

        <div className="inline-flex items-center gap-1.5 bg-[#06D6A0] text-black font-display font-black text-xs px-4 py-1.5 rounded-full border-2 border-black rotate-[-2deg] mb-3 pop-shadow animate-wiggle">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-radar" />
          <span>LIVE COMMUNITY WALL</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#181126] dark:text-white leading-tight">
          The PawsWell Pet Wall
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-800 dark:text-slate-200 font-bold max-w-2xl mx-auto">
          A joyous, polaroid celebration of our companions. Visible to all pet lovers worldwide.
        </p>
      </div>

      {/* Action / Privacy Header Banner */}
      <div className="bg-[#FFE600] border-4 border-black rounded-3xl p-6 pop-shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-black text-left">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-black flex items-center justify-center text-3xl pop-shadow shrink-0">
            🛡️
          </div>
          <div>
            <h3 className="font-display font-black text-xl">
              Guardian Privacy by Design
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Only your pet&apos;s photo and your chosen display name appear. All camera EXIF and GPS coordinates are automatically stripped. No emails, no locations, no comments.
            </p>
          </div>
        </div>

        {/* Upload Trigger: Protected by requireAuth */}
        <button
          onClick={() =>
            requireAuth(
              () => setUploadModalOpen(true),
              "Please sign in or create an account to share your pet's photo on the community wall!"
            )
          }
          className="px-6 py-4 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Post Your Pet Photo</span>
        </button>
      </div>

      {/* Masonry Polaroid Photo Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-6">
        {photos.map((photo) => (
          <PetWallCard
            key={photo.id}
            photo={photo}
            onOpenLightbox={(p) => setActivePhoto(p)}
            isOwner={authUser?.name === photo.ownerDisplayName || authUser?.id === photo.userId}
            onDelete={handleDeletePhoto}
          />
        ))}
      </div>

      {/* Signed-Out Visitors Callout Bottom Banner */}
      {!authUser && (
        <div className="mt-16 bg-[#FFF0F3] dark:bg-purple-950/40 border-4 border-black rounded-3xl p-8 sm:p-12 pop-shadow-xl text-center max-w-2xl mx-auto space-y-4">
          <span className="text-4xl block animate-bounce">🐾</span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#181126] dark:text-white">
            Want to see your pet framed on the wall?
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
            Create a free account in under 30 seconds to upload photos, save holistic health recipes, and read our weekly Sunday Dispatch.
          </p>
          <div className="pt-2">
            <button
              onClick={() =>
                requireAuth(
                  () => setUploadModalOpen(true),
                  "Please sign in or create an account to share your pet's photo on the community wall!"
                )
              }
              className="inline-block px-7 py-4 bg-[#FFE600] text-black font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow hover:scale-108 active:scale-95 transition-all cursor-pointer animate-pulse-badge"
            >
              Join the PawsWell Community Free
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {authUser && (
        <UploadPhotoModal
          user={{
            id: authUser.id,
            email: authUser.email,
            displayName: authUser.name,
            avatarUrl: authUser.avatarUrl,
            role: authUser.role === "admin" ? "admin" : authUser.isVIP ? "premium" : "member",
            plan: authUser.plan,
            joinedAt: authUser.createdAt ? authUser.createdAt.split("T")[0] : "2026-01-01",
            newsletterSubscribed: true,
            newsletterFrequency: "weekly",
          }}
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onPhotoUploaded={handlePhotoUploaded}
        />
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
      />
    </div>
  );
}
