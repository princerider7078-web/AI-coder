"use client";

/**
 * GrowPlants — Orders Context (Dual-DB, Firestore real-time)
 *
 * Architecture (matches old project):
 *   1. Order creation: POST /api/orders (Prisma transaction) →
 *      client-side buildOrderObject() + addOrderToUserDocument() (Firestore dual write)
 *   2. Order list real-time: onUserOrdersSnapshot(uid) — query(collection('orders'), where('userId','==',uid))
 *   3. Order detail real-time: onUserOrderSnapshot(uid, orderId) — doc(orders, orderId)
 *
 * Status flow (12 statuses):
 *   Timeline (7): pending → confirmed → processing → packed → shipped → out_for_delivery → delivered
 *   Auxiliary:    cancelled, completed, returned, refunded, failed, on_hold
 *
 * Payment statuses: pending, paid, failed, refunded, partial_refund
 */
import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import {
  onUserOrdersSnapshot,
  buildOrderObject,
  addOrderToUserDocument,
} from "@/lib/firebase/firestore";
import type { FirestoreOrder, FirestoreOrderProduct, FirestoreOrderAddressDetails } from "@/types/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface OrderItem {
  productId: string; name: string; slug: string; price: number; image: string; quantity: number; variantId?: string | null;
}
export interface OrderAddress {
  fullName: string; phone: string; addressLine1: string; addressLine2?: string; landmark?: string; city: string; state: string; pincode: string;
}

export type OrderStatus =
  // 9-step premium timeline statuses
  | "pending" | "payment_confirmed" | "confirmed" | "processing"
  | "quality_inspection" | "packed" | "shipped" | "out_for_delivery" | "delivered"
  // Auxiliary statuses (non-timeline)
  | "cancelled" | "completed" | "returned" | "refunded" | "failed" | "on_hold";

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
  /** True if order is from in-memory mock fallback (no DB persistence) */
  _mock?: boolean;
  /** Shipping/tracking metadata (populated when order is shipped) */
  tracking?: {
    courierPartner?: string;
    trackingNumber?: string;
    shipmentId?: string;
    dispatchedAt?: string;
    deliveryPartner?: string;
    driverContact?: string;
    currentLocation?: string;
    estimatedArrivalTime?: string;
    deliveredAt?: string;
    recipientName?: string;
    proofOfDelivery?: string;
    estimatedDeliveryDate?: string;
    estimatedDeliveryWindow?: string;
  };
}

interface OrdersContextValue {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (data: Omit<Order, "id" | "orderNumber" | "orderStatus" | "paymentStatus" | "createdAt" | "statusHistory">) => Promise<Order>;
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

/**
 * Map a FirestoreOrder (raw, with possibly-Timestamp fields) to the client-side Order shape.
 * Handles field name differences: orderPlacedAt→createdAt, status→orderStatus,
 * products→items, shippingFee→shipping, totalAmount→total, addressDetails→address.
 */
function mapFirestoreOrderToOrder(fo: FirestoreOrder): Order {
  // Normalize orderPlacedAt → ISO string
  let createdAtIso: string;
  const t = fo.orderPlacedAt;
  if (typeof t === "string") {
    createdAtIso = t;
  } else if (t instanceof Date) {
    createdAtIso = t.toISOString();
  } else if (t && typeof (t as { toMillis?: () => number }).toMillis === "function") {
    // Firestore Timestamp
    createdAtIso = new Date((t as { toMillis: () => number }).toMillis()).toISOString();
  } else {
    createdAtIso = new Date().toISOString();
  }

  // Map items (FirestoreOrderProduct → OrderItem)
  const items: OrderItem[] = (fo.products ?? []).map((p: FirestoreOrderProduct) => ({
    productId: p.id,
    name: p.name,
    slug: p.slug ?? "",
    price: p.price,
    image: p.image,
    quantity: p.quantity,
    variantId: p.variantId ?? null,
  }));

  // Map address — handle missing addressDetails gracefully (old orders may have
  // only a flat `address` string, or no addressDetails at all)
  const rawAddr = (fo as unknown as Record<string, unknown>).addressDetails;
  const addr = (rawAddr && typeof rawAddr === "object"
    ? (rawAddr as FirestoreOrderAddressDetails)
    : {}) as Partial<FirestoreOrderAddressDetails>;
  const address: OrderAddress = {
    fullName: fo.name ?? "",
    phone: fo.phone ?? "",
    addressLine1: addr?.house ?? (typeof fo.address === "string" ? fo.address : "") ?? "",
    addressLine2: addr?.street ?? undefined,
    city: addr?.city ?? "",
    state: addr?.state ?? "",
    pincode: addr?.pincode ?? "",
  };

  // Map statusHistory (FirestoreOrderStatusEvent[] → Order.statusHistory)
  const statusHistory = (fo.statusHistory ?? []).map((h) => {
    const ht = h.date;
    let dateIso: string;
    if (typeof ht === "string") dateIso = ht;
    else if (ht instanceof Date) dateIso = ht.toISOString();
    else if (ht && typeof (ht as { toMillis?: () => number }).toMillis === "function") {
      dateIso = new Date((ht as { toMillis: () => number }).toMillis()).toISOString();
    } else {
      dateIso = createdAtIso;
    }
    return {
      status: (h.status as OrderStatus) ?? "pending",
      date: dateIso,
      note: h.note,
    };
  });

  // If statusHistory is empty, add a fallback entry
  if (statusHistory.length === 0) {
    statusHistory.push({ status: "pending", date: createdAtIso, note: "Order placed" });
  }

  return {
    id: fo.orderId,
    orderNumber: fo.orderNumber ?? fo.orderId,
    items,
    subtotal: fo.subtotal ?? 0,
    shipping: fo.shippingFee ?? 0,
    discount: fo.discount ?? 0,
    tax: fo.tax ?? 0,
    total: fo.totalAmount ?? 0,
    address,
    paymentMethod: (fo.paymentMethod === "razorpay" ? "razorpay" : "cod") as PaymentMethod,
    paymentStatus: (fo.paymentStatus as PaymentStatus) ?? "pending",
    orderStatus: (fo.status as OrderStatus) ?? "pending",
    notes: fo.notes,
    createdAt: createdAtIso,
    statusHistory,
  };
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Real-time listener on user's orders collection
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setHydrated(true);
      return;
    }

