"use client";

/**
 * GrowPlants — Orders Context
 * Manages order state with localStorage persistence.
 * Creates orders from cart, tracks order status, supports cancellation.
 */
import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string | null;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | "pending" | "confirmed" | "processing"
  | "out_for_delivery" | "delivered" | "cancelled";

export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed";

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
  createOrder: (data: {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    tax: number;
    total: number;
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order;
  getOrder: (id: string) => Order | null;
  cancelOrder: (id: string, reason?: string) => void;
  clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = "growplants-orders";
const ORDER_PREFIX = "GP";

function loadFromStorage(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToStorage(orders: Order[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch {}
}

function genOrderNumber(): string {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${ORDER_PREFIX}-${ts}${rand}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setOrders(loadFromStorage()); setHydrated(true); }, []);
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
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id) ?? null, [orders]);

  const cancelOrder = useCallback((id: string, reason?: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      if (o.orderStatus !== "pending" && o.orderStatus !== "confirmed") return o;
      const now = new Date().toISOString();
      return {
        ...o,
        orderStatus: "cancelled",
        statusHistory: [...o.statusHistory, { status: "cancelled", date: now, note: reason ?? "Cancelled by customer" }],
      };
    }));
  }, []);

  const clearOrders = useCallback(() => setOrders([]), []);

  return (
    <OrdersContext.Provider value={{ orders, createOrder, getOrder, cancelOrder, clearOrders }}>
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
