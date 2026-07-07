/**
 * GrowPlants — Firebase Auth Wrappers
 * Source: 05_recreation_prompts.md Prompt 3
 *
 * Helper functions for email/password auth, sign-out, password reset.
 * All functions gracefully return null/false if Firebase is not configured.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured || !firebaseAuth) return null;
  const cred = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured || !firebaseAuth) return null;
  const cred = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  return cred.user;
}

export async function signOutUser(): Promise<void> {
  if (!isFirebaseConfigured || !firebaseAuth) return;
  await signOut(firebaseAuth);
}

export async function resetUserPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured || !firebaseAuth) return;
  await sendPasswordResetEmail(firebaseAuth, email);
}

export async function refreshProfile(
  user: FirebaseUser
): Promise<FirebaseUser> {
  await user.reload();
  return user;
}