    setLoading(true);
    setError(null);

    // onUserOrdersSnapshot handles Firebase-not-configured by calling callback([])
    const unsub = onUserOrdersSnapshot(
      user.id,
      (firestoreOrders) => {
        const mapped = firestoreOrders.map(mapFirestoreOrderToOrder);

        // Merge with any local-only orders (e.g. mock fallback) that aren't yet in Firestore
        const localOrders = loadFromStorage();
        const firestoreIds = new Set(mapped.map((o) => o.id));
        const localOnly = localOrders.filter((o) => !firestoreIds.has(o.id) && !o._mock);
        const merged = [...mapped, ...localOnly].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(merged);
        saveToStorage(merged);
        setLoading(false);
        setHydrated(true);
      },
      (err) => {
        console.warn("[Orders] Firestore listener error:", err);
        setError(err.message);
        setOrders(loadFromStorage());
        setLoading(false);
        setHydrated(true);
      }
    );

    return () => unsub();
  }, [user]);

  // Persist to localStorage on changes
  useEffect(() => { if (hydrated) saveToStorage(orders); }, [orders, hydrated]);

  /**
   * Create a new order.
   *
   * Flow:
   *   1. POST /api/orders  (Prisma transaction → returns { order_number, id, ... })
   *   2. buildOrderObject() — construct FirestoreOrder from API response + checkout data
   *   3. addOrderToUserDocument() — Firestore batch write (orders/{id} + users/{uid}.orders[])
   *   4. Return Order object to caller (checkout page navigates to confirmation)
   *
   * If API call fails (e.g. dev without DB), we fall back to creating a local-only
   * order with a generated ID — Firestore dual write still attempted.
   */
  const createOrder = useCallback(
    async (data: Omit<Order, "id" | "orderNumber" | "orderStatus" | "paymentStatus" | "createdAt" | "statusHistory">): Promise<Order> => {
      const now = new Date().toISOString();
      const paymentStatus: PaymentStatus = data.paymentMethod === "cod" ? "pending" : "paid";

      // Try API first
      let apiOrderId = "order-" + Date.now();
      let apiOrderNumber = "ORD-" + Date.now();
      let apiMock = false;

      try {
        // Get Firebase ID token
        const { firebaseAuth } = await import("@/lib/firebase/client");
        const idToken = firebaseAuth?.currentUser
          ? await firebaseAuth.currentUser.getIdToken()
          : null;

        if (idToken) {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              firebaseUid: user?.id,
              address: {
                fullName: data.address.fullName,
                phone: data.address.phone,
                addressLine1: data.address.addressLine1,
                addressLine2: data.address.addressLine2,
                landmark: data.address.landmark,
                city: data.address.city,
                state: data.address.state,
                pincode: data.address.pincode,
              },
              paymentMethod: data.paymentMethod,
              items: data.items.map((i) => ({
                productId: i.productId,
                name: i.name,
                slug: i.slug,
                image: i.image,
                quantity: i.quantity,
                unitPrice: i.price,
              })),
              subtotal: data.subtotal,
              shippingCharge: data.shipping,
              discount: data.discount,
              tax: data.tax,
              totalAmount: data.total,
              notes: data.notes,
            }),
          });

          if (res.ok) {
            const json = await res.json();
            if (json.success && json.order) {
              apiOrderId = json.order.id;
              apiOrderNumber = json.order.order_number;
              apiMock = Boolean(json.order._mock);
            }
          } else {
            console.warn("[Orders] API returned non-OK status:", res.status);
          }
        }
      } catch (err) {
        console.warn("[Orders] API call failed, falling back to local order:", err);
      }

      // Build the Order object
      const order: Order = {
        ...data,
        id: apiOrderId,
        orderNumber: apiOrderNumber,
        orderStatus: "pending",
        paymentStatus,
        createdAt: now,
        statusHistory: [{ status: "pending", date: now, note: "Order placed" }],
        _mock: apiMock,
      };

      // Add to local state immediately (optimistic)
      setOrders((prev) => {
        const next = [order, ...prev.filter((o) => o.id !== order.id)];
        saveToStorage(next);
        return next;
      });

      // Firestore dual write (orders/{id} + users/{uid}.orders[])
      if (user) {
        try {
          const firestoreOrder = buildOrderObject({
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId: user.id,
            name: data.address.fullName,
            phone: data.address.phone,
            addressDetails: {
              house: data.address.addressLine1,
              street: data.address.addressLine2,
              city: data.address.city,
              state: data.address.state,
              pincode: data.address.pincode,
            },
            products: data.items.map((i) => ({
              id: i.productId,
              name: i.name,
              image: i.image,
              price: i.price,
              quantity: i.quantity,
              slug: i.slug,
              variantId: i.variantId,
            })),
            subtotal: data.subtotal,
            shippingFee: data.shipping,
            totalAmount: data.total,
            discount: data.discount,
            tax: data.tax,
            paymentMethod: data.paymentMethod,
            paymentStatus,
            notes: data.notes,
            status: "placed",
          });
          // Fire-and-forget — fail-soft
          addOrderToUserDocument(user.id, firestoreOrder).catch((e) =>
            console.warn("[Orders] Firestore dual write failed:", e)
          );
        } catch (e) {
          console.warn("[Orders] buildOrderObject/addOrderToUserDocument error:", e);
        }
      }

      return order;
    },
    [user]
  );

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id) ?? null, [orders]);

  const cancelOrder = useCallback((id: string, reason?: string) => {
    const now = new Date().toISOString();
    const cs = { status: "cancelled" as const, date: now, note: reason ?? "Cancelled by customer" };
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && (o.orderStatus === "pending" || o.orderStatus === "confirmed")
          ? { ...o, orderStatus: "cancelled", statusHistory: [...o.statusHistory, cs] }
          : o
      )
    );
    // Note: In production, this should also PATCH /api/orders/{id}/cancel
    // and updateDoc Firestore. For now we just update local state.
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, loading, error, createOrder, getOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}

