/**
 * GrowPlants — Firebase Admin SDK (Server-only)
 * Source: 04_environment_and_configs.md §1, 05_recreation_prompts.md Prompt 3
 *
 * Used for server-side ID token verification and privileged operations.
 *
 * CRITICAL: This module MUST only be imported from server components,
 * API routes, or server actions. Never import from client components.
 */
import type { App as FirebaseAdminApp } from "firebase-admin/app";
import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth, type Auth as AdminAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

const isConfigured = Boolean(projectId && clientEmail && privateKeyRaw);

let adminApp: FirebaseAdminApp | null = null;
let adminAuth: AdminAuth | null = null;

if (isConfigured) {
  adminApp =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: (privateKeyRaw ?? "").replace(/\\n/g, "\n"),
          }),
        });
  adminAuth = getAuth(adminApp);
} else if (process.env.NODE_ENV === "development") {
  // Fall back to Application Default Credentials if available (local emulators)
  try {
    adminApp = getApps().length > 0 ? getApps()[0] : initializeApp({ credential: applicationDefault() });
    adminAuth = getAuth(adminApp);
  } catch {
    console.warn(
      "[GrowPlants] Firebase Admin SDK not configured — server-side token verification disabled. " +
        "Set FIREBASE_ADMIN_* env vars to enable."
    );
  }
}

export { adminApp, adminAuth, isConfigured as isAdminConfigured };

/**
 * Verify a Firebase ID token. Returns the decoded token or null.
 * Use in API routes to authorize requests using Firebase-issued tokens.
 */
export async function verifyIdToken(
  token: string
): Promise<{ uid: string; email?: string; phone?: string } | null> {
  if (!adminAuth) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      phone: decoded.phone_number,
    };
  } catch {
    return null;
  }
}
