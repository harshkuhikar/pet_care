"use client";

import React, { useState } from "react";
import { stripExifAndCompress, addPetWallPhoto } from "@/lib/storage";
import { firePawsConfetti } from "@/lib/confetti";
import { PetWallPhoto, UserProfile } from "@/types";
import { X, UploadCloud, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface UploadPhotoModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPhotoUploaded: (photo: PetWallPhoto) => void;
}

export function UploadPhotoModal({
  user,
  isOpen,
  onClose,
  onPhotoUploaded,
}: UploadPhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [ownsPhoto, setOwnsPhoto] = useState(false);
  const [noFaces, setNoFaces] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 8MB. Please choose a smaller file.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPEG, PNG, WEBP).");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please choose a photo to upload.");
      return;
    }
    if (!agreedGuidelines || !ownsPhoto || !noFaces) {
      setErrorMsg("Please accept all community confirmation checkboxes.");
      return;
    }

    setIsProcessing(true);
    try {
      // Automatic EXIF / GPS stripping via Canvas
      const sanitizedDataUrl = await stripExifAndCompress(selectedFile);

      // Save to storage
      const newPhoto = addPetWallPhoto({
        userId: user.id,
        ownerDisplayName: user.displayName, // STRICT PRIVACY: only display name is attached
        imageUrl: sanitizedDataUrl,
        aspectRatio: "square",
        status: "approved",
      });

      firePawsConfetti();
      onPhotoUploaded(newPhoto);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to process image. Please try another photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <div>
              <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                Share on the Pet Wall
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                Displayed publicly as:{" "}
                <span className="text-[#FF4D6D] font-black">{user.displayName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-xl border-2 border-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload Zone */}
          {!previewUrl ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-3 border-dashed border-black dark:border-slate-700 rounded-2xl p-8 bg-[#FFFDF5] dark:bg-slate-800/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FFE600]/10 transition-colors"
            >
              <UploadCloud className="w-12 h-12 text-[#FF4D6D] mb-2" />
              <p className="font-display font-black text-base text-slate-900 dark:text-white mb-1">
                Drag & Drop Your Pet&apos;s Photo
              </p>
              <p className="text-xs text-slate-500 mb-4">
                JPEG, PNG, or WEBP up to 8MB
              </p>
              <label className="bg-[#FFE600] text-black font-display font-black text-xs px-4 py-2 rounded-xl border-2 border-black pop-shadow cursor-pointer hover:scale-105 active:scale-95 transition-all">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-square max-h-56 mx-auto rounded-2xl overflow-hidden border-3 border-black pop-shadow">
                <img
                  src={previewUrl}
                  alt="Pet preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-lg border border-black text-xs font-bold"
                >
                  Change
                </button>
              </div>
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>EXIF and location metadata will be automatically stripped.</span>
              </div>
            </div>
          )}

          {/* Privacy & Guidelines Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t-2 border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ownsPhoto}
                onChange={(e) => setOwnsPhoto(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-black accent-[#FF4D6D]"
              />
              <span>I confirm I own or took this photograph and have right to publish it.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={noFaces}
                onChange={(e) => setNoFaces(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-black accent-[#FF4D6D]"
              />
              <span>No human faces, phone numbers, or private details appear in this image.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedGuidelines}
                onChange={(e) => setAgreedGuidelines(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-black accent-[#FF4D6D]"
              />
              <span>I agree to PawsWell&apos;s friendly community guidelines.</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white font-display font-black text-base rounded-2xl border-3 border-black pop-shadow-coral hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Sanitizing & Uploading...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#FFE600]" />
                  <span>Post to Pet Wall</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
