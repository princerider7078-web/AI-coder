"use client";

/**
 * GrowPlants — Auth Context (Phase 5 minimal version)
 * Source: PRD §07 (Authentication), 01_project_specification.md §1 (7 React Contexts)
 *
 * Phase 5 scope (WITHOUT OTP per user instruction):
 *   - user: AuthUser | null (null = logged out)
 *   - isLoading: boolean (during auth operations)
 *   - login(identifier, password) — mock implementation (Phase 5+ wires to /api/auth/login)
 *   - register(data) — mock implementation (Phase 5+ wires to /api/auth/register)
 *   - logout() — clears user state
 *   - resetPassword(identifier) — mock implementation (Phase 5+ wires to /api/auth/forgot-password)
 *   - Persists user to localStorage so refresh keeps you logged in
 *
 * Phase 5+ (when backend is ready) will replace mock implementations with:
 *   - POST /api/auth/login → Firebase Auth + JWT cookie
 *   - POST /api/auth/register → bcrypt + Prisma + Firebase
 *   - POST /api/auth/logout → clear JWT cookie
 *   - POST /api/auth/forgot-password → send reset email
 *
 * NO OTP verification per user instruction.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

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
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (identifier: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "growplants-auth-user";

function loadFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveToStorage(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUser(loadFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveToStorage(user);
    }
  }, [user, isHydrated]);

  const login = useCallback(
    async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        // Phase 5 mock: simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock validation: accept any email/phone + password ≥ 8 chars
        if (password.length < 8) {
          return { success: false, error: "Invalid credentials" };
        }

        // Create mock user (Phase 5+ replaces with real API response)
        const isEmail = identifier.includes("@");
        const mockUser: AuthUser = {
          id: `user-${Date.now()}`,
          fullName: isEmail ? identifier.split("@")[0].replace(/[._]/g, " ") : "GrowPlants User",
          email: isEmail ? identifier : `${identifier}@growplants.in`,
          phone: isEmail ? "+919999999999" : identifier,
          role: "customer",
          status: "active",
          profileImageUrl: null,
          preferredLanguage: "en",
        };

        setUser(mockUser);
        return { success: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        // Phase 5 mock: simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create mock user
        const mockUser: AuthUser = {
          id: `user-${Date.now()}`,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          role: "customer",
          status: "active",
          profileImageUrl: null,
          preferredLanguage: "en",
        };

        setUser(mockUser);
        return { success: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const resetPassword = useCallback(
    async (identifier: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        // Phase 5 mock: simulate sending reset email
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Always return success (don't reveal if email exists)
        return { success: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
