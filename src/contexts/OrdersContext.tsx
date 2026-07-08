"use client";

/**
 * GrowPlants — Orders Context (Firestore real-time)
 *
 * Order status is fetched from Firestore in real-time via onSnapshot().
 * When an order is created, it's written to Firestore orders/{orderId}.
 * The onSnapshot listener picks up real-time changes — if admin updates
 * orderStatus in Firestore, the user's page updates instantly.
 *
 * No auto-progress timer — status comes ONLY from Firestore.
 * Falls back to localStorage for guests (not logged in).
 */
import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";
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
  return PREFIX + "-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Real-time Firestore listener — fetches orders AND their status from Firestore
  useEffect(() => {
    if (user && isFirebaseConfigured && firebaseDb) {
      const q = query(collection(firebaseDb, "orders"), where("userId", "==", user.id));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const firestoreOrders: Order[] = snap.docs.map((d) => {
            const data = d.data() as any;
            return {
              id: d.id,
              orderNumber: data.orderNumber ?? d.id,
              items: data.products ?? data.items ?? [],
              subtotal: data.subtotal ?? 0,
              shipping: data.shippingFee ?? data.shipping ?? 0,
              discount: data.discount ?? 0,
              tax: data.tax ?? 0,
              total: data.totalAmount ?? data.total ?? 0,
              address: data.addressDetails
                ? {
                    fullName: data.name ?? "",
                    phone: data.phone ?? "",
                    addressLine1: data.addressDetails.house ?? "",
                    city: data.addressDetails.city ?? "",
                    state: data.addressDetails.state ?? "",
                    pincode: data.addressDetails.pincode ?? "",
                  }
                : (data.address ?? { fullName: "", phone: "", addressLine1: "", city: "", state: "", pincode: "" }),
              paymentMethod: data.paymentMethod ?? "cod",
              paymentStatus: data.paymentStatus ?? "pending",
              // STATUS COMES FROM FIRESTORE — this is the key line
              orderStatus: data.orderStatus ?? "pending",
              notes: data.notes,
              createdAt: data.orderPlacedAt?.toDate?.()?.toISOString() ?? data.createdAt ?? new Date().toISOString(),
              statusHistory: data.statusHistory ?? [{ status: "pending" as const, date: new Date().toISOString(), note: "Order placed" }],
            } as Order;
          });

          // Merge Firestore orders with localStorage-only orders (orders not yet in Firestore)
          const localOrders = loadFromStorage();
          const firestoreIds = new Set(firestoreOrders.map((o) => o.id));
          const localOnly = localOrders.filter((o) => !firestoreIds.has(o.id));

          const merged = [...firestoreOrders, ...localOnly].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setOrders(merged);
          saveToStorage(merged);
          setHydrated(true);
        },
        (err) => {
          // Firestore permission denied or error — fall back to localStorage
          console.warn("[Orders] Firestore listener error, using localStorage:", err);
          setOrders(loadFromStorage());
          setHydrated(true);
        }
      );
      return () => unsub();
    } else {
      // Guest: load from localStorage only
      setOrders(loadFromStorage());
      setHydrated(true);
    }
  }, [user, firebaseDb]);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) saveToStorage(orders);
  }, [orders, hydrated]);

  const createOrder = useCallback(
    (data: Omit<Order, "id" | "orderNumber" | "orderStatus" | "paymentStatus" | "createdAt" | "statusHistory">): Order => {
      const now = new Date().toISOString();
      const paymentStatus: PaymentStatus = data.paymentMethod === "cod" ? "pending" : "paid";
      const order: Order = {
        ...data,
        id: "order-" + Date.now(),
        orderNumber: genOrderNumber(),
        orderStatus: "pending",
        paymentStatus,
        createdAt: now,
        statusHistory: [{ status: "pending", date: now, note: "Order placed" }],
      };

      // Add to state + localStorage immediately
      setOrders((prev) => {
        const newOrders = [order, ...prev];
        saveToStorage(newOrders);
        return newOrders;
      });

      // Write to Firestore — orders/{orderId} collection
      // Admin panel will read from here and update orderStatus
      // onSnapshot will pick up the change and update the UI in real-time
      if (user && isFirebaseConfigured && firebaseDb) {
        const orderDocRef = doc(firebaseDb, "orders", order.id);
        setDoc(orderDocRef, {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: user.id,
          orderPlacedAt: now,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: "pending", // Initial status — admin will update this
          name: order.address.fullName,
          phone: order.address.phone,
          addressDetails: {
            house: order.address.addressLine1,
            city: order.address.city,
            state: order.address.state,
            pincode: order.address.pincode,
          },
          products: order.items.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal: order.subtotal,
          shippingFee: order.shipping,
          totalAmount: order.total,
          statusHistory: order.statusHistory,
        }).catch((e) => {
          console.warn("[Orders] Firestore write failed (order saved locally):", e);
        });
      }

      return order;
    },
    [user, firebaseDb]
  );

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id) ?? null, [orders]);

  const cancelOrder = useCallback(
    (id: string, reason?: string) => {
      const now = new Date().toISOString();
      const cancelledStatus = { status: "cancelled" as const, date: now, note: reason ?? "Cancelled by customer" };

      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id || (o.orderStatus !== "pending" && o.orderStatus !== "confirmed")) return o;
          return { ...o, orderStatus: "cancelled", statusHistory: [...o.statusHistory, cancelledStatus] };
        })
      );

      // Update Firestore so admin sees the cancellation
      if (user && isFirebaseConfigured && firebaseDb) {
        const orderDocRef = doc(firebaseDb, "orders", id);
        updateDoc(orderDocRef, {
          orderStatus: "cancelled",
          statusHistory: [...(orders.find((o) => o.id === id)?.statusHistory ?? []), cancelledStatus],
        }).catch(() => {});
      }
    },
    [user, orders, firebaseDb]
  );

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
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
