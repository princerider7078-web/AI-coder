"use client";

/**
 * GrowPlants — OrderTrackingClient
 * ============================================================================
 * Client wrapper that subscribes to a single order's Firestore document and
 * renders the order detail page. Used by /account/orders/[id]/page.tsx.
 *
 * Flow:
 *   1. useEffect → onUserOrderSnapshot(uid, orderId, callback)
 *      - doc(orders, orderId) onSnapshot() — REAL-TIME LISTENER
 *   2. When admin updates `status` in Firestore → callback fires → setOrder(newData)
 *   3. Re-render → OrderTrackingTimeline receives new status →
 *      getStepIndex() recalculates → step states (completed/current/upcoming) update
 *   4. CSS transitions animate the change
 *
 * 10-second timeout:
 *   - If the doc hasn't arrived within 10s, we show "Order not found" so the
 *     user isn't stuck staring at a spinner.
 *
 * Fallback:
 *   - If Firestore isn't configured, we fall back to OrdersContext.getOrder(id)
 *     (which reads from localStorage + the orders list snapshot).
 * ============================================================================
 */
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Download, ArrowLeft, X, AlertCircle, MapPin, CreditCard, Loader2,
} from "lucide-react";
import { cn, formatINR, formatDate } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useOrders,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  type Order,
} from "@/contexts/OrdersContext";
import { useAuth } from "@/contexts/AuthContext";
import { onUserOrderSnapshot } from "@/lib/firebase/firestore";
import type { FirestoreOrder, FirestoreOrderAddressDetails } from "@/types/firebase";
import { OrderTimeline } from "@/components/orders/timeline";
import { appToast } from "@/lib/toast";

interface OrderTrackingClientProps {
  orderId: string;
}

const NOT_FOUND_TIMEOUT_MS = 10_000;

