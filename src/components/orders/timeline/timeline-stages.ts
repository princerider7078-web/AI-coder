/**
 * GrowPlants — Timeline Stage Definitions
 * ============================================================================
 * Data-driven stage registry. Adding a new stage (e.g. "Return Requested") is
 * a one-line addition here — no UI changes needed.
 *
 * Each stage has:
 *   - id               Stable identifier (matches OrderStatus when applicable)
 *   - label            Short display name
 *   - description      One-line explanation shown under the label
 *   - iconName         Icon key resolved by TimelineIcon
 *   - accentColor      Tailwind classes for the icon circle
 *   - detailFields     Metadata fields to render when step is current/completed
 *                      (e.g. courier, tracking number, driver contact)
 *   - isBotanical      Whether to render a leaf accent (GrowPlants signature)
 *
 * Stage order = display order. The current step is derived from order.orderStatus.
 * ============================================================================
 */
import type { OrderStatus } from "@/contexts/OrdersContext";

export type TimelineIconName =
  | "shopping-bag"
  | "wallet"
  | "check-circle"
  | "package"
  | "leaf-shield"
  | "box"
  | "truck"
  | "map-pin"
  | "check-badge"
  | "clock";

export interface TimelineStage {
  /** Stable ID — must match a value in OrderStatus OR be a future-only stage */
  id: string;
  /** OrderStatus that maps to this stage (null for future-only stages) */
  status: OrderStatus | null;
  label: string;
  description: string;
  iconName: TimelineIconName;
  /** Tailwind classes for the icon circle background (when current/completed) */
  accentColor: string;
  /** Tailwind text color for the icon */
  iconColor: string;
  /** Metadata fields to display when step is current or completed */
  detailFields?: TimelineDetailField[];
  /** Whether to render the botanical leaf accent (GrowPlants signature) */
  isBotanical?: boolean;
}

export interface TimelineDetailField {
  /** Key into the per-stage metadata object passed by the parent */
  key: string;
  /** Display label */
  label: string;
  /** Lucide icon name */
  iconName:
    | "calendar"
    | "clock"
    | "hash"
    | "user"
    | "phone"
    | "truck"
    | "map-pin"
    | "credit-card"
    | "package"
    | "check-circle";
  /** Whether this field is critical (bolded) or secondary */
  critical?: boolean;
}

/* ============================================================================
 * 9-STEP PREMIUM TIMELINE
 * Order Placed → Payment Confirmed → Order Confirmed → Preparing →
 * Quality Inspection → Packed → Shipped → Out For Delivery → Delivered
 * ============================================================================ */

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "order_placed",
    status: "pending",
    label: "Order Placed",
    description: "We have successfully received your order.",
    iconName: "shopping-bag",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
    detailFields: [
      { key: "date", label: "Date", iconName: "calendar", critical: true },
      { key: "time", label: "Time", iconName: "clock" },
      { key: "orderId", label: "Order ID", iconName: "hash", critical: true },
    ],
  },
  {
    id: "payment_confirmed",
    status: "confirmed",
    label: "Payment Confirmed",
    description: "Your payment has been verified successfully.",
    iconName: "wallet",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
    detailFields: [
      { key: "paymentMethod", label: "Payment Method", iconName: "credit-card", critical: true },
    ],
  },
  {
    id: "order_confirmed",
    status: "confirmed",
    label: "Order Confirmed",
    description: "Our team has confirmed your order.",
    iconName: "check-circle",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
  },
  {
    id: "preparing",
    status: "processing",
    label: "Preparing Your Plants",
    description: "Your plants and products are being carefully prepared for dispatch.",
    iconName: "package",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
    isBotanical: true,
  },
  {
    id: "quality_inspection",
    status: "packed",
    label: "Quality Inspection",
    description: "Each plant is being inspected for health and quality before shipping.",
    iconName: "leaf-shield",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
    isBotanical: true,
  },
  {
    id: "packed",
    status: "packed",
    label: "Packed",
    description: "Your order has been packed safely.",
    iconName: "box",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
  },
  {
    id: "shipped",
    status: "shipped",
    label: "Shipped",
    description: "Your package has left our warehouse.",
    iconName: "truck",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
    detailFields: [
      { key: "courierPartner", label: "Courier Partner", iconName: "truck", critical: true },
      { key: "trackingNumber", label: "Tracking Number", iconName: "hash", critical: true },
      { key: "shipmentId", label: "Shipment ID", iconName: "package" },
      { key: "dispatchTime", label: "Dispatch Time", iconName: "clock" },
    ],
  },
  {
    id: "out_for_delivery",
    status: "out_for_delivery",
    label: "Out For Delivery",
    description: "Your package is out for delivery.",
    iconName: "map-pin",
    accentColor: "bg-[#E8930A] text-white",
    iconColor: "text-white",
    detailFields: [
      { key: "deliveryPartner", label: "Delivery Partner", iconName: "user", critical: true },
      { key: "currentLocation", label: "Current Location", iconName: "map-pin" },
      { key: "estimatedArrival", label: "Estimated Arrival", iconName: "clock", critical: true },
      { key: "driverContact", label: "Driver Contact", iconName: "phone" },
    ],
  },
  {
    id: "delivered",
    status: "delivered",
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    iconName: "check-badge",
    accentColor: "bg-[#1A6B3C] text-white",
    iconColor: "text-white",
    detailFields: [
      { key: "deliveryTime", label: "Delivery Time", iconName: "clock", critical: true },
      { key: "recipientName", label: "Recipient Name", iconName: "user" },
      { key: "proofOfDelivery", label: "Proof of Delivery", iconName: "check-circle" },
    ],
  },
];

