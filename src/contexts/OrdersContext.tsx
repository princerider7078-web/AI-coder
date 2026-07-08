"use client";

/**
 * GrowPlants — Orders Context (Firestore real-time)
 *
 * Order statuses: pending → confirmed → processing → packed → shipped → out_for_delivery → delivered
 * Payment statuses: pending → paid → refunded (or failed)
 * Order number format: #ORD-{timestamp}
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

export type OrderStatus =
  | "pending" | "confirmed" | "processing" | "packed"
  | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partial_refund";

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
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

function loadFromStorage(): Order[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (_e) { return []; }
}
function saveToStorage(orders: Order[]) {
  if (typeof window !== "undefined") try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch (_e) {}
}
function genOrderNumber(): string {
  return "ORD-" + Date.now();
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (user && isFirebaseConfigured && firebaseDb) {
      const q = query(collection(firebaseDb, "orders"), where("userId", "==", user.id));
      const unsub = onSnapshot(q, (snap) => {
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
              ? { fullName: data.name ?? "", phone: data.phone ?? "", addressLine1: data.addressDetails.house ?? "", city: data.addressDetails.city ?? "", state: data.addressDetails.state ?? "", pincode: data.addressDetails.pincode ?? "" }
              : (data.address ?? { fullName: "", phone: "", addressLine1: "", city: "", state: "", pincode: "" }),
            paymentMethod: data.paymentMethod ?? "cod",
            paymentStatus: data.paymentStatus ?? "pending",
            orderStatus: data.orderStatus ?? "pending",
            notes: data.notes,
            createdAt: data.orderPlacedAt?.toDate?.()?.toISOString() ?? data.createdAt ?? new Date().toISOString(),
            statusHistory: data.statusHistory ?? [{ status: "pending" as const, date: new Date().toISOString(), note: "Order placed" }],
          } as Order;
        });
        const localOrders = loadFromStorage();
        const firestoreIds = new Set(firestoreOrders.map((o) => o.id));
        const localOnly = localOrders.filter((o) => !firestoreIds.has(o.id));
        const merged = [...firestoreOrders, ...localOnly].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(merged);
        saveToStorage(merged);
        setHydrated(true);
      }, (err) => {
        console.warn("[Orders] Firestore listener error:", err);
        setOrders(loadFromStorage());
        setHydrated(true);
      });
      return () => unsub();
    } else {
      setOrders(loadFromStorage());
      setHydrated(true);
    }
  }, [user, firebaseDb]);

  useEffect(() => { if (hydrated) saveToStorage(orders); }, [orders, hydrated]);

  const createOrder = useCallback((data: Omit<Order, "id" | "orderNumber" | "orderStatus" | "paymentStatus" | "createdAt" | "statusHistory">): Order => {
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

    setOrders((prev) => { const n = [order, ...prev]; saveToStorage(n); return n; });

    if (user && isFirebaseConfigured && firebaseDb) {
      setDoc(doc(firebaseDb, "orders", order.id), {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: user.id,
        orderPlacedAt: now,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: "pending",
        name: order.address.fullName,
        phone: order.address.phone,
        addressDetails: { house: order.address.addressLine1, city: order.address.city, state: order.address.state, pincode: order.address.pincode },
        products: order.items.map((i) => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal: order.subtotal,
        shippingFee: order.shipping,
        totalAmount: order.total,
        statusHistory: order.statusHistory,
      }).catch((e) => console.warn("[Orders] Firestore write failed:", e));
    }
    return order;
  }, [user, firebaseDb]);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id) ?? null, [orders]);

  const cancelOrder = useCallback((id: string, reason?: string) => {
    const now = new Date().toISOString();
    const cs = { status: "cancelled" as const, date: now, note: reason ?? "Cancelled by customer" };
    setOrders((prev) => prev.map((o) => (o.id === id && (o.orderStatus === "pending" || o.orderStatus === "confirmed")) ? { ...o, orderStatus: "cancelled", statusHistory: [...o.statusHistory, cs] } : o));
    if (user && isFirebaseConfigured && firebaseDb) {
      updateDoc(doc(firebaseDb, "orders", id), { orderStatus: "cancelled", statusHistory: [...(orders.find((o) => o.id === id)?.statusHistory ?? []), cs] }).catch(() => {});
    }
  }, [user, orders, firebaseDb]);

  return <OrdersContext.Provider value={{ orders, createOrder, getOrder, cancelOrder }}>{children}</OrdersContext.Provider>;
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
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  packed: "bg-cyan-100 text-cyan-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partial_refund: "Partial Refund",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
  partial_refund: "bg-orange-100 text-orange-700",
};

// Full tracking timeline (7 steps)
export const ORDER_TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "out_for_delivery", label: "Out For Delivery" },
  { status: "delivered", label: "Delivered" },
];
