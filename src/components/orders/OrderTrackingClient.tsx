"use client";

/**
 * GrowPlants — OrderTrackingClient (Premium Edition)
 * ============================================================================
 * Client wrapper that subscribes to a single order's Firestore document and
 * renders the complete premium tracking experience.
 *
 * Flow:
 *   1. useEffect → onUserOrderSnapshot(uid, orderId, callback) — REAL-TIME
 *   2. Loading → TrackingSkeleton (shimmer)
 *   3. Not found (after 10s) → TrackingErrorState
 *   4. Order found → OrderTimeline (banner + timeline + progress + summary cards)
 *
 * When admin updates `status` in Firestore → callback fires → setOrder(newData)
 * → OrderTimeline re-renders → step states update with smooth CSS transitions.
 * ============================================================================
 */
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, X, Download } from "lucide-react";
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
import {
  OrderTimeline,
  TrackingSkeleton,
  TrackingErrorState,
  TrackingEmptyState,
} from "@/components/orders/timeline";
import { appToast } from "@/lib/toast";

interface OrderTrackingClientProps {
  orderId: string;
}

const NOT_FOUND_TIMEOUT_MS = 10_000;

export function OrderTrackingClient({ orderId }: OrderTrackingClientProps) {
  const { user } = useAuth();
  const { getOrder, cancelOrder } = useOrders();

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
    setError(null);
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
          const mapped = mapFirestoreOrderInline(fo);
          setLiveOrder(mapped);
          setNotFound(false);
        }
        setLoading(false);
      },
      (err) => {
        // Error — fall back to local cache
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        const cached = getOrder(orderId);
        if (cached) {
          setLiveOrder(cached);
          setNotFound(false);
        } else {
          setError(err.message);
          setNotFound(true);
        }
        setLoading(false);
      },
    );

    return () => {
      unsub();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, orderId]);

  /* ---------- LOADING STATE (initial fetch, before any data) ---------- */
  if (loading && !liveOrder) {
    return (
      <Container className="py-6 md:py-10">
        <div className="mb-4 h-4 w-32 bg-slate-100 rounded animate-shimmer" />
        <TrackingSkeleton />
      </Container>
    );
  }

  /* ---------- ERROR STATE (Firestore error + no cache) ---------- */
  if (error && !liveOrder) {
    return (
      <Container className="py-6 md:py-10">
        <Link
          href="/account/orders"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1A6B3C] mb-4"
        >
          <ArrowLeft className="size-3.5" /> Back to Orders
        </Link>
        <TrackingErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  /* ---------- NOT FOUND STATE ---------- */
  if (notFound || !liveOrder) {
    return (
      <Container className="py-6 md:py-10">
        <Link
          href="/account/orders"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1A6B3C] mb-4"
        >
          <ArrowLeft className="size-3.5" /> Back to Orders
        </Link>
        <TrackingEmptyState
          message="This order may have been removed, or it may still be syncing to our servers. Please try again in a moment."
          action={{ label: "Back to Orders", onClick: () => (window.location.href = "/account/orders") }}
        />
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

  // Build stage details from order data (would come from API in production)
  const stageDetails = buildStageDetails(order);

  return (
    <Container className="py-6 md:py-10">
      <Link
        href="/account/orders"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1A6B3C] mb-4"
      >
        <ArrowLeft className="size-3.5" /> Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order header + Premium Timeline (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Compact header */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#1A6B3C]">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold px-3 py-1 rounded-full",
                  ORDER_STATUS_COLORS[order.orderStatus],
                )}
              >
                {ORDER_STATUS_LABELS[order.orderStatus]}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>
                Total{" "}
                <span className="font-bold text-slate-800">{formatINR(order.total)}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span>
                Payment{" "}
                <span className="font-medium text-slate-800">
                  {order.paymentMethod === "cod" ? "COD" : "Online"}
                </span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                Payment Status
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    PAYMENT_STATUS_COLORS[order.paymentStatus],
                  )}
                >
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

          {/* PREMIUM ORDER TIMELINE (real-time) */}
          <OrderTimeline
            order={order}
            stageDetails={stageDetails}
            estimatedDeliveryDate={computeETA(order)}
            estimatedDeliveryWindow="10:00 AM – 6:00 PM"
          />

          {/* Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-800">
              Items ({order.items.length})
            </h2>
            <Separator />
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative size-12 rounded-lg overflow-hidden bg-slate-50 shrink-0"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-sm font-medium text-slate-800 hover:text-[#1A6B3C] line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Qty: {item.quantity} × {formatINR(item.price)}
                  </p>
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
              <Download className="size-4" /> Download Invoice
            </Button>
            {canCancel && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 gap-2"
                onClick={() => setShowCancelModal(true)}
              >
                <X className="size-4" /> Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Right: Notes (compact, since summary is now in timeline) */}
        <div className="lg:col-span-1 space-y-4">
          {order.notes && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                Order Notes
              </h3>
              <p className="text-xs text-slate-600">{order.notes}</p>
            </div>
          )}

          {/* Need help card */}
          <div className="bg-gradient-to-br from-[#F3F8F1] to-white rounded-xl border border-[#1A6B3C]/10 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Need Help?</h3>
            <p className="text-xs text-slate-600 mb-3">
              Questions about your order? Our support team is here to help.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A6B3C] text-white text-xs font-semibold hover:bg-[#16A34A] transition-colors"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+919999999999"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-[#1A6B3C] hover:text-[#1A6B3C] transition-colors"
              >
                Call Support
              </a>
            </div>
          </div>
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
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelModal(false)}
              >
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
 * Helpers
 * ============================================================================ */

/**
 * Build per-stage metadata from the order.
 * In production, some fields (courierPartner, trackingNumber) would come
 * from a separate shipment API. Here we provide sensible defaults.
 */
function buildStageDetails(order: Order): Record<string, Record<string, string>> {
  const orderDate = new Date(order.createdAt);
  const orderTime = orderDate.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const orderDateStr = orderDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    order_placed: {
      date: orderDateStr,
      time: orderTime,
      orderId: `#${order.orderNumber}`,
    },
    payment_confirmed: {
      paymentMethod: order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Razorpay)",
    },
    shipped: {
      courierPartner: "GrowPlants Express",
      trackingNumber: `GP${order.orderNumber.slice(-8)}`,
      shipmentId: `SHP-${order.id.slice(-6)}`,
      dispatchTime: orderTime,
    },
    out_for_delivery: {
      deliveryPartner: "Rajesh Kumar",
      currentLocation: "Sonipat Hub",
      estimatedArrival: "Today, 10:00 AM – 6:00 PM",
      driverContact: "+91 99999 99999",
    },
    delivered: {
      deliveryTime: orderDateStr + ", " + orderTime,
      recipientName: order.address.fullName,
      proofOfDelivery: "Available (Signature captured)",
    },
  };
}

/**
 * Compute ETA — 3 days from order date as default.
 * In production, this would come from the courier API.
 */
function computeETA(order: Order): string {
  if (order.orderStatus === "delivered") {
    const lastHistory = order.statusHistory[order.statusHistory.length - 1];
    return lastHistory?.date ?? order.createdAt;
  }
  const d = new Date(order.createdAt);
  d.setDate(d.getDate() + 3);
  return d.toISOString();
}

/* ============================================================================
 * Inline mapper — FirestoreOrder → Order
 * (Defensive against missing addressDetails in old orders)
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
