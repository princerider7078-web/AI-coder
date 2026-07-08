"use client";

/**
 * GrowPlants — Cart Context (Firestore-synced)
 * Uses localStorage for guests, Firestore users/{uid}.cart for logged-in users.
 * Dual-sync: writes to both localStorage (instant) and Firestore (persistence).
 */
import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  CART_MAX_ITEMS, CART_MAX_QUANTITY_PER_ITEM, FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  inStock: boolean;
  addedAt: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  freeShippingProgress: { threshold: number; remaining: number; achieved: boolean };
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "growplants-cart";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch (_e) { return []; }
}
function saveToStorage(items: CartItem[]) {
  if (typeof window !== "undefined") try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_e) {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => { setItems(loadFromStorage()); setIsHydrated(true); }, []);
  useEffect(() => { if (isHydrated) saveToStorage(items); }, [items, isHydrated]);

  // Sync to Firestore when user is logged in
  const syncToFirestore = useCallback((cartItems: CartItem[]) => {
    if (!user || !isFirebaseConfigured || !firebaseDb) return;
    const userDocRef = doc(firebaseDb, "users", user.id);
    updateDoc(userDocRef, { cart: cartItems }).catch(() => {});
  }, [user]);

  const addItem = useCallback((item: Omit<CartItem, "id" | "addedAt">) => {
    setItems((prev) => {
      const lineId = `${item.productId}${item.variantId ? `-${item.variantId}` : ""}`;
      const existing = prev.find((i) => i.id === lineId);
      let newItems: CartItem[];
      if (existing) {
        const newQty = Math.min(CART_MAX_QUANTITY_PER_ITEM, existing.quantity + item.quantity);
        newItems = prev.map((i) => i.id === lineId ? { ...i, quantity: newQty } : i);
      } else {
        if (prev.length >= CART_MAX_ITEMS) return prev;
        newItems = [...prev, { ...item, id: lineId, addedAt: new Date().toISOString() }];
      }
      syncToFirestore(newItems);
      return newItems;
    });
  }, [syncToFirestore]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id);
      syncToFirestore(newItems);
      return newItems;
    });
  }, [syncToFirestore]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const newItems = quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => i.id === id ? { ...i, quantity: Math.min(CART_MAX_QUANTITY_PER_ITEM, quantity) } : i);
      syncToFirestore(newItems);
      return newItems;
    });
  }, [syncToFirestore]);

  const clearCart = useCallback(() => {
    setItems([]);
    syncToFirestore([]);
  }, [syncToFirestore]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const freeShippingProgress = {
    threshold: FREE_SHIPPING_THRESHOLD,
    remaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    achieved: subtotal >= FREE_SHIPPING_THRESHOLD,
  };

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, isDrawerOpen, freeShippingProgress, addItem, removeItem, updateQuantity, clearCart, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
