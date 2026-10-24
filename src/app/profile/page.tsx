"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getCurrentUser,
  saveUser,
  getUserPets,
  addPet,
  updatePet,
  deletePet,
  getSavedArticleIds,
  toggleSaveArticle,
  getPetWallPhotos,
  deletePetWallPhoto,
  logoutUser,
} from "@/lib/storage";
import { SEED_ARTICLES, SEED_PARTNERS } from "@/lib/seedData";
import { UserProfile, Pet, PetSpecies, Article, PetWallPhoto } from "@/types";
import { firePawsConfetti } from "@/lib/confetti";
import {
  User,
  Heart,
  Bookmark,
  Camera,
  CreditCard,
  Bell,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Download,
  LogOut,
  X,
} from "lucide-react";

type ProfileTab =
  | "overview"
  | "pets"
  | "saved-blogs"
  | "saved-items"
  | "my-photos"
  | "billing"
  | "notifications"
  | "settings";

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ProfileTab) || "overview";

  const { user: authUser, status: authStatus, logout, refreshUser: refreshAuthUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [myPhotos, setMyPhotos] = useState<PetWallPhoto[]>([]);
  const [qaStats, setQaStats] = useState<{ unlockedCount: number; limit: number | string; isPro: boolean } | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveNameSuccess, setSaveNameSuccess] = useState<string | null>(null);

  // Pet Modal State
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petFormName, setPetFormName] = useState("");
  const [petFormSpecies, setPetFormSpecies] = useState<PetSpecies>("dog");
  const [petFormBreed, setPetFormBreed] = useState("");
  const [petFormAge, setPetFormAge] = useState("");
  const [petFormNotes, setPetFormNotes] = useState("");

  // Collection folder state
  const [activeCollection, setActiveCollection] = useState<string>("All Saved");

  useEffect(() => {
    if (authUser) {
      const cur: UserProfile = {
        id: authUser.id,
        email: authUser.email,
        displayName: authUser.name,
        avatarUrl: authUser.avatarUrl,
        role: authUser.role === "admin" ? "admin" : authUser.isVIP ? "premium" : "member",
        plan: authUser.plan,
        planRenewsAt: authUser.planExpiresAt || "2027-03-15",
        joinedAt: authUser.createdAt ? authUser.createdAt.split("T")[0] : "2026-01-01",
        bio: "Holistic pet guardian passionate about canine & feline longevity, whole food diets, and preventative wellness.",
        newsletterSubscribed: true,
        newsletterFrequency: "weekly",
        savedArticlesCount: 0,
        petsCount: 0,
      };
      setUser(cur);
      setDisplayNameInput(authUser.name);
      setPets(getUserPets(authUser.id));
      const savedIds = getSavedArticleIds();
      setSavedArticles(SEED_ARTICLES.filter((a) => savedIds.includes(a.id)));
      const allPhotos = getPetWallPhotos();
      setMyPhotos(allPhotos.filter((p) => p.userId === authUser.id || p.ownerDisplayName === authUser.name));

      fetch(`/api/qa/user-stats?userId=${authUser.id}&userRole=${authUser.role}&userPlan=${authUser.plan}`)
        .then(async (r) => {
          if (r.ok) {
            const data = await r.json();
            setQaStats(data);
          }
        })
        .catch(() => {});
    } else if (authStatus === "unauthenticated") {
      setUser(null);
    }
  }, [authUser, authStatus]);

  const refreshData = () => {
    if (authUser) {
      setPets(getUserPets(authUser.id));
      const savedIds = getSavedArticleIds();
      setSavedArticles(SEED_ARTICLES.filter((a) => savedIds.includes(a.id)));
      const allPhotos = getPetWallPhotos();
      setMyPhotos(allPhotos.filter((p) => p.userId === authUser.id || p.ownerDisplayName === authUser.name));
    }
  };

  const handleOpenAddPet = () => {
    setEditingPetId(null);
    setPetFormName("");
    setPetFormSpecies("dog");
    setPetFormBreed("");
    setPetFormAge("");
    setPetFormNotes("");
    setPetModalOpen(true);
  };

  const handleOpenEditPet = (pet: Pet) => {
    setEditingPetId(pet.id);
    setPetFormName(pet.name);
    setPetFormSpecies(pet.species);
    setPetFormBreed(pet.breed);
    setPetFormAge(pet.age);
    setPetFormNotes(pet.healthNotes);
    setPetModalOpen(true);
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petFormName.trim() || !user) return;

    if (editingPetId) {
      updatePet(editingPetId, {
        name: petFormName.trim(),
        species: petFormSpecies,
        breed: petFormBreed.trim(),
        age: petFormAge.trim(),
        healthNotes: petFormNotes.trim(),
      });
    } else {
      addPet({
        userId: user.id,
        name: petFormName.trim(),
        species: petFormSpecies,
        breed: petFormBreed.trim(),
        age: petFormAge.trim(),
        healthNotes: petFormNotes.trim(),
      });
      firePawsConfetti();
    }
    setPetModalOpen(false);
    refreshData();
  };

  const handleDeletePet = (id: string) => {
    if (confirm("Are you sure you want to remove this companion profile?")) {
      deletePet(id);
      refreshData();
    }
  };

  const handleRemoveBookmark = (id: string) => {
    toggleSaveArticle(id);
    refreshData();
  };

  const handleDeleteMyPhoto = (id: string) => {
    if (confirm("Delete this photo from the public Pet Wall?")) {
      deletePetWallPhoto(id);
      refreshData();
    }
  };

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  const handleExportData = () => {
    const data = {
      user,
      pets,
      savedArticles: savedArticles.map((a) => a.title),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pawswell-export-${user?.displayName || "user"}.json`;
    a.click();
  };

  if (authStatus === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-3 border-black flex items-center justify-center text-3xl pop-shadow mx-auto">
          🐾
        </div>
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">
          Sign In to Access Your Dashboard
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
          Sign in with your email verification code to access your companions, subscription, and saved health guides.
        </p>
        <Link
          href="/login?next=/profile"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF4D6D] text-white font-display font-black text-sm rounded-2xl border-3 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all"
        >
          <span>Sign In with OTP</span>
          <span>➔</span>
        </Link>
      </div>
    );
  }

  const tabs: { id: ProfileTab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: User },
    { id: "pets", label: `My Pets (${pets.length})`, icon: Heart },
    { id: "saved-blogs", label: `Saved Guides (${savedArticles.length})`, icon: Bookmark },
    { id: "saved-items", label: "Perks & Recipes", icon: Sparkles },
    { id: "my-photos", label: `Pet Wall (${myPhotos.length})`, icon: Camera },
    { id: "billing", label: "Membership & Billing", icon: CreditCard },
    { id: "notifications", label: "Email & Alerts", icon: Bell },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Top Banner Profile Bar */}
      <div className="bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl mb-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-20 h-20 rounded-2xl object-cover border-3 border-black pop-shadow"
          />
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white">
                {user.displayName}
              </h1>
              <span className="bg-[#FFE600] text-black font-display font-black text-xs px-2.5 py-0.5 rounded-full border border-black uppercase">
                {user.role} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mb-2">{user.email}</p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium max-w-xl">
              {user.bio || "Guardian passionate about holistic wellness and whole-food nourishment."}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <Link
            href="/membership"
            className="px-4 py-2.5 bg-[#FF4D6D] text-white font-display font-black text-xs rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all text-center"
          >
            Manage Plan
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border-2 border-black pop-shadow hover:bg-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Navigation & Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs (Desktop Left Column) */}
        <nav className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-3.5 rounded-2xl border-2 border-black text-left flex items-center gap-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-[#FFE600] text-black pop-shadow scale-102"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-black"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-purple-900" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content Panels (Right Column) */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 pop-shadow-xl min-h-[500px]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-2xl text-[#181126] dark:text-white">
                Member Overview
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FFF0F3] dark:bg-slate-800 border-2 border-black rounded-2xl p-4 pop-shadow hover:-translate-y-1 hover:scale-102 transition-all">
                  <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Membership Tier</span>
                  <p className="font-display font-black text-2xl text-[#FF4D6D] uppercase">
                    {user.plan}
                  </p>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Active through {user.planRenewsAt || "2027"}
                  </span>
                </div>

                <div className="bg-[#E8FFF9] dark:bg-slate-800 border-2 border-black rounded-2xl p-4 pop-shadow hover:-translate-y-1 hover:scale-102 transition-all">
                  <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Registered Companions</span>
                  <p className="font-display font-black text-2xl text-[#00BB9C]">
                    {pets.length} Pets
                  </p>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Private health tracking enabled
                  </span>
                </div>

                <div className="bg-[#FFF385] dark:bg-slate-800 border-2 border-black rounded-2xl p-4 pop-shadow hover:-translate-y-1 hover:scale-102 transition-all">
                  <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Saved Protocols</span>
                  <p className="font-display font-black text-2xl text-[#181126] dark:text-white">
                    {savedArticles.length} Guides
                  </p>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bookmarked for offline reading
                  </span>
                </div>
              </div>

              {/* Monthly Community Q&A Usage Meter */}
              {qaStats && (
                <div className="bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl p-5 pop-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#00F5D4] border-2 border-black flex items-center justify-center text-xl pop-shadow-sm shrink-0">
                      💬
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                          Community Q&A Unlock Usage
                        </h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFE600] text-black border border-black/30">
                          {qaStats.isPro ? "Unlimited" : `${qaStats.unlockedCount} / ${qaStats.limit}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5">
                        {qaStats.isPro
                          ? "You have unlimited access to unlock all community questions and answers."
                          : `Unlocked ${qaStats.unlockedCount} of ${qaStats.limit} questions this month.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/qa"
                      className="px-3.5 py-2 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border border-black pop-shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      Browse Q&A
                    </Link>
                    {!qaStats.isPro && (
                      <Link
                        href="/membership"
                        className="px-3.5 py-2 bg-[#FF4D6D] text-white font-display font-black text-xs rounded-xl border border-black pop-shadow-coral hover:scale-105 active:scale-95 transition-all"
                      >
                        Upgrade Tier ➔
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Pet Summary Cards */}
              <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-black text-lg">My Pets Quick View</h3>
                  <button
                    onClick={handleOpenAddPet}
                    className="text-xs font-bold bg-[#FFE600] px-3 py-1 rounded-xl border border-black pop-shadow flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pet</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((p) => (
                    <div
                      key={p.id}
                      className="border-2 border-black rounded-2xl p-4 bg-[#FFFDF5] dark:bg-slate-800 flex items-start gap-4 pop-shadow"
                    >
                      <img
                        src={p.photoUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80"}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-black shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-black text-base text-slate-950 dark:text-white truncate">
                          {p.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold capitalize">
                          {p.species} • {p.breed} • {p.age}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 mt-1 font-medium">
                          {p.healthNotes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PETS (CRUD) */}
          {activeTab === "pets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                    My Pet Profiles ({pets.length})
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Health records and medical notes are completely private to your account.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddPet}
                  className="px-4 py-2.5 bg-[#FF4D6D] text-white font-display font-black text-xs rounded-xl border-2 border-black pop-shadow-coral hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Pet</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="border-3 border-black rounded-3xl p-5 bg-[#FFFDF5] dark:bg-slate-800 pop-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-3">
                        <img
                          src={pet.photoUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80"}
                          alt={pet.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-black pop-shadow"
                        />
                        <div>
                          <span className="bg-[#FFE600] text-black font-display font-black text-[10px] px-2 py-0.5 rounded-full border border-black uppercase">
                            {pet.species}
                          </span>
                          <h3 className="font-display font-black text-xl text-slate-950 dark:text-white mt-1">
                            {pet.name}
                          </h3>
                          <p className="text-xs font-bold text-slate-500">
                            {pet.breed} • {pet.age}
                          </p>
                        </div>
                      </div>

                      {/* Private Health Notes */}
                      <div className="bg-white dark:bg-slate-900 border-2 border-black rounded-xl p-3 text-xs font-medium text-slate-700 dark:text-slate-300 space-y-1 mb-4">
                        <span className="font-display font-black text-[10px] uppercase text-purple-700 dark:text-purple-300 block">
                          🔒 Private Clinical Notes:
                        </span>
                        <p>{pet.healthNotes}</p>
                        {pet.allergies && pet.allergies.length > 0 && (
                          <p className="text-rose-600 dark:text-rose-400 font-bold text-[11px] pt-1">
                            Allergies: {pet.allergies.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditPet(pet)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-lg border border-black flex items-center gap-1 hover:bg-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-300 flex items-center gap-1 hover:bg-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SAVED BLOGS & COLLECTIONS */}
          {activeTab === "saved-blogs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                    Saved Articles & Protocols
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Quickly reference your bookmarked holistic health guides.
                  </p>
                </div>

                {/* Collection Filter Buttons */}
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-black text-xs font-bold">
                  {["All Saved", "Nutrition", "Rehab", "Senior Care"].map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setActiveCollection(folder)}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        activeCollection === folder ? "bg-[#FFE600] text-black font-black" : ""
                      }`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>
              </div>

              {savedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border-2 border-black rounded-2xl p-4 bg-[#FFFDF5] dark:bg-slate-800 flex gap-4 pop-shadow"
                    >
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-20 h-20 rounded-xl object-cover border border-black shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link href={`/blog/${article.slug}`}>
                          <h4 className="font-display font-black text-sm text-slate-950 dark:text-white hover:text-[#FF4D6D] line-clamp-2">
                            {article.title}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-slate-500 font-bold mt-1">
                          {article.topic} • {article.readingTime}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <Link
                            href={`/blog/${article.slug}`}
                            className="text-xs font-black text-[#7928CA] dark:text-[#FFE600] hover:underline"
                          >
                            Read Guide ➔
                          </Link>
                          <button
                            onClick={() => handleRemoveBookmark(article.id)}
                            className="text-[10px] font-bold text-rose-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FFF0F3] border-2 border-black rounded-2xl">
                  <p className="font-bold text-sm text-slate-700">No saved guides in this folder yet.</p>
                  <Link href="/blog" className="text-xs font-black text-[#FF4D6D] underline mt-2 inline-block">
                    Explore Learn Hub Articles
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ITEMS & PERKS */}
          {activeTab === "saved-items" && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                Saved Recipes & Partner Discount Codes
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Your member-exclusive voucher codes and saved meal recipes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEED_PARTNERS.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="border-2 border-black rounded-2xl p-4 bg-[#FFFDF5] dark:bg-slate-800 pop-shadow space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{p.logo}</span>
                      <span className="bg-[#FFE600] text-black font-mono font-black text-xs px-2 py-0.5 rounded border border-black">
                        {p.discountCode}
                      </span>
                    </div>
                    <h4 className="font-display font-black text-base text-slate-950 dark:text-white">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {p.discountPercent} — {p.exclusivePerk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MY PET WALL POSTS */}
          {activeTab === "my-photos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                    My Pet Wall Photos ({myPhotos.length})
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Photos you have uploaded to the community Pet Wall.
                  </p>
                </div>
                <Link
                  href="/pet-wall"
                  className="px-4 py-2 bg-[#06D6A0] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow"
                >
                  Upload New Photo
                </Link>
              </div>

              {myPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {myPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="border-2 border-black rounded-2xl p-2 bg-white dark:bg-slate-800 pop-shadow"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-black">
                        <img
                          src={photo.imageUrl}
                          alt="My Pet Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs font-bold">
                        <span>❤️ {photo.likesCount} Loves</span>
                        <button
                          onClick={() => handleDeleteMyPhoto(photo.id)}
                          className="text-rose-600 text-[11px] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 border-2 border-black rounded-2xl">
                  <p className="text-sm font-bold">You haven&apos;t posted photos to the Pet Wall yet.</p>
                  <Link href="/pet-wall" className="text-xs font-black text-[#FF4D6D] underline mt-2 inline-block">
                    Post your companion now!
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MEMBERSHIP & BILLING */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                Membership & Razorpay Billing
              </h2>

              <div className="bg-[#FFF0F3] dark:bg-slate-800 border-3 border-black rounded-2xl p-6 pop-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="bg-[#FF4D6D] text-white font-display font-black text-xs px-2.5 py-0.5 rounded-full border border-black uppercase">
                    Active Plan: {user.plan}
                  </span>
                  <h3 className="font-display font-black text-2xl text-slate-950 dark:text-white mt-2">
                    {user.plan === "free" ? "Free Explorer" : "PawsWell Premium"}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                    Renews automatically on {user.planRenewsAt || "2027-03-15"}.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/membership"
                    className="px-4 py-2.5 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow"
                  >
                    Change Plan
                  </Link>
                  <button
                    onClick={() => alert("Redirecting to Razorpay Customer Subscription Portal & Invoices...")}
                    className="px-4 py-2.5 bg-white dark:bg-slate-700 font-bold text-xs rounded-xl border-2 border-black pop-shadow"
                  >
                    Razorpay Portal ➔
                  </button>
                </div>
              </div>

              {/* Invoices List */}
              <div>
                <h3 className="font-display font-black text-lg mb-3">Billing Invoices</h3>
                <div className="border-2 border-black rounded-2xl overflow-hidden divide-y divide-black/10 text-xs font-semibold">
                  {[
                    { id: "inv_2026_03", date: "March 15, 2026", amount: "$12.00", status: "Paid" },
                    { id: "inv_2026_02", date: "February 15, 2026", amount: "$12.00", status: "Paid" },
                    { id: "inv_2026_01", date: "January 15, 2026", amount: "$12.00", status: "Paid" },
                  ].map((inv) => (
                    <div key={inv.id} className="p-3.5 flex items-center justify-between bg-white dark:bg-slate-800">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{inv.date}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{inv.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                          {inv.amount} • {inv.status}
                        </span>
                        <button
                          onClick={() => alert(`Downloading PDF invoice ${inv.id}...`)}
                          className="hover:text-[#FF4D6D]"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: NOTIFICATIONS & EMAIL */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                Email & Notification Preferences
              </h2>

              <div className="space-y-4 text-xs font-semibold">
                <label className="flex items-center justify-between p-4 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl cursor-pointer">
                  <div>
                    <h4 className="font-bold text-sm text-slate-950 dark:text-white">
                      The Sunday Dispatch Newsletter
                    </h4>
                    <p className="text-slate-500 font-medium">
                      Weekly vet-reviewed longevity recipe & exercise tips.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={user.newsletterSubscribed}
                    className="w-5 h-5 accent-[#FF4D6D]"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl cursor-pointer">
                  <div>
                    <h4 className="font-bold text-sm text-slate-950 dark:text-white">
                      Pet Wall Photo Loves & Likes
                    </h4>
                    <p className="text-slate-500 font-medium">
                      Email alerts when other guardians react to your pet&apos;s photo.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FF4D6D]" />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl cursor-pointer">
                  <div>
                    <h4 className="font-bold text-sm text-slate-950 dark:text-white">
                      Exclusive Partner Perk Alerts
                    </h4>
                    <p className="text-slate-500 font-medium">
                      Early flash codes for food, supplements, and orthopedic beds.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FF4D6D]" />
                </label>
              </div>

              <button
                onClick={() => alert("Notification settings saved!")}
                className="px-6 py-3 bg-[#FFE600] text-black font-display font-black text-xs rounded-xl border-2 border-black pop-shadow"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* TAB 8: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="font-display font-black text-2xl text-slate-950 dark:text-white">
                Account & Security Settings
              </h2>

              {saveNameSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {saveNameSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                    />
                    <button
                      type="button"
                      disabled={isSavingName || !displayNameInput.trim()}
                      onClick={async () => {
                        setIsSavingName(true);
                        setSaveNameSuccess(null);
                        try {
                          const res = await fetch("/api/auth/profile", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: displayNameInput.trim() }),
                          });
                          if (res.ok) {
                            await refreshAuthUser();
                            setSaveNameSuccess("Display name updated successfully!");
                            setTimeout(() => setSaveNameSuccess(null), 3000);
                          }
                        } finally {
                          setIsSavingName(false);
                        }
                      }}
                      className="px-4 py-2.5 bg-[#FFE600] text-black font-black text-xs rounded-xl border-2 border-black pop-shadow hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isSavingName ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full max-w-md px-4 py-2.5 text-sm font-semibold border-2 border-slate-300 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your email is verified via passwordless OTP.
                  </p>
                </div>

                {/* Active Sessions & Multi-Device Security */}
                <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                    Active Devices & Sessions
                  </h3>
                  <div className="p-4 bg-[#FFFDF5] dark:bg-slate-800 border-2 border-black rounded-2xl flex items-center justify-between max-w-lg pop-shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-black flex items-center justify-center text-lg">
                        💻
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          Current Browser / Device
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-600">
                          Active Session (Signed HTTP-Only Cookie)
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("This will log you out from all browsers and devices. Continue?")) {
                        await fetch("/api/auth/logout-all", { method: "POST" });
                        logout();
                      }
                    }}
                    className="px-4 py-2.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border-2 border-black pop-shadow hover:scale-102 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of All Devices</span>
                  </button>
                </div>

                <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                  <h3 className="font-display font-black text-base text-slate-900 dark:text-white mb-2">
                    Data Export (GDPR / CCPA)
                  </h3>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl border-2 border-black pop-shadow flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All Account Data (JSON)</span>
                  </button>
                </div>

                <div className="pt-6 border-t-2 border-rose-100 dark:border-rose-950">
                  <h3 className="font-display font-black text-base text-rose-600 mb-1">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Permanently delete your account, companion profiles, and subscriptions.
                  </p>
                  <button
                    onClick={async () => {
                      if (confirm("Are you sure? This action is permanent and will delete your account.")) {
                        await fetch("/api/auth/delete-account", { method: "POST" });
                        logout();
                      }
                    }}
                    className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border-2 border-rose-300 hover:bg-rose-100 cursor-pointer"
                  >
                    Delete Account & Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pet Add/Edit Modal */}
      {petModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPetModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black rounded-3xl p-6 pop-shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-display font-black text-xl text-slate-950 dark:text-white">
                {editingPetId ? "Edit Pet Profile" : "Add Companion Profile"}
              </h3>
              <button
                onClick={() => setPetModalOpen(false)}
                className="p-1 rounded-lg border border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePet} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Pet&apos;s Name
                </label>
                <input
                  type="text"
                  required
                  value={petFormName}
                  onChange={(e) => setPetFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Species
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["dog", "cat", "rabbit", "bird", "small-pet", "reptile"] as const).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setPetFormSpecies(s)}
                      className={`py-1.5 text-xs font-bold rounded-lg border border-black capitalize ${
                        petFormSpecies === s ? "bg-[#FFE600] text-black font-black" : "bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={petFormBreed}
                    onChange={(e) => setPetFormBreed(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={petFormAge}
                    onChange={(e) => setPetFormAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Private Health Notes & Diet
                </label>
                <textarea
                  rows={2}
                  value={petFormNotes}
                  onChange={(e) => setPetFormNotes(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold border-2 border-black rounded-xl bg-[#FFFDF5] dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl border border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF4D6D] text-white font-display font-black text-xs rounded-xl border-2 border-black pop-shadow-coral"
                >
                  Save Companion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading Guardian Dashboard...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
