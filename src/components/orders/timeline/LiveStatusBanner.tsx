"use client";

/**
 * LiveStatusBanner — Highlighted status banner at the top of the timeline.
 *
 * Example:
 *   📦 Your order has been shipped.
 *   Expected delivery: Tomorrow between 10:00 AM – 2:00 PM
 *
 * Variants:
 *   - default (current status): brand green background, current icon
 *   - delivered: green success background, checkmark
 *   - cancelled: red background, X icon
 *   - delayed: amber background, clock icon
 */
import { CheckCircle2, X, Clock, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatus,
} from "@/contexts/OrdersContext";
import { getCurrentStage, getEstimatedDelivery } from "./stages";

export interface LiveStatusBannerProps {
  order: Order;
  className?: string;
}

interface BannerConfig {
  icon: LucideIcon;
  emoji: string;
  headline: string;
  subline?: string;
  variant: "default" | "delivered" | "cancelled" | "delayed";
}

function getBannerConfig(order: Order): BannerConfig {
  const currentStage = getCurrentStage(order);
  const eta = getEstimatedDelivery(order);

  if (order.orderStatus === "delivered") {
    return {
      icon: CheckCircle2,
      emoji: "✅",
      headline: "Your order has been delivered.",
      subline: order.tracking?.deliveredAt
        ? `Delivered on ${new Date(order.tracking.deliveredAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
        : "Enjoy your plants!",
      variant: "delivered",
    };
  }

  if (order.orderStatus === "cancelled") {
    return {
      icon: X,
      emoji: "❌",
      headline: "Your order was cancelled.",
      subline: order.statusHistory?.find((s) => s.status === "cancelled")?.note ?? "If you have questions, please contact support.",
      variant: "cancelled",
    };
  }

  if (order.orderStatus === "on_hold" || order.orderStatus === "failed") {
    return {
      icon: Clock,
      emoji: "⏳",
      headline: order.orderStatus === "failed" ? "Order processing failed." : "Your order is on hold.",
      subline: "Our team will reach out shortly. For urgent help, contact support.",
      variant: "delayed",
    };
  }

  // Default — current stage
  return {
    icon: currentStage?.icon ?? Sparkles,
    emoji: "📦",
    headline: currentStage
      ? `Your order ${getStageVerb(order.orderStatus)}.`
      : `Status: ${ORDER_STATUS_LABELS[order.orderStatus]}`,
    subline: currentStage?.description ?? undefined,
    variant: "default",
  };
}

function getStageVerb(status: OrderStatus): string {
  const verbs: Partial<Record<OrderStatus, string>> = {
    pending: "has been placed",
    payment_confirmed: "payment is confirmed",
    confirmed: "is confirmed",
    processing: "is being prepared",
    quality_inspection: "is undergoing quality inspection",
    packed: "is packed",
    shipped: "has been shipped",
    out_for_delivery: "is out for delivery",
  };
  return verbs[status] ?? "is in progress";
}

export function LiveStatusBanner({ order, className }: LiveStatusBannerProps) {
  const config = getBannerConfig(order);
  const eta = getEstimatedDelivery(order);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 md:p-6 border transition-all duration-300",
        "animate-banner-enter",
        config.variant === "default" && "bg-gradient-to-br from-[#F3F8F1] to-[#DDF5E0] border-[#1A6B3C]/20",
        config.variant === "delivered" && "bg-gradient-to-br from-green-50 to-emerald-100 border-green-300",
        config.variant === "cancelled" && "bg-gradient-to-br from-red-50 to-rose-100 border-red-300",
        config.variant === "delayed" && "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={`Order status: ${config.headline}`}
    >
      {/* Decorative botanical leaf pattern (background) */}
      <div
        className="absolute -right-4 -top-4 size-32 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, currentColor 0%, transparent 70%)",
          color: config.variant === "cancelled" ? "#dc2626" : "#1A6B3C",
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            "size-12 md:size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
            config.variant === "default" && "bg-[#1A6B3C] text-white",
            config.variant === "delivered" && "bg-green-600 text-white",
            config.variant === "cancelled" && "bg-red-500 text-white",
            config.variant === "delayed" && "bg-amber-500 text-white",
          )}
        >
          <Icon className="size-6 md:size-7" strokeWidth={2.2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-bold text-slate-800 leading-tight">
            {config.headline}
          </h2>
          {config.subline && (
            <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
              {config.subline}
            </p>
          )}
          {eta && order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
            <p className="text-xs md:text-sm text-[#1A6B3C] font-semibold mt-2 flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>
                Expected delivery: <span className="font-bold">{eta}</span>
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
