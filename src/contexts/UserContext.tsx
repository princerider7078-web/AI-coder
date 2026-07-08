"use client";

/**
 * GrowPlants — User Context
 * Syncs with Firestore users/{uid} document in real-time.
 * Provides user profile data (firstName, lastName, phone, profileImage, preferences).
 *
 * Provider Hierarchy:
 *   RootLayout → AppProviders → FirebaseProviders → AuthProvider → UserProvider
 *     → CartProvider → WishlistProvider → AddressProvider → OrdersProvider → SettingsProvider
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  memberSince: string | null;
  preferences: {
    notifications: { email: boolean; sms: boolean; push: boolean };
    darkMode: boolean;
    language: "en" | "hi";
  };
}

interface UserContextValue {
  userData: UserData | null;
  isLoading: boolean;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserData["preferences"]>) => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

const DEFAULT_PREFERENCES = {
  notifications: { email: true, sms: false, push: true },
  darkMode: false,
  language: "en" as const,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, firebaseUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listener on Firestore users/{uid}
  useEffect(() => {
    if (!user || !isFirebaseConfigured || !firebaseDb) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(firebaseDb, "users", user.id);
    const unsub = onSnapshot(
      userDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as any;
          setUserData({
            uid: data.uid ?? user.id,
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? user.email,
            phone: data.phone ?? user.phone,
            profileImage: data.profileImage ?? null,
            memberSince: data.memberSince ?? null,
            preferences: data.preferences ?? DEFAULT_PREFERENCES,
          });
        } else {
          // Document doesn't exist — create it
          if (firebaseUser) {
            const [firstName, ...rest] = (user.fullName || firebaseUser.displayName || "").split(" ");
            const newUser: any = {
              uid: user.id,
              firstName: firstName || "",
              lastName: rest.join(" "),
              email: user.email,
              phone: user.phone,
              profileImage: null,
              memberSince: serverTimestamp(),
              preferences: DEFAULT_PREFERENCES,
              addresses: [],
              wishlist: [],
              cart: [],
            };
            setDoc(userDocRef, newUser).catch(() => {});
            setUserData({
              uid: user.id,
              firstName: firstName || "",
              lastName: rest.join(" "),
              email: user.email,
              phone: user.phone,
              profileImage: null,
              memberSince: new Date().toISOString(),
              preferences: DEFAULT_PREFERENCES,
            });
          }
        }
        setIsLoading(false);
      },
      (err) => {
        console.warn("[UserContext] Firestore listener error:", err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [user, firebaseUser, firebaseDb]);

  const updateProfile = async (data: Partial<UserData>) => {
    if (!user || !isFirebaseConfigured || !firebaseDb) return;
    const userDocRef = doc(firebaseDb, "users", user.id);
    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    await updateDoc(userDocRef, updateData);
  };

  const updatePreferences = async (prefs: Partial<UserData["preferences"]>) => {
    if (!user || !isFirebaseConfigured || !firebaseDb || !userData) return;
    const userDocRef = doc(firebaseDb, "users", user.id);
    const newPrefs = { ...userData.preferences, ...prefs };
    await updateDoc(userDocRef, { preferences: newPrefs });
  };

  return (
    <UserContext.Provider value={{ userData, isLoading, updateProfile, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
