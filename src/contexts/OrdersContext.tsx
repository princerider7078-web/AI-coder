"use client";

/**
 * GrowPlants — Orders Context (Firestore real-time + localStorage fallback)
 * Uses onSnapshot() on orders collection where userId == uid for real-time updates.
 * Falls back to localStorage when Firebase is not configured or user is not logged in.
 */
import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OrderItem {
  productId: string; name: string; slug: string; price: number; image: string; quantity: number; variantId?: string | null;
}
export interface OrderAddress {
  fullName: string; phone: string; addressLine1: string; addressLine2?: string; landmark?: string; city: string; state: string; pincode: string;
}
export type OrderStatus = "pending" | "confirmed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string; orderNumber: string; items: OrderItem[];
  subtotal: number; shipping: number; discount: number; tax: number; total: number;
  address: OrderAddress; paymentMethod: PaymentMethod; paymentStatus: PaymentStatus;
  orderStatus: OrderStatus; notes?: string; createdAt: string;
  statusHistory: { status: OrderStatus; date: string; note?: string }[];
}

interface OrdersContextValue {
  orders: Order[];
  createOrder: (data: Omit<Order, "id" | "orderNumber" | "orderStatus" | "paymentStatus" | "createdAt" | "statusHistory">) => Order;
  getOrder: (id: string) => Order | null;
  cancelOrder: (id: string, reason?: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = "growplants-orders";
const PREFIX = "GP";

function loadFromStorage(): Order[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (_e) { return []; }
}
function saveToStorage(orders: Order[]) {
  if (typeof window !== "undefined") try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch (_e) {}
}
function genOrderNumber(): string {
  return `${PREFIX}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Real-time Firestore listener when logged in
  useEffect(() => {
    if (user && isFirebaseConfigured && firebaseDb) {
      const q = query(collection(firebaseDb, "orders"), where("userId", "==", user.id));
      const unsub = onSnapshot(q,
        (snap) => {
          const firestoreOrders = snap.docs.map((d) => {
            const data = d.data() as any;
            return {
              id: d.id,
              orderNumber: data.orderNumber ?? data.id,
              items: data.products ?? data.items ?? [],
              subtotal: data.subtotal ?? 0,
              shipping: data.shippingFee ?? data.shipping ?? 0,
              discount: data.discount ?? 0,
              tax: data.tax ?? 0,
              total: data.totalAmount ?? data.total ?? 0,
              address: data.addressDetails ? {
                fullName: data.name ?? "", phone: data.phone ?? "",
                addressLine1: data.addressDetails.house ?? "", city: data.addressDetails.city ?? "",
                state: data.addressDetails.state ?? "", pincode: data.addressDetails.pincode ?? "",
              } : (data.address ?? { fullName: "", phone: "", addressLine1: "", city: "", state: "", pincode: "" }),
              paymentMethod: data.paymentMethod ?? "cod",
              paymentStatus: data.paymentStatus ?? "pending",
              orderStatus: data.orderStatus ?? "pending",
              notes: data.notes,
              createdAt: data.orderPlacedAt?.toDate?.()?.toISOString() ?? data.createdAt ?? new Date().toISOString(),
              statusHistory: data.statusHistory ?? [{ status: "pending" as const, date: new Date().toISOString(), note: "Order placed" }],
            } as Order;
          });
          // Merge with localStorage orders (localStorage orders that aren't in Firestore yet)
          const localOrders = loadFromStorage();
          const firestoreIds = new Set(firestoreOrders.map((o) => o.id));
          const localOnly = localOrders.filter((o) => !firestoreIds.has(o.id));
          const merged = [...firestoreOrders, ...localOnly].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(merged);
          saveToStorage(merged);
          setHydrated(true);
        },
        () => { setOrders(loadFromStorage()); setHydrated(true); }
      );
      return () => unsub();
    } else {
      // Guest: load from localStorage only
      setOrders(loadFromStorage());
      setHydrated(true);
    }
  }, [user, firebaseDb]);

  // Persist to localStorage
  useEffect(() => { if (hydrated) saveToStorage(orders); }, [orders, hydrated]);

  const createOrder = useCallback((data: Omit<Order, "id" | "orderNumber" | "orderStatus" | "paymentStatus" | "createdAt" | "statusHistory">): Order => {
    const now = new Date().toISOString();
    const paymentStatus: PaymentStatus = data.paymentMethod === "cod" ? "pending" : "paid";
    const order: Order = {
      ...data,
      id: `order-${Date.now()}`,
      orderNumber: genOrderNumber(),
      orderStatus: "pending",
      paymentStatus,
      createdAt: now,
      statusHistory: [{ status: "pending", date: now, note: "Order placed" }],
    };

    // Add to state + localStorage
    setOrders((prev) => {
      const newOrders = [order, ...prev];
      saveToStorage(newOrders);
      return newOrders;
    });

    // Dual-write to Firestore (top-level orders collection + user document)
    if (user && isFirebaseConfigured && firebaseDb) {
      // Top-level orders collection (admin reads from here)
      const orderDocRef = doc(firebaseDb, "orders", order.id);
      setDoc(orderDocRef, {
        orderId: order.id,
        userId: user.id,
        orderPlacedAt: now,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        name: order.address.fullName,
        phone: order.address.phone,
        addressDetails: {
          house: order.address.addressLine1,
          city: order.address.city,
          state: order.address.state,
          pincode: order.address.pincode,
        },
        products: order.items,
        subtotal: order.subtotal,
        shippingFee: order.shipping,
        totalAmount: order.total,
      }).catch(() => {});
    }

    return order;
  }, [user, firebaseDb]);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id) ?? null, [orders]);

  const cancelOrder = useCallback((id: string, reason?: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id || (o.orderStatus !== "pending" && o.orderStatus !== "confirmed")) return o;
      const now = new Date().toISOString();
      return { ...o, orderStatus: "cancelled", statusHistory: [...o.statusHistory, { status: "cancelled", date: now, note: reason ?? "Cancelled by customer" }] };
    }));
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, createOrder, getOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700", out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700",
};
