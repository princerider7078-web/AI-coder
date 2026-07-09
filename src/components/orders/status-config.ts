/**
 * GrowPlants — Order Status Configuration
 * ============================================================================
 * Central registry of all order + payment statuses with display metadata:
 *   - Labels (English + Hindi)
 *   - Badge colors (Tailwind classes)
 *   - Timeline mapping (which statuses appear in the 7-step tracker)
 *   - Step ordering for completed/current/upcoming logic
 *
 * 12 ORDER STATUSES:
 *   Timeline (7):  pending → confirmed → processing → packed → shipped → out_for_delivery → delivered
 *   Non-timeline:  cancelled, completed, returned, refunded, failed, on_hold
 *
 * 5 PAYMENT STATUSES:
 *   pending, paid, failed, refunded, partial_refund
 * ============================================================================
 */
import type { OrderStatus, PaymentStatus } from "@/contexts/OrdersContext";

export interface StatusConfig {
  label: string;
  labelHi: string;
  /** Tailwind classes for badge (bg + text) */
  color: string;
  /** Dot color for icons */
  dotColor: string;
  /** Whether this status is in the 7-step timeline (true) or auxiliary (false) */
  isTimelineStep: boolean;
  /** Order index in the timeline (0-6). -1 for non-timeline statuses. */
  stepIndex: number;
  /** Whether the customer can still cancel the order at this status */
  cancellable: boolean;
  /** Short description shown in tooltip/help text */
  description: string;
  descriptionHi: string;
}

/* ============================================================================
 * ORDER STATUS CONFIG — 14 statuses (9 timeline + 5 auxiliary)
 * ============================================================================ */

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Order Placed",
    labelHi: "ऑर्डर दिया गया",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
    isTimelineStep: true,
    stepIndex: 0,
    cancellable: true,
    description: "Order placed, awaiting confirmation",
    descriptionHi: "ऑर्डर दिया गया, पुष्टि की प्रतीक्षा है",
  },
  payment_confirmed: {
    label: "Payment Confirmed",
    labelHi: "भुगतान की पुष्टि",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    isTimelineStep: true,
    stepIndex: 1,
    cancellable: true,
    description: "Payment verified successfully",
    descriptionHi: "भुगतान सफलतापूर्वक सत्यापित",
  },
  confirmed: {
    label: "Order Confirmed",
    labelHi: "ऑर्डर की पुष्टि",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
    isTimelineStep: true,
    stepIndex: 2,
    cancellable: true,
    description: "Order confirmed by seller",
    descriptionHi: "विक्रेता द्वारा ऑर्डर की पुष्टि की गई",
  },
  processing: {
    label: "Preparing Your Plants",
    labelHi: "पौधे तैयार किए जा रहे हैं",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dotColor: "bg-indigo-500",
    isTimelineStep: true,
    stepIndex: 3,
    cancellable: false,
    description: "Being prepared for packing",
    descriptionHi: "पैकिंग के लिए तैयार किया जा रहा है",
  },
  quality_inspection: {
    label: "Quality Inspection",
    labelHi: "गुणवत्ता निरीक्षण",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    dotColor: "bg-teal-500",
    isTimelineStep: true,
    stepIndex: 4,
    cancellable: false,
    description: "Each plant inspected for health and quality",
    descriptionHi: "हर पौधे की गुणवत्ता की जांच हो रही है",
  },
  packed: {
    label: "Packed",
    labelHi: "पैक किया गया",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    dotColor: "bg-cyan-500",
    isTimelineStep: true,
    stepIndex: 5,
    cancellable: false,
    description: "Packed and ready to ship",
    descriptionHi: "पैक हो गया, भेजने के लिए तैयार",
  },
  shipped: {
    label: "Shipped",
    labelHi: "भेज दिया गया",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
    isTimelineStep: true,
    stepIndex: 6,
    cancellable: false,
    description: "Handed over to courier",
    descriptionHi: "कूरियर को सौंप दिया गया",
  },
  out_for_delivery: {
    label: "Out For Delivery",
    labelHi: "डिलीवरी के लिए रवाना",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
    isTimelineStep: true,
    stepIndex: 7,
    cancellable: false,
    description: "Out with delivery agent",
    descriptionHi: "डिलीवरी एजेंट के साथ रवाना",
  },
  delivered: {
    label: "Delivered",
    labelHi: "डिलीवर हो गया",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
    isTimelineStep: true,
    stepIndex: 8,
    cancellable: false,
    description: "Successfully delivered",
    descriptionHi: "सफलतापूर्वक डिलीवर हो गया",
  },
  cancelled: {
    label: "Cancelled",
    labelHi: "रद्द किया गया",
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    isTimelineStep: false,
    stepIndex: -1,
    cancellable: false,
    description: "Order was cancelled",
    descriptionHi: "ऑर्डर रद्द कर दिया गया",
  },
  // Non-timeline statuses (kept for completeness — admin may use these)
  completed: {
    label: "Completed",
    labelHi: "पूर्ण",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    isTimelineStep: false,
    stepIndex: -1,
    cancellable: false,
    description: "Order completed (post-delivery)",
    descriptionHi: "ऑर्डर पूर्ण (डिलीवरी के बाद)",
  },
  returned: {
    label: "Returned",
    labelHi: "वापस किया गया",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    isTimelineStep: false,
    stepIndex: -1,
    cancellable: false,
    description: "Items returned by customer",
    descriptionHi: "ग्राहक द्वारा वापस किया गया",
  },
  refunded: {
    label: "Refunded",
    labelHi: "धन वापसी",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    dotColor: "bg-teal-500",
    isTimelineStep: false,
    stepIndex: -1,
    cancellable: false,
    description: "Refund processed",
    descriptionHi: "धन वापसी संसाधित",
  },
  failed: {
    label: "Failed",
    labelHi: "विफल",
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    isTimelineStep: false,
    stepIndex: -1,
    cancellable: false,
    description: "Order failed (payment or fulfillment)",
    descriptionHi: "ऑर्डर विफल (भुगतान या पूर्ति)",
  },
  on_hold: {
    label: "On Hold",
    labelHi: "रुका हुआ",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-500",
    isTimelineStep: false,
    stepIndex: -1,
    cancellable: true,
    description: "Order temporarily on hold",
    descriptionHi: "ऑर्डर अस्थायी रूप से रुका हुआ",
  },
};

