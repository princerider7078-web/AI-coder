"use client";

/**
 * GrowPlants — OrderHeaderCard
 * ============================================================================
 * Premium order header card with:
 *   - Order ID (large, brand color)
 *   - Order status badge (color-coded)
 *   - Placed date + time
 *   - Total amount (prominent)
 *   - Payment method + payment status badges
 *   - Mock indicator (if applicable)
 *
 * Botanical-themed with subtle leaf accent.
 * ============================================================================
 */
import { cn, formatINR, formatDate } from "@/lib/utils";
import { Calendar, Hash, IndianRupee, CreditCard, Sparkles, Leaf } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  type Order,
} from "@/contexts/OrdersContext";

interface OrderHeaderCardProps {
  order: Order;
  className?: string;
}

export function OrderHeaderCard({ order, className }: OrderHeaderCardProps) {
  const placedDate = new Date(order.createdAt);
  const dateStr = formatDate(order.createdAt);
  const timeStr = placedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      {/* Botanical accent — leaf watermark */}
      <Leaf
        className="absolute -top-4 -right-4 size-32 text-[#1A6B3C]/5 rotate-12"
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">
        {/* Top row: Order ID + Status badge */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-[#1A6B3C]" />
              <h1 className="text-lg sm:text-xl font-bold text-[#1A6B3C] tracking-tight">
                Order #{order.orderNumber}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
              <Calendar className="size-3.5" />
              <span>Placed on {dateStr}</span>
              <span className="text-slate-300">·</span>
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={cn(
                "text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm",
                ORDER_STATUS_COLORS[order.orderStatus],
              )}
            >
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </span>
            {order._mock && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                Mock (DB unavailable)
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

        {/* Stats row: Total, Payment Method, Payment Status */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Total Amount */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide font-semibold">
              <IndianRupee className="size-3" />
              <span className="hidden sm:inline">Total Amount</span>
              <span className="sm:hidden">Total</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-[#1A6B3C] tabular-nums">
              {formatINR(order.total)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide font-semibold">
              <CreditCard className="size-3" />
              <span className="hidden sm:inline">Payment Method</span>
              <span className="sm:hidden">Method</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}
            </p>
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide font-semibold">
              <Sparkles className="size-3" />
              <span className="hidden sm:inline">Payment Status</span>
              <span className="sm:hidden">Status</span>
            </div>
            <span
              className={cn(
                "inline-block text-xs font-semibold px-2.5 py-1 rounded-full",
                PAYMENT_STATUS_COLORS[order.paymentStatus],
              )}
            >
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
