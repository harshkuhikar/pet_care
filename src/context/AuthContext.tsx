"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: "user" | "admin";
  plan: "free" | "premium" | "family" | "pro";
  isVIP: boolean;
  planExpiresAt?: string;
  emailVerified: boolean;
  createdAt: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  isVIP: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;

  // Modal Gate & Action Resume
  isLoginModalOpen: boolean;
  loginModalMode: "login" | "signup";
  loginModalMessage: string | null;
  openLoginModal: (mode?: "login" | "signup", pendingAction?: () => void | Promise<void>, message?: string) => void;
  closeLoginModal: () => void;
  requireAuth: (action: () => void | Promise<void>, reasonMessage?: string, preferredMode?: "login" | "signup") => boolean;
  executePendingAction: () => Promise<void>;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  isVIP: false,
  refreshUser: async () => {},
  logout: async () => {},
  isLoginModalOpen: false,
  loginModalMode: "signup",
  loginModalMessage: null,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  requireAuth: () => false,
  executePendingAction: async () => {},
  toastMessage: null,
  showToast: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<"login" | "signup">("signup");
  const [loginModalMessage, setLoginModalMessage] = useState<string | null>(null);
  const pendingActionRef = useRef<(() => void | Promise<void>) | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setStatus("authenticated");
          return;
        }
      }
      setUser(null);
      setStatus("unauthenticated");
    } catch (err) {
      console.warn("Failed to fetch session:", err);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const openLoginModal = useCallback(
    (mode: "login" | "signup" = "signup", pendingAction?: () => void | Promise<void>, message?: string) => {
      setLoginModalMode(mode);
      if (message) setLoginModalMessage(message);
      else setLoginModalMessage(null);
      if (pendingAction) {
        pendingActionRef.current = pendingAction;
      }
      setIsLoginModalOpen(true);
    },
    []
  );

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginModalMessage(null);
  }, []);

  const executePendingAction = useCallback(async () => {
    if (pendingActionRef.current) {
      try {
        await pendingActionRef.current();
        showToast("Action completed successfully!");
      } catch (err) {
        console.error("Error executing pending action:", err);
      } finally {
        pendingActionRef.current = null;
      }
    }
  }, [showToast]);

  const requireAuth = useCallback(
    (action: () => void | Promise<void>, reasonMessage?: string, preferredMode: "login" | "signup" = "signup"): boolean => {
      if (status === "authenticated" && user) {
        action();
        return true;
      }
      openLoginModal(
        preferredMode,
        action,
        reasonMessage || "Please sign in or create a free account to complete this action."
      );
      return false;
    },
    [status, user, openLoginModal]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      showToast("You have been signed out.");
      router.push("/");
      router.refresh();
    }
  }, [router, showToast]);

  const isVIP = Boolean(user && user.isVIP);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isVIP,
        refreshUser: fetchCurrentUser,
        logout,
        isLoginModalOpen,
        loginModalMode,
        loginModalMessage,
        openLoginModal,
        closeLoginModal,
        requireAuth,
        executePendingAction,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
