"use client";

import {
  Article,
  Partner,
  Pet,
  PetWallPhoto,
  UserProfile,
  ForumThread,
  NewsletterIssue,
} from "@/types";
import {
  SEED_ARTICLES,
  SEED_PARTNERS,
  SEED_PET_WALL,
  SEED_FORUM_THREADS,
  SEED_NEWSLETTERS,
} from "./seedData";

// Default Demo User
export const DEFAULT_USER: UserProfile = {
  id: "usr_alice",
  email: "sarah.barnaby@example.com",
  displayName: "Barnaby's Mom",
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  role: "premium",
  plan: "premium",
  planRenewsAt: "2027-03-15",
  joinedAt: "2025-11-10",
  bio: "Holistic pet guardian passionate about canine gut health, positive reinforcement, and raw nutrition for rescue dogs.",
  newsletterSubscribed: true,
  newsletterFrequency: "weekly",
  savedArticlesCount: 4,
  petsCount: 2,
};

export const DEFAULT_PETS: Pet[] = [
  {
    id: "pet-1",
    userId: "usr_alice",
    name: "Barnaby",
    species: "dog",
    breed: "Golden Retriever Mix",
    age: "4 years",
    photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
    healthNotes: "Recovered from antibiotic-induced dysbiosis. Currently doing raw fermented kefir daily. Mild seasonal paw itching in spring.",
    allergies: ["Chicken", "Corn"],
    dietType: "Gently Cooked Single-Protein (Beef + Omega-3)",
    createdAt: "2025-11-12",
  },
  {
    id: "pet-2",
    userId: "usr_alice",
    name: "Cleo",
    species: "cat",
    breed: "Domestic Shorthair",
    age: "7 years",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    healthNotes: "Routine preventative renal hydration checks. Excellent bloodwork. Prefers warm chicken bone broth toppers.",
    allergies: ["Dry Grain"],
    dietType: "High-Moisture Wet Pâté + Chitosan",
    createdAt: "2026-01-05",
  },
];

const STORAGE_KEYS = {
  USER: "pawswell_user",
  PETS: "pawswell_pets",
  BOOKMARKS: "pawswell_bookmarks",
  SAVED_ITEMS: "pawswell_saved_items",
  PET_WALL: "pawswell_pet_wall",
  ARTICLES: "pawswell_articles",
  THREADS: "pawswell_threads",
  NEWSLETTER_SUBS: "pawswell_newsletter_subscribers",
  THEME: "pawswell_theme",
};

// Safe LocalStorage Helper
function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("LocalStorage write error:", err);
  }
}

// User / Auth Helpers
export function getCurrentUser(): UserProfile | null {
  return getFromStorage<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_USER);
}

export function saveUser(user: UserProfile | null): void {
  setToStorage(STORAGE_KEYS.USER, user);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pawswell_user_updated", { detail: user }));
  }
}

export function logoutUser(): void {
  setToStorage(STORAGE_KEYS.USER, null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pawswell_user_updated", { detail: null }));
  }
}

export function loginDemoUser(role: "member" | "premium" | "pro" | "admin" = "premium"): UserProfile {
  const user: UserProfile = {
    ...DEFAULT_USER,
    role,
    plan: role === "member" ? "free" : role === "pro" ? "pro" : "premium",
  };
  saveUser(user);
  return user;
}

export function upgradeUserPlan(plan: "free" | "monthly" | "yearly" | "pro" | "premium"): UserProfile | null {
  const user = getCurrentUser();
  if (!user) return null;
  const updated: UserProfile = {
    ...user,
    role: plan === "free" ? "member" : plan === "pro" ? "pro" : "premium",
    plan,
    planRenewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };
  saveUser(updated);
  return updated;
}

// Pets Helpers
export function getUserPets(userId: string): Pet[] {
  const allPets = getFromStorage<Pet[]>(STORAGE_KEYS.PETS, DEFAULT_PETS);
  return allPets.filter((p) => p.userId === userId);
}

