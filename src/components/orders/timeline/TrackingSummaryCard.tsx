"use client";

/**
 * TrackingSummaryCard — Premium info card with all order details.
 *
 * Includes: Order Number, Tracking Number, Courier Partner,
 * Estimated Delivery, Current Status, Last Updated, Shipping Address, Payment Method.
 */
import { cn } from "@/lib/utils";
import {
  Hash,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import type { Order } from "@/contexts/OrdersContext";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "@/contexts/OrdersContext";
import { formatINR, formatDate } from "@/lib/utils";

interface TrackingSummaryCardProps {
  order: Order;
  /** Tracking number (from courier) */
  trackingNumber?: string;
  /** Courier partner name */
  courierPartner?: string;
  /** Estimated delivery date */
  estimatedDelivery?: string;
  /** Last updated timestamp */
  lastUpdated?: string;
  className?: string;
}

interface InfoRow {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
}

export function TrackingSummaryCard({
  order,
  trackingNumber,
  courierPartner,
  estimatedDelivery,
  lastUpdated,
  className,
}: TrackingSummaryCardProps) {
  const isDelivered = order.orderStatus === "delivered";
  const isCancelled = order.orderStatus === "cancelled";

  const topRows: InfoRow[] = [
    {
      icon: Hash,
      label: "Order Number",
      value: `#${order.orderNumber}`,
      highlight: true,
    },
    {
      icon: Truck,
      label: "Tracking Number",
      value: trackingNumber ?? "Will be available once shipped",
    },
    {
      icon: Package,
      label: "Courier Partner",
      value: courierPartner ?? (isDelivered ? "Delivered" : "Not assigned yet"),
    },
    {
      icon: Calendar,
      label: isDelivered ? "Delivered On" : "Estimated Delivery",
      value: estimatedDelivery ?? formatDate(computeDefaultETA(order.createdAt)),
    },
  ];

  const statusIcon = isCancelled
    ? AlertCircle
    : isDelivered
      ? CheckCircle2
      : Clock;
  const statusColor = isCancelled
    ? "text-red-600"
    : isDelivered
      ? "text-green-600"
      : "text-[#1A6B3C]";
  const StatusIconComp = statusIcon;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm",
        "hover:shadow-md transition-shadow duration-300",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">Order Summary</h3>
        <div className="flex items-center gap-2">
          <StatusIconComp className={cn("size-4", statusColor)} aria-hidden="true" />
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              ORDER_STATUS_COLORS[order.orderStatus],
            )}
          >
            {ORDER_STATUS_LABELS[order.orderStatus]}
          </span>
        </div>
      </div>

      {/* Top info rows */}
      <div className="space-y-3 mb-4">
        {topRows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center shrink-0">
              <row.icon className="size-4 text-[#1A6B3C]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                {row.label}
              </p>
              <p
                className={cn(
                  "text-sm truncate",
                  row.highlight ? "font-bold text-slate-800" : "font-medium text-slate-700",
                )}
              >
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Status + Last Updated row */}
      <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-100">
        <div>
          <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
            Payment Status
          </p>
          <span
            className={cn(
              "inline-flex mt-1 text-xs font-semibold px-2 py-0.5 rounded-full",
              PAYMENT_STATUS_COLORS[order.paymentStatus],
            )}
          >
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </span>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
            Last Updated
          </p>
          <p className="text-sm font-medium text-slate-700 mt-1">
            {lastUpdated
              ? formatDate(lastUpdated)
              : formatDate(
                  order.statusHistory[order.statusHistory.length - 1]?.date ??
                    order.createdAt,
                )}
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="size-4 text-[#1A6B3C]" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
              Shipping Address
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {order.address.fullName}
            </p>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {order.address.addressLine1}
              {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}
              <br />
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="text-xs text-slate-500 mt-1">📞 {order.address.phone}</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-[#1A6B3C]" aria-hidden="true" />
          <span className="text-xs text-slate-500">Payment Method</span>
        </div>
        <span className="text-sm font-bold text-slate-800">
          {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}
        </span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
          Total Amount
        </span>
        <span className="text-base font-bold text-[#1A6B3C]">
          {formatINR(order.total)}
        </span>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

// Fix: properly reference the status icon component
function StatusIconWrapper({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon className={className} aria-hidden="true" />;
}

function computeDefaultETA(createdAtIso: string): string {
  const d = new Date(createdAtIso);
  d.setDate(d.getDate() + 3);
  return d.toISOString();
}
