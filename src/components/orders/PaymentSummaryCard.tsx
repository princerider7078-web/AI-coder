"use client";

/**
 * GrowPlants — PaymentSummaryCard
 * ============================================================================
 * Premium payment summary card showing:
 *   - Payment method (COD / Razorpay) with icon
 *   - Payment status badge (paid / pending / refunded / failed)
 *   - Transaction ID (if available)
 *   - Price breakdown: Subtotal, Discount, Delivery, Tax, Total
 *
 * Features:
 *   - Color-coded status badge
 *   - Clean breakdown with dividers
 *   - Prominent total amount
 *   - Hover elevation
 * ============================================================================
 */
import { cn, formatINR } from "@/lib/utils";
import {
  CreditCard, Wallet, Banknote, CheckCircle2, Clock, XCircle, RefreshCw, IndianRupee,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  type Order,
  type PaymentStatus,
} from "@/contexts/OrdersContext";

interface PaymentSummaryCardProps {
  order: Order;
  /** Optional transaction ID (from Razorpay) */
  transactionId?: string;
  className?: string;
}

/* Payment method config */
const PAYMENT_METHOD_CONFIG = {
  cod: {
    icon: Banknote,
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  razorpay: {
    icon: Wallet,
    label: "Online Payment",
    description: "Paid via Razorpay (UPI / Card / Net Banking)",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
} as const;

/* Payment status icon config */
const PAYMENT_STATUS_ICON: Record<PaymentStatus, typeof CheckCircle2> = {
  pending: Clock,
  paid: CheckCircle2,
  failed: XCircle,
  refunded: RefreshCw,
  partial_refund: RefreshCw,
};

export function PaymentSummaryCard({
  order,
  transactionId,
  className,
}: PaymentSummaryCardProps) {
  const methodConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod] ?? PAYMENT_METHOD_CONFIG.cod;
  const StatusIcon = PAYMENT_STATUS_ICON[order.paymentStatus] ?? Clock;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-5 sm:p-6 pb-3">
        <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center">
          <CreditCard className="size-4 text-[#1A6B3C]" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">
          Payment Details
        </h3>
      </div>

      <Separator />

      <div className="p-5 sm:p-6 pt-4 space-y-4">
        {/* Payment method + status */}
        <div className="flex items-start justify-between gap-3">
          {/* Method */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", methodConfig.bg)}>
              <methodConfig.icon className={cn("size-5", methodConfig.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {methodConfig.label}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {methodConfig.description}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
                PAYMENT_STATUS_COLORS[order.paymentStatus],
              )}
            >
              <StatusIcon className="size-3" />
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
            {transactionId && (
              <span className="text-[10px] text-slate-400 font-mono">
                {transactionId}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Price breakdown */}
        <div className="space-y-2.5">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Items Subtotal</span>
            <span className="font-medium text-slate-800 tabular-nums">
              {formatINR(order.subtotal)}
            </span>
          </div>

          {/* Discount */}
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount</span>
              <span className="font-medium text-green-600 tabular-nums">
                −{formatINR(order.discount)}
              </span>
            </div>
          )}

          {/* Delivery fee */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Delivery Fee</span>
            <span className="font-medium text-slate-800 tabular-nums">
              {order.shipping === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                formatINR(order.shipping)
              )}
            </span>
          </div>

          {/* Tax (if any) */}
          {order.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Taxes & Fees</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {formatINR(order.tax)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IndianRupee className="size-4 text-[#1A6B3C]" />
            <span className="text-sm sm:text-base font-bold text-slate-800">
              Total Amount
            </span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-[#1A6B3C] tabular-nums">
            {formatINR(order.total)}
          </span>
        </div>

        {/* Payment note for COD */}
        {order.paymentMethod === "cod" && order.paymentStatus === "pending" && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Banknote className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Please keep <span className="font-bold">{formatINR(order.total)}</span> ready for cash payment on delivery.
            </p>
          </div>
        )}

        {/* Payment note for refunded */}
        {order.paymentStatus === "refunded" && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <RefreshCw className="size-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Refund of <span className="font-bold">{formatINR(order.total)}</span> has been processed. It will reflect in your account within 5-7 business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