export function addPet(petData: Omit<Pet, "id" | "createdAt">): Pet {
  const allPets = getFromStorage<Pet[]>(STORAGE_KEYS.PETS, DEFAULT_PETS);
  const newPet: Pet = {
    ...petData,
    id: `pet_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newPet, ...allPets];
  setToStorage(STORAGE_KEYS.PETS, updated);
  return newPet;
}

export function updatePet(id: string, updates: Partial<Pet>): Pet | null {
  const allPets = getFromStorage<Pet[]>(STORAGE_KEYS.PETS, DEFAULT_PETS);
  const index = allPets.findIndex((p) => p.id === id);
  if (index === -1) return null;
  allPets[index] = { ...allPets[index], ...updates };
  setToStorage(STORAGE_KEYS.PETS, allPets);
  return allPets[index];
}

export function deletePet(id: string): void {
  const allPets = getFromStorage<Pet[]>(STORAGE_KEYS.PETS, DEFAULT_PETS);
  const updated = allPets.filter((p) => p.id !== id);
  setToStorage(STORAGE_KEYS.PETS, updated);
}

// Bookmarks & Saved Items
export function getSavedArticleIds(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.BOOKMARKS, [
    "art-nutr-1",
    "art-ex-1",
    "art-ther-1",
    "art-nutr-2",
  ]);
}

export function isArticleSaved(articleId: string): boolean {
  const saved = getSavedArticleIds();
  return saved.includes(articleId);
}

export function toggleSaveArticle(articleId: string): boolean {
  const saved = getSavedArticleIds();
  let updated: string[];
  let nowSaved = false;
  if (saved.includes(articleId)) {
    updated = saved.filter((id) => id !== articleId);
  } else {
    updated = [articleId, ...saved];
    nowSaved = true;
  }
  setToStorage(STORAGE_KEYS.BOOKMARKS, updated);
  return nowSaved;
}

// Pet Wall
export function getPetWallPhotos(): PetWallPhoto[] {
  return getFromStorage<PetWallPhoto[]>(STORAGE_KEYS.PET_WALL, SEED_PET_WALL);
}

export function addPetWallPhoto(photo: Omit<PetWallPhoto, "id" | "createdAt" | "likesCount" | "reportedCount">): PetWallPhoto {
  const all = getPetWallPhotos();
  const newPhoto: PetWallPhoto = {
    ...photo,
    id: `pw_${Date.now()}`,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    reportedCount: 0,
    rotationDeg: Math.floor(Math.random() * 7) - 3, // Tilted polaroid -3 to +3 deg
  };
  const updated = [newPhoto, ...all];
  setToStorage(STORAGE_KEYS.PET_WALL, updated);
  return newPhoto;
}

export function likePetWallPhoto(id: string): number {
  const all = getPetWallPhotos();
  const photo = all.find((p) => p.id === id);
  if (!photo) return 0;
  photo.likesCount += 1;
  setToStorage(STORAGE_KEYS.PET_WALL, all);
  return photo.likesCount;
}

export function reportPetWallPhoto(id: string): void {
  const all = getPetWallPhotos();
  const photo = all.find((p) => p.id === id);
  if (!photo) return;
  photo.reportedCount += 1;
  if (photo.reportedCount >= 3) {
    photo.status = "flagged";
  }
  setToStorage(STORAGE_KEYS.PET_WALL, all);
}

export function deletePetWallPhoto(id: string): void {
  const all = getPetWallPhotos();
  const updated = all.filter((p) => p.id !== id);
  setToStorage(STORAGE_KEYS.PET_WALL, updated);
}

// EXIF Stripper Simulation
// Draws image to Canvas in-memory and outputs a sanitized JPEG Data URL
export async function stripExifAndCompress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Max dimension 1200px
        let { width, height } = img;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        // Drawing on canvas strips all camera EXIF, GPS and metadata
        ctx.drawImage(img, 0, 0, width, height);

        const cleanDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(cleanDataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Community Forum Helpers
export function getForumThreads(): ForumThread[] {
  return getFromStorage<ForumThread[]>(STORAGE_KEYS.THREADS, SEED_FORUM_THREADS);
}

export function addForumThread(thread: Omit<ForumThread, "id" | "createdAt" | "repliesCount" | "likesCount">): ForumThread {
  const all = getForumThreads();
  const newThread: ForumThread = {
    ...thread,
    id: `th_${Date.now()}`,
    createdAt: new Date().toISOString(),
    repliesCount: 0,
    likesCount: 0,
  };
  const updated = [newThread, ...all];
  setToStorage(STORAGE_KEYS.THREADS, updated);
  return newThread;
}

// Newsletter subscription
export function subscribeToNewsletter(email: string): boolean {
  const subs = getFromStorage<string[]>(STORAGE_KEYS.NEWSLETTER_SUBS, []);
  if (!subs.includes(email.toLowerCase())) {
    subs.push(email.toLowerCase());
    setToStorage(STORAGE_KEYS.NEWSLETTER_SUBS, subs);
  }
  return true;
}
