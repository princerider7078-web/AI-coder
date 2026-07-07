"use client";

/**
 * GrowPlants — Cart Context (Phase 3 minimal version)
 * Source: 01_project_specification.md §1 (7 React Contexts), PRD §10.1 (Cart Rules)
 *
 * This is a MINIMAL cart state for Phase 3 (Layout System) so the CartDrawer
 * is functional. Phase 9 (Cart & Drawer) will extend this with:
 *   - Firestore real-time sync (when user is logged in)
 *   - Coupon application
 *   - Stock validation on add
 *   - Variant support
 *
 * Phase 3 scope:
 *   - items: CartItem[] persisted to localStorage
 *   - addItem, removeItem, updateQuantity, clearCart
 *   - subtotal, itemCount (derived)
 *   - isDrawerOpen, openDrawer, closeDrawer, toggleDrawer
 *   - Free shipping progress (derived from subtotal vs ₹499 threshold)
 *
 * Rules enforced (PRD §10.1):
 *   - Max 10 units per product (CART_MAX_QUANTITY_PER_ITEM)
 *   - Max 20 unique items (CART_MAX_ITEMS)
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import {
  CART_MAX_ITEMS,
  CART_MAX_QUANTITY_PER_ITEM,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";

export interface CartItem {
  id: string; // unique line item id (productId + variantId)
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
  freeShippingProgress: {
    threshold: number;
    remaining: number;
    achieved: boolean;
  };
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
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or storage disabled — fail silently
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    setItems(loadFromStorage());
    setIsHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveToStorage(items);
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "id" | "addedAt">) => {
      setItems((prev) => {
        const lineId = `${item.productId}${item.variantId ? `-${item.variantId}` : ""}`;
        const existing = prev.find((i) => i.id === lineId);

        if (existing) {
          // Update quantity (capped at CART_MAX_QUANTITY_PER_ITEM)
          const newQty = Math.min(
            CART_MAX_QUANTITY_PER_ITEM,
            existing.quantity + item.quantity
          );
          return prev.map((i) =>
            i.id === lineId ? { ...i, quantity: newQty } : i
          );
        }

        // Add new item (capped at CART_MAX_ITEMS unique items)
        if (prev.length >= CART_MAX_ITEMS) {
          return prev; // silently ignore — Phase 9 will surface a toast
        }

        return [
          ...prev,
          {
            ...item,
            id: lineId,
            addedAt: new Date().toISOString(),
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(CART_MAX_QUANTITY_PER_ITEM, quantity) }
              : i
          )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const freeShippingProgress = useMemo(
    () => ({
      threshold: FREE_SHIPPING_THRESHOLD,
      remaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      achieved: subtotal >= FREE_SHIPPING_THRESHOLD,
    }),
    [subtotal]
  );

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    isDrawerOpen,
    freeShippingProgress,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