/* ============================================================================
 * FUTURE-READY STAGES — not in default timeline, but available for returns etc.
 * ============================================================================
 * To enable: add to TIMELINE_STAGES array above. UI auto-adapts.
 */
export const FUTURE_STAGES: TimelineStage[] = [
  {
    id: "return_requested",
    status: "returned",
    label: "Return Requested",
    description: "Customer has requested a return.",
    iconName: "package",
    accentColor: "bg-amber-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "return_approved",
    status: "returned",
    label: "Return Approved",
    description: "Your return request has been approved.",
    iconName: "check-circle",
    accentColor: "bg-amber-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "return_pickup",
    status: "returned",
    label: "Return Pickup",
    description: "Our team is picking up the returned items.",
    iconName: "truck",
    accentColor: "bg-amber-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "refund_initiated",
    status: "refunded",
    label: "Refund Initiated",
    description: "Your refund has been initiated.",
    iconName: "wallet",
    accentColor: "bg-blue-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "refund_completed",
    status: "refunded",
    label: "Refund Completed",
    description: "Your refund has been processed successfully.",
    iconName: "check-badge",
    accentColor: "bg-blue-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "cancelled",
    status: "cancelled",
    label: "Cancelled",
    description: "This order has been cancelled.",
    iconName: "check-circle",
    accentColor: "bg-red-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "delayed",
    status: "on_hold",
    label: "Delayed",
    description: "Your delivery has been delayed. We apologize for the inconvenience.",
    iconName: "clock",
    accentColor: "bg-amber-500 text-white",
    iconColor: "text-white",
  },
  {
    id: "failed_delivery",
    status: "failed",
    label: "Failed Delivery",
    description: "We could not deliver your package. We will retry soon.",
    iconName: "map-pin",
    accentColor: "bg-red-500 text-white",
    iconColor: "text-white",
  },
];

/* ============================================================================
 * HELPERS
 * ============================================================================ */

/**
 * Map an OrderStatus to the index in TIMELINE_STAGES.
 * Multiple stages can map to the same status (e.g. "confirmed" maps to both
 * "Payment Confirmed" at index 1 and "Order Confirmed" at index 2). In that
 * case, we return the LATEST one (so the user sees the most progressed view).
 *
 * Returns -1 if status is not in the timeline (e.g. cancelled, returned).
 */
export function getTimelineStageIndex(status: OrderStatus | undefined | null): number {
  if (!status) return -1;
  // Special case: cancelled should NOT map to a timeline stage
  if (status === "cancelled") return -1;
  let lastIndex = -1;
  TIMELINE_STAGES.forEach((stage, i) => {
    if (stage.status === status) lastIndex = i;
  });
  return lastIndex;
}

/**
 * Compute the state of a step given its index vs the current index.
 */
export type StepState = "completed" | "current" | "upcoming" | "cancelled_step";

export function getStepState(
  stepIndex: number,
  currentIndex: number,
  isCancelled: boolean,
): StepState {
  if (isCancelled) {
    if (stepIndex === 0) return "completed";
    if (stepIndex === 1) return "cancelled_step";
    return "upcoming";
  }
  if (currentIndex < 0) return "upcoming";
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
}

/**
 * Compute progress percentage (0-100) based on current step.
 */
export function getProgressPercentage(currentIndex: number, totalSteps: number): number {
  if (currentIndex < 0) return 0;
  if (currentIndex >= totalSteps - 1) return 100;
  return Math.round(((currentIndex + 1) / totalSteps) * 100);
}