/* ============================================================================
 * Exported constants (back-compat)
 * ============================================================================ */

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  payment_confirmed: "Payment Confirmed",
  confirmed: "Order Confirmed",
  processing: "Preparing Your Plants",
  quality_inspection: "Quality Inspection",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  completed: "Completed",
  returned: "Returned",
  refunded: "Refunded",
  failed: "Failed",
  on_hold: "On Hold",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  payment_confirmed: "bg-emerald-100 text-emerald-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  quality_inspection: "bg-teal-100 text-teal-700",
  packed: "bg-cyan-100 text-cyan-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-emerald-100 text-emerald-700",
  returned: "bg-rose-100 text-rose-700",
  refunded: "bg-teal-100 text-teal-700",
  failed: "bg-red-100 text-red-700",
  on_hold: "bg-slate-100 text-slate-700",
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

// Premium 9-step tracking timeline (back-compat export; canonical source is
// src/components/orders/timeline/stages.ts)
export const ORDER_TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order Placed" },
  { status: "payment_confirmed", label: "Payment Confirmed" },
  { status: "confirmed", label: "Order Confirmed" },
  { status: "processing", label: "Preparing Your Plants" },
  { status: "quality_inspection", label: "Quality Inspection" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "out_for_delivery", label: "Out For Delivery" },
  { status: "delivered", label: "Delivered" },
];
