"use client";

/**
 * GrowPlants — Settings Context (Firestore-backed)
 * Syncs with users/{uid}.preferences in real-time.
 */
import { createContext, useContext, type ReactNode } from "react";
import { useUser, type UserData } from "@/contexts/UserContext";

interface SettingsContextValue {
  preferences: UserData["preferences"] | null;
  updateSettings: (prefs: Partial<UserData["preferences"]>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { userData, updatePreferences } = useUser();

  return (
    <SettingsContext.Provider value={{
      preferences: userData?.preferences ?? null,
      updateSettings: updatePreferences,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
