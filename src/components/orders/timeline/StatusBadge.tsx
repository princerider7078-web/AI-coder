"use client";

/**
 * StatusBadge — Pill-shaped status indicator.
 * Used in summary cards, headers, and banners.
 *
 * Variants match the OrderStatus colors. Each has a colored dot + label.
 */
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  type OrderStatus,
  type PaymentStatus,
} from "@/contexts/OrdersContext";

export interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus;
  /** "order" or "payment" — determines which label/color map to use */
  kind?: "order" | "payment";
  size?: "sm" | "md" | "lg";
  /** Show pulsing dot for current/active statuses */
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  kind = "order",
  size = "md",
  pulse = false,
  className,
}: StatusBadgeProps) {
  const label =
    kind === "order"
      ? ORDER_STATUS_LABELS[status as OrderStatus] ?? status
      : PAYMENT_STATUS_LABELS[status as PaymentStatus] ?? status;
  const color =
    kind === "order"
      ? ORDER_STATUS_COLORS[status as OrderStatus] ?? "bg-slate-100 text-slate-700"
      : PAYMENT_STATUS_COLORS[status as PaymentStatus] ?? "bg-slate-100 text-slate-700";

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold border",
        color,
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label={`${kind} status: ${label}`}
    >
      <span
        className={cn(
          "size-1.5 rounded-full bg-current",
          pulse && "animate-pulse",
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
