/**
 * GrowPlants — Firebase Client SDK Initialization
 * Source: 04_environment_and_configs.md §1, 05_recreation_prompts.md Prompt 3
 *
 * Browser-side Firebase: Auth + Firestore + Storage.
 * Used for real-time cart/wishlist/orders sync and Firebase Auth.
 *
 * If env vars are missing (development without Firebase configured), the
 * module logs a warning and returns null. Callers must check the returned
 * value before use.
 */
import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;
let firebaseStorage: FirebaseStorage | null = null;

if (isConfigured) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
  firebaseStorage = getStorage(firebaseApp);
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "[GrowPlants] Firebase client env vars missing — Firebase features disabled. " +
      "Set NEXT_PUBLIC_FIREBASE_* variables in .env.local to enable."
  );
}

export {
  firebaseApp,
  firebaseAuth,
  firebaseDb,
  firebaseStorage,
  isConfigured as isFirebaseConfigured,
};
