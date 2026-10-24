"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  isVIP: false,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

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

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      router.push("/");
      router.refresh();
    }
  }, [router]);

  const isVIP = Boolean(user && user.isVIP);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isVIP,
        refreshUser: fetchCurrentUser,
        logout,
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
