/**
 * GrowPlants — Firestore CRUD Helpers
 * Source: 03_database_design.md §2, 05_recreation_prompts.md Prompt 3
 *
 * Manages the `users` collection documents that hold real-time client state:
 * addresses, cart, wishlist, preferences. Also the `orders` collection for
 * client-side order writes.
 *
 * Firestore schema reference (03_database_design.md):
 *   users/{uid} → { uid, firstName, lastName, email, phone, profileImage,
 *                   memberSince, preferences, addresses[], wishlist[], cart[] }
 *   orders/{orderId} → { orderId, userId, orderPlacedAt, paymentMethod,
 *                        paymentStatus, name, phone, addressDetails,
 *                        products[], subtotal, shippingFee, totalAmount,
 *                        orderStatus }
 */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import type {
  FirestoreUser,
  FirestoreAddress,
  FirestoreCartItem,
  FirestoreWishlistItem,
  FirestoreOrder,
} from "@/types/firebase";

const USERS_COLLECTION = "users";
const ORDERS_COLLECTION = "orders";

/* ---------- User Document ---------- */

export async function getFirestoreUser(
  uid: string
): Promise<FirestoreUser | null> {
  if (!isFirebaseConfigured || !firebaseDb) return null;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as FirestoreUser;
}

export async function createFirestoreUser(
  uid: string,
  data: Partial<FirestoreUser>
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  await setDoc(ref, {
    uid,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    profileImage: data.profileImage ?? null,
    memberSince: data.memberSince ?? serverTimestamp(),
    preferences: data.preferences ?? {
      notifications: { email: true, sms: false, push: true },
      darkMode: false,
      language: "en",
    },
    addresses: data.addresses ?? [],
    wishlist: data.wishlist ?? [],
    cart: data.cart ?? [],
  } satisfies FirestoreUser);
}

export async function updateFirestoreUser(
  uid: string,
  patch: Partial<FirestoreUser>
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  await updateDoc(ref, patch as Record<string, unknown>);
}

export async function watchFirestoreUser(
  uid: string,
  callback: (user: FirestoreUser | null) => void
): Promise<Unsubscribe> {
  if (!isFirebaseConfigured || !firebaseDb) {
    callback(null);
    return () => {};
  }
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  return onSnapshot(
    ref,
    (snap) => callback(snap.exists() ? (snap.data() as FirestoreUser) : null),
    () => callback(null)
  );
}

/* ---------- Addresses ---------- */

export async function addFirestoreAddress(
  uid: string,
  address: FirestoreAddress
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  const user = await getFirestoreUser(uid);
  if (!user) return;
  const addresses = [...(user.addresses ?? []), address];
  await updateDoc(ref, { addresses });
}

export async function updateFirestoreAddress(
  uid: string,
  addressId: string,
  patch: Partial<FirestoreAddress>
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  const user = await getFirestoreUser(uid);
  if (!user) return;
  const addresses = (user.addresses ?? []).map((a) =>
    a.id === addressId ? { ...a, ...patch } : a
  );
  await updateDoc(ref, { addresses });
}

export async function removeFirestoreAddress(
  uid: string,
  addressId: string
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  const user = await getFirestoreUser(uid);
  if (!user) return;
  const addresses = (user.addresses ?? []).filter((a) => a.id !== addressId);
  await updateDoc(ref, { addresses });
}

/* ---------- Cart ---------- */

export async function setFirestoreCart(
  uid: string,
  cart: FirestoreCartItem[]
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  await updateDoc(ref, { cart });
}

/* ---------- Wishlist ---------- */

export async function setFirestoreWishlist(
  uid: string,
  wishlist: FirestoreWishlistItem[]
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, USERS_COLLECTION, uid);
  await updateDoc(ref, { wishlist });
}

/* ---------- Orders (real-time listener) ---------- */

export async function createFirestoreOrder(
  order: FirestoreOrder
): Promise<void> {
  if (!isFirebaseConfigured || !firebaseDb) return;
  const ref = doc(firebaseDb, ORDERS_COLLECTION, order.orderId);
  await setDoc(ref, order);
}

export async function getFirestoreOrders(
  uid: string
): Promise<FirestoreOrder[]> {
  if (!isFirebaseConfigured || !firebaseDb) return [];
  const q = query(
    collection(firebaseDb, ORDERS_COLLECTION),
    where("userId", "==", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FirestoreOrder);
}

export function watchFirestoreOrders(
  uid: string,
  callback: (orders: FirestoreOrder[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !firebaseDb) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(firebaseDb, ORDERS_COLLECTION),
    where("userId", "==", uid)
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => d.data() as FirestoreOrder)),
    () => callback([])
  );
}