/* ============================================================================
 * PAYMENT STATUS CONFIG — 5 statuses
 * ============================================================================ */

export interface PaymentStatusConfig {
  label: string;
  labelHi: string;
  color: string;
  dotColor: string;
  description: string;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  pending: {
    label: "Pending",
    labelHi: "लंबित",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
    description: "Payment awaiting processing",
  },
  paid: {
    label: "Paid",
    labelHi: "भुगतान हो गया",
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
    description: "Payment successfully captured",
  },
  failed: {
    label: "Failed",
    labelHi: "विफल",
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    description: "Payment failed",
  },
  refunded: {
    label: "Refunded",
    labelHi: "धन वापसी",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
    description: "Full refund processed",
  },
  partial_refund: {
    label: "Partial Refund",
    labelHi: "आंशिक धन वापसी",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
    description: "Partial refund processed",
  },
};

/* ============================================================================
 * Helper accessors (back-compat with existing ORDER_STATUS_LABELS etc.)
 * ============================================================================ */

export function getStatusLabel(status: OrderStatus, lang: "en" | "hi" = "en"): string {
  return lang === "hi"
    ? ORDER_STATUS_CONFIG[status]?.labelHi ?? status
    : ORDER_STATUS_CONFIG[status]?.label ?? status;
}

export function getStatusColor(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status]?.color ?? "bg-slate-100 text-slate-700";
}

export function getPaymentStatusLabel(status: PaymentStatus, lang: "en" | "hi" = "en"): string {
  return lang === "hi"
    ? PAYMENT_STATUS_CONFIG[status]?.labelHi ?? status
    : PAYMENT_STATUS_CONFIG[status]?.label ?? status;
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  return PAYMENT_STATUS_CONFIG[status]?.color ?? "bg-slate-100 text-slate-700";
}

export function isCancellable(status: OrderStatus): boolean {
  return ORDER_STATUS_CONFIG[status]?.cancellable ?? false;
}

export function getStepIndex(status: OrderStatus): number {
  return ORDER_STATUS_CONFIG[status]?.stepIndex ?? -1;
}

export function isTimelineStatus(status: OrderStatus): boolean {
  return ORDER_STATUS_CONFIG[status]?.isTimelineStep ?? false;
}