export function OrderTrackingClient({ orderId }: OrderTrackingClientProps) {
  const { user } = useAuth();
  const { getOrder, cancelOrder, orders } = useOrders();

  // Live order from Firestore (real-time)
  const [liveOrder, setLiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Track timeout so we don't show "not found" if doc arrives late
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);
    setLiveOrder(null);

    // Start 10s timeout — if no doc by then, show "not found"
    timeoutRef.current = setTimeout(() => {
      setNotFound(true);
      setLoading(false);
    }, NOT_FOUND_TIMEOUT_MS);

    // Subscribe to single doc real-time updates
    const unsub = onUserOrderSnapshot(
      user.id,
      orderId,
      (fo: FirestoreOrder | null) => {
        // Clear timeout — we got a response (doc exists OR doesn't)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (!fo) {
          // Doc doesn't exist (yet) — fall back to OrdersContext local cache
          const cached = getOrder(orderId);
          if (cached) {
            setLiveOrder(cached);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        } else {
          // Map FirestoreOrder → Order (reuse the same mapping logic by reading
          // from orders list which is kept in sync, OR by inline mapping)
          const mapped = mapFirestoreOrderInline(fo);
          setLiveOrder(mapped);
          setNotFound(false);
        }
        setLoading(false);
      },
      () => {
        // Error — fall back to local cache
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        const cached = getOrder(orderId);
        if (cached) {
          setLiveOrder(cached);
          setNotFound(false);
          setError(null);
        } else {
          setNotFound(true);
          setError("We couldn't load real-time tracking. Your order data may be stale.");
        }
        setLoading(false);
      }
    );

    return () => {
      unsub();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, orderId]);

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <Container className="py-16 flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-8 text-[#1A6B3C] animate-spin" />
        <p className="text-sm text-slate-500">Loading order…</p>
      </Container>
    );
  }

  /* ---------- Not found state ---------- */
  if (notFound || !liveOrder) {
    return (
      <Container className="py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-slate-300 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
        <p className="text-sm text-slate-500">
          This order may have been removed, or it may still be syncing to our servers.
        </p>
        <Button asChild className="bg-[#1A6B3C] hover:bg-[#16A34A]">
          <Link href="/account/orders">← Back to Orders</Link>
        </Button>
      </Container>
    );
  }

  const order = liveOrder;
  const canCancel = order.orderStatus === "pending" || order.orderStatus === "confirmed";

  const handleCancel = () => {
    cancelOrder(order.id, cancelReason || "Cancelled by customer");
    setShowCancelModal(false);
    appToast.success("Order cancelled", `Order #${order.orderNumber} has been cancelled`);
  };

  return (
    <Container className="py-6 md:py-10">
      <Link
        href="/account/orders"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1A6B3C] mb-4"
      >
        <ArrowLeft className="size-3.5" />
        Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-[#1A6B3C]">Order ID #{order.orderNumber}</h1>
                <p className="text-sm text-slate-500 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", ORDER_STATUS_COLORS[order.orderStatus])}>
                {ORDER_STATUS_LABELS[order.orderStatus]}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>Total Amount <span className="font-bold text-slate-800">{formatINR(order.total)}</span></span>
              <span>·</span>
              <span>Payment <span className="font-medium text-slate-800">{order.paymentMethod === "cod" ? "COD" : "Online"}</span></span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                Payment Status
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", PAYMENT_STATUS_COLORS[order.paymentStatus])}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </span>
              </span>
              {order._mock && (
                <span className="ml-auto text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Mock (DB unavailable)
                </span>
              )}
            </div>
          </div>

          {/* Premium Order Timeline (real-time) */}
          <OrderTimeline
            order={order}
            loading={false}
            error={error}
            onRetry={() => window.location.reload()}
            showBanner
            showProgressCard
            showSummaryCard
            layout="auto"
          />

          {/* Loading skeleton during initial fetch (before order arrives) */}
          {loading && !liveOrder && (
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="h-4 w-1/4 bg-slate-100 rounded animate-shimmer mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-slate-100 animate-shimmer shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-2.5 w-1/3 bg-slate-100 rounded animate-shimmer" />
                      <div className="h-2 w-1/2 bg-slate-100 rounded animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Items ({order.items.length})</h2>
            <Separator />
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative size-12 rounded-lg overflow-hidden bg-slate-50 shrink-0"
                >
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-medium text-slate-800 hover:text-[#1A6B3C] line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatINR(item.price)}</p>
                </div>
                <p className="text-sm font-bold text-[#1A6B3C] tabular-nums">
                  {formatINR(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-[#1A6B3C] text-[#1A6B3C] gap-2">
              <Download className="size-4" />
              Download Invoice
            </Button>
            {canCancel && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 gap-2"
                onClick={() => setShowCancelModal(true)}
              >
                <X className="size-4" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1 space-y-4">
          {/* Address */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
              <MapPin className="size-3.5" /> Delivery Address
            </h3>
            <p className="text-sm font-medium text-slate-800">{order.address.fullName}</p>
            <p className="text-xs text-slate-600">
              {order.address.addressLine1}
              {order.address.addressLine2 ? ", " + order.address.addressLine2 : ""}
            </p>
            <p className="text-xs text-slate-600">
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="text-xs text-slate-600 mt-1">📞 {order.address.phone}</p>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
              <CreditCard className="size-3.5" /> Payment
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Method</span>
              <span className="text-sm font-medium text-slate-800">
                {order.paymentMethod === "cod" ? "COD" : "Online (Razorpay)"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Payment Status</span>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", PAYMENT_STATUS_COLORS[order.paymentStatus])}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </span>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">Price Details</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="tabular-nums">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="tabular-nums">-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Delivery</span>
              <span className="tabular-nums">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold">Total Amount</span>
              <span className="text-lg font-bold text-[#1A6B3C] tabular-nums">{formatINR(order.total)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">Order Notes</h3>
              <p className="text-xs text-slate-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900">Cancel Order?</h2>
            <p className="text-sm text-slate-500">
              Cancel order #{order.orderNumber}? This cannot be undone.
            </p>
            <div className="space-y-1.5">
              <Label className="text-sm">Reason (optional)</Label>
              <Textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>
                Keep Order
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={handleCancel}
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

/* ============================================================================
 * Inline mapper — FirestoreOrder → Order (kept here to avoid circular import
 * with OrdersContext's internal mapper)
 * ============================================================================ */
function mapFirestoreOrderInline(fo: FirestoreOrder): Order {
  let createdAtIso: string;
  const t = fo.orderPlacedAt;
  if (typeof t === "string") createdAtIso = t;
  else if (t instanceof Date) createdAtIso = t.toISOString();
  else if (t && typeof (t as { toMillis?: () => number }).toMillis === "function") {
    createdAtIso = new Date((t as { toMillis: () => number }).toMillis()).toISOString();
  } else {
    createdAtIso = new Date().toISOString();
  }

  const items = (fo.products ?? []).map((p) => ({
    productId: p.id,
    name: p.name,
    slug: p.slug ?? "",
    price: p.price,
    image: p.image,
    quantity: p.quantity,
    variantId: p.variantId ?? null,
  }));

  // Defensive: old Firestore orders may not have addressDetails (only flat address string)
  const rawAddr = (fo as unknown as Record<string, unknown>).addressDetails;
  const addr = (rawAddr && typeof rawAddr === "object"
    ? (rawAddr as FirestoreOrderAddressDetails)
    : {}) as Partial<FirestoreOrderAddressDetails>;
  const address = {
    fullName: fo.name ?? "",
    phone: fo.phone ?? "",
    addressLine1: addr?.house ?? (typeof fo.address === "string" ? fo.address : "") ?? "",
    addressLine2: addr?.street ?? undefined,
    city: addr?.city ?? "",
    state: addr?.state ?? "",
    pincode: addr?.pincode ?? "",
  };

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
      status: (h.status as Order["orderStatus"]) ?? "pending",
      date: dateIso,
      note: h.note,
    };
  });

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
    paymentMethod: (fo.paymentMethod === "razorpay" ? "razorpay" : "cod") as Order["paymentMethod"],
    paymentStatus: (fo.paymentStatus as Order["paymentStatus"]) ?? "pending",
    orderStatus: (fo.status as Order["orderStatus"]) ?? "pending",
    notes: fo.notes,
    createdAt: createdAtIso,
    statusHistory,
  };
}
