"use client";

/**
 * GrowPlants — OrderTrackingClient (Professional Edition)
 * ============================================================================
 * Client wrapper that subscribes to a single order's Firestore document and
 * renders the complete professional order detail experience.
 *
 * Layout (Desktop, lg+):
 *   ┌─────────────────────────────────────┬───────────────────┐
 *   │ OrderHeaderCard (full width)        │                   │
 *   │ OrderTimeline (premium 9-step)      │ PaymentSummaryCard│
 *   │ OrderItemsCard                      │ DeliveryAddressCard│
 *   │ OrderActionsBar                     │                   │
 *   └─────────────────────────────────────┴───────────────────┘
 *
 * Layout (Mobile):
 *   All cards stacked vertically in order:
 *   Header → Timeline → Items → Payment → Address → Actions
 *
 * Flow:
 *   1. useEffect → onUserOrderSnapshot(uid, orderId, callback) — REAL-TIME
 *   2. Loading → TrackingSkeleton (shimmer)
 *   3. Not found (after 10s) → TrackingEmptyState
 *   4. Order found → Professional layout with all cards
 * ============================================================================
 */
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useOrders,
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
import { OrderHeaderCard } from "@/components/orders/OrderHeaderCard";
import { OrderItemsCard } from "@/components/orders/OrderItemsCard";
import { PaymentSummaryCard } from "@/components/orders/PaymentSummaryCard";
import { DeliveryAddressCard } from "@/components/orders/DeliveryAddressCard";
import { OrderActionsBar } from "@/components/orders/OrderActionsBar";
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

    timeoutRef.current = setTimeout(() => {
      setNotFound(true);
      setLoading(false);
    }, NOT_FOUND_TIMEOUT_MS);

    const unsub = onUserOrderSnapshot(
      user.id,
      orderId,
      (fo: FirestoreOrder | null) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (!fo) {
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

  /* ---------- LOADING STATE ---------- */
  if (loading && !liveOrder) {
    return (
      <Container className="py-6 md:py-10">
        <div className="mb-4 h-4 w-32 bg-slate-100 rounded animate-shimmer" />
        <TrackingSkeleton />
      </Container>
    );
  }

  /* ---------- ERROR STATE ---------- */
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
        <TrackingEmptyState orderNumber={orderId} />
      </Container>
    );
  }

  const order = liveOrder;

  const handleCancel = () => {
    cancelOrder(order.id, cancelReason || "Cancelled by customer");
    setShowCancelModal(false);
    appToast.success("Order cancelled", `Order #${order.orderNumber} has been cancelled`);
  };

  const handleReorder = () => {
    appToast.info("Reorder", "Adding items to cart...");
  };

  const handleDownloadInvoice = () => {
    appToast.info("Invoice", "Generating invoice PDF...");
  };

  return (
    <Container className="py-6 md:py-10">
      {/* Back link */}
      <Link
        href="/account/orders"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1A6B3C] mb-5 transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Back to Orders
      </Link>

      {/* Main grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* ═══════════════ LEFT COLUMN (2/3) ═══════════════ */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Order Header Card */}
          <OrderHeaderCard order={order} />

          {/* 2. Premium Order Timeline (9-step) */}
          <OrderTimeline
            order={order}
            estimatedDelivery={computeETA(order)}
            estimatedDeliveryTime="10:00 AM – 6:00 PM"
          />

          {/* 3. Order Items Card */}
          <OrderItemsCard order={order} />

          {/* 4. Order Actions Bar */}
          <OrderActionsBar
            order={order}
            onCancel={() => setShowCancelModal(true)}
            onReorder={handleReorder}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </div>

        {/* ═══════════════ RIGHT COLUMN (1/3) ═══════════════ */}
        <div className="lg:col-span-1 space-y-5">
          {/* 5. Payment Summary Card */}
          <PaymentSummaryCard order={order} />

          {/* 6. Delivery Address Card */}
          <DeliveryAddressCard order={order} gpsVerified={false} />

          {/* 7. Quick Help Card (compact) */}
          <div className="bg-gradient-to-br from-[#F3F8F1] to-white rounded-2xl border border-[#1A6B3C]/10 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-[#1A6B3C] flex items-center justify-center shrink-0">
                <span className="text-lg">🌿</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  GrowPlants Care
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Every plant comes with a 7-day health guarantee. If your plant arrives damaged or unhealthy, we&apos;ll replace it free.
                </p>
                <Link
                  href="/refund-policy"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A6B3C] hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ CANCEL MODAL ═══════════════ */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Cancel Order?</h2>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Cancel order <span className="font-bold">#{order.orderNumber}</span>? You&apos;ll receive a confirmation email once the cancellation is processed.
            </p>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Reason <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're cancelling (helps us improve)..."
                className="resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
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
                Yes, Cancel Order
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
