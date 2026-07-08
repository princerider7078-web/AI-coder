"use client";

/**
 * GrowPlants — Auth Context (REAL FIREBASE AUTH)
 * Uses Firebase Auth from user's Firebase project (my-login-demo-88fb2).
 * Also syncs user data to Firestore for persistence.
 */
import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, updateProfile, type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "customer" | "admin" | "provider";
  status: "active" | "suspended" | "deleted";
  profileImageUrl: string | null;
  preferredLanguage: "en" | "hi";
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "growplants-auth-user";

function loadFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveToStorage(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try { if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); else localStorage.removeItem(STORAGE_KEY); } catch {}
}

/** Convert Firebase user to AuthUser, merging Firestore data if available */
async function firebaseToAuthUser(fbUser: FirebaseUser): Promise<AuthUser> {
  let fullName = fbUser.displayName || "";
  let phone = fbUser.phoneNumber || "";
  let profileImageUrl = fbUser.photoURL;
  let preferredLanguage: "en" | "hi" = "en";

  // Try to get additional data from Firestore
  if (isFirebaseConfigured && firebaseDb) {
    try {
      const ref = doc(firebaseDb, "users", fbUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as any;
        fullName = data.firstName ? `${data.firstName} ${data.lastName || ""}`.trim() : fullName;
        phone = data.phone || phone;
        profileImageUrl = data.profileImage || profileImageUrl;
        preferredLanguage = data.preferences?.language || "en";
      }
    } catch (e) {
      // Firestore read failed — use Firebase Auth data only
      console.warn("[Auth] Firestore user data fetch failed:", e);
    }
  }

  return {
    id: fbUser.uid,
    fullName: fullName || fbUser.email?.split("@")[0] || "User",
    email: fbUser.email || "",
    phone,
    role: "customer",
    status: "active",
    profileImageUrl,
    preferredLanguage,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      // Firebase not configured — fall back to localStorage
      const stored = loadFromStorage();
      if (stored) setUser(stored);
      setIsLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const authUser = await firebaseToAuthUser(fbUser);
        setUser(authUser);
        saveToStorage(authUser);
      } else {
        setFirebaseUser(null);
        setUser(null);
        saveToStorage(null);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        // Real Firebase Auth
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const authUser = await firebaseToAuthUser(cred.user);
        setUser(authUser);
        saveToStorage(authUser);
        return { success: true };
      } else {
        // Fallback: mock login (no Firebase configured)
        await new Promise((r) => setTimeout(r, 800));
        if (password.length < 8) return { success: false, error: "Invalid credentials" };
        const isEmail = email.includes("@");
        const mockUser: AuthUser = {
          id: `user-${Date.now()}`,
          fullName: isEmail ? email.split("@")[0].replace(/[._]/g, " ") : "GrowPlants User",
          email: isEmail ? email : `${email}@growplants.in`,
          phone: isEmail ? "+919999999999" : email,
          role: "customer", status: "active", profileImageUrl: null, preferredLanguage: "en",
        };
        setUser(mockUser); saveToStorage(mockUser);
        return { success: true };
      }
    } catch (err: any) {
      let msg = "Login failed. Please try again.";
      if (err?.code === "auth/invalid-email") msg = "Invalid email address";
      else if (err?.code === "auth/user-not-found") msg = "No account found with this email";
      else if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") msg = "Invalid email or password";
      else if (err?.code === "auth/too-many-requests") msg = "Too many attempts. Try again later";
      else if (err?.code === "auth/network-request-failed") msg = "Network error. Check your connection";
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { fullName: string; email: string; phone: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        // Real Firebase Auth
        const cred = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
        await updateProfile(cred.user, { displayName: data.fullName });

        // Save additional user data to Firestore
        if (firebaseDb) {
          const [firstName, ...rest] = data.fullName.split(" ");
          await setDoc(doc(firebaseDb, "users", cred.user.uid), {
            uid: cred.user.uid,
            firstName,
            lastName: rest.join(" "),
            email: data.email,
            phone: data.phone,
            profileImage: null,
            memberSince: new Date().toISOString(),
            preferences: { notifications: { email: true, sms: false, push: true }, darkMode: false, language: "en" },
            addresses: [],
            wishlist: [],
            cart: [],
          });
        }

        const authUser: AuthUser = {
          id: cred.user.uid,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          role: "customer", status: "active", profileImageUrl: null, preferredLanguage: "en",
        };
        setUser(authUser);
        saveToStorage(authUser);
        return { success: true };
      } else {
        // Fallback: mock register
        await new Promise((r) => setTimeout(r, 1000));
        const mockUser: AuthUser = {
          id: `user-${Date.now()}`, fullName: data.fullName, email: data.email, phone: data.phone,
          role: "customer", status: "active", profileImageUrl: null, preferredLanguage: "en",
        };
        setUser(mockUser); saveToStorage(mockUser);
        return { success: true };
      }
    } catch (err: any) {
      let msg = "Registration failed. Please try again.";
      if (err?.code === "auth/email-already-in-use") msg = "This email is already registered. Try logging in.";
      else if (err?.code === "auth/invalid-email") msg = "Invalid email address";
      else if (err?.code === "auth/weak-password") msg = "Password is too weak. Use at least 6 characters.";
      else if (err?.code === "auth/network-request-failed") msg = "Network error. Check your connection";
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth);
    }
    setUser(null);
    saveToStorage(null);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        await sendPasswordResetEmail(firebaseAuth, email);
        return { success: true };
      }
      await new Promise((r) => setTimeout(r, 800));
      return { success: true };
    } catch (err: any) {
      let msg = "Could not send reset email.";
      if (err?.code === "auth/user-not-found") msg = "No account found with this email";
      else if (err?.code === "auth/invalid-email") msg = "Invalid email address";
      return { success: false, error: msg };
    }
  }, []);

  const value: AuthContextValue = {
    user, isLoading, isAuthenticated: !!user, firebaseUser,
    login, register, logout, resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
