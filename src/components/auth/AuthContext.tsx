"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, ReactNode } from "react";
import { User } from "@/data/auth";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const storageKey = "gift_seller_user";
const updateEvent = "gifty-demo-auth-changed";

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(updateEvent, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(updateEvent, listener); };
}
function getSnapshot() {
  if (process.env.NODE_ENV === "production") return null;
  try { return localStorage.getItem(storageKey); } catch { return null; }
}
const getServerSnapshot = () => undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  // Existing demonstration identity only; not a security/session boundary.
  const storedUser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoading = storedUser === undefined;
  const user = useMemo<User | null>(() => {
    if (!storedUser) return null;
    try { return JSON.parse(storedUser) as User; } catch { return null; }
  }, [storedUser]);

  const login = (userData: User) => {
    if (process.env.NODE_ENV === "production") return;
    localStorage.setItem(storageKey, JSON.stringify(userData));
    window.dispatchEvent(new Event(updateEvent));
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(updateEvent));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
