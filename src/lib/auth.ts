/**
 * GrowPlants — JWT & Session Helpers
 * Source: PRD §07 (Authentication), §25 (Security), 04_environment_and_configs.md
 *
 * Server-only module. Signs/verifies JWTs and serializes HTTP-only cookies.
 * Never import this from a client component — it uses Node-only APIs.
 */
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "@/lib/constants";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-secret-change-me";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "dev-only-refresh-secret-change-me";

export interface GrowPlantsJwtPayload extends JwtPayload {
  uid: string;
  email: string;
  role: "customer" | "admin" | "provider";
  status: "active" | "suspended" | "deleted";
}

/* ---------- Sign ---------- */

export function signAccessToken(payload: Omit<GrowPlantsJwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: Omit<GrowPlantsJwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/* ---------- Verify ---------- */

export function verifyAccessToken(token: string): GrowPlantsJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as GrowPlantsJwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): GrowPlantsJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as GrowPlantsJwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/* ---------- Cookie Serialization ---------- */

const ACCESS_COOKIE_NAME = "gp_access";
const REFRESH_COOKIE_NAME = "gp_refresh";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export async function setSessionCookies(params: {
  access: string;
  refresh: string;
}) {
  const store = await cookies();
  store.set(ACCESS_COOKIE_NAME, params.access, {
    ...baseCookieOptions,
    maxAge: 15 * 60, // 15 min
  });
  store.set(REFRESH_COOKIE_NAME, params.refresh, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE_NAME);
  store.delete(REFRESH_COOKIE_NAME);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE_NAME)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE_NAME)?.value;
}

/* ---------- Auth Header Helpers (for API routes) ---------- */

export function extractBearerToken(
  authHeader: string | null | undefined
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

/**
 * Get the current authenticated user from the access-token cookie.
 * Returns null if unauthenticated or token invalid.
 */
export async function getCurrentUser(): Promise<GrowPlantsJwtPayload | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return verifyAccessToken(token);
}

/**
 * Require authentication — throws 401-shaped error if no valid session.
 * Use in protected API routes.
 */
export async function requireAuth(): Promise<GrowPlantsJwtPayload> {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error("Unauthorized") as Error & { status: number };
    error.status = 401;
    throw error;
  }
  if (user.status !== "active") {
    const error = new Error("Account suspended") as Error & { status: number };
    error.status = 403;
    throw error;
  }
  return user;
}

/**
 * Require a specific role. Use in admin/provider-only routes.
 */
export async function requireRole(
  role: "admin" | "provider" | "customer"
): Promise<GrowPlantsJwtPayload> {
  const user = await requireAuth();
  if (user.role !== role) {
    const error = new Error("Forbidden") as Error & { status: number };
    error.status = 403;
    throw error;
  }
  return user;
}
