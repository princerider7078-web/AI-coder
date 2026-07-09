"use client";

/**
 * LiveStatusBanner — Highlighted banner at the top of the tracking section.
 *
 * Answers "where is my order now?" in one glance.
 * Includes: status emoji/icon, headline, ETA.
 */
import { cn } from "@/lib/utils";
import { Truck, MapPin, CheckCircle2, Package, AlertCircle, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Order } from "@/contexts/OrdersContext";
import { ORDER_STATUS_LABELS } from "@/contexts/OrdersContext";

interface LiveStatusBannerProps {
  order: Order;
  /** Estimated delivery window, e.g. "Tomorrow between 10:00 AM – 2:00 PM" */
  estimatedDelivery?: string;
  className?: string;
}

interface BannerConfig {
  icon: LucideIcon;
  headline: string;
  subtext?: string;
  bgClass: string;
  iconBgClass: string;
  iconColor: string;
}

function getBannerConfig(order: Order, eta?: string): BannerConfig {
  const status = order.orderStatus;
  const base: BannerConfig = {
    icon: Package,
    headline: "Order placed",
    subtext: "We've received your order and will confirm shortly.",
    bgClass: "bg-[#F3F8F1] border-[#1A6B3C]/20",
    iconBgClass: "bg-[#1A6B3C]/10",
    iconColor: "text-[#1A6B3C]",
  };

  switch (status) {
    case "pending":
      return {
        ...base,
        icon: Package,
        headline: "Order placed successfully",
        subtext: "Awaiting confirmation from our team.",
      };
    case "confirmed":
      return {
        ...base,
        icon: CheckCircle2,
        headline: "Order confirmed",
        subtext: "Our team is preparing your plants with care.",
      };
    case "processing":
      return {
        ...base,
        icon: Package,
        headline: "Preparing your plants",
        subtext: "Your order is being carefully prepared for dispatch.",
      };
    case "packed":
      return {
        ...base,
        icon: Package,
        headline: "Quality check complete",
        subtext: "Your plants have passed inspection and are packed safely.",
      };
    case "shipped":
      return {
        ...base,
        icon: Truck,
        headline: "Your order has been shipped",
        subtext: eta
          ? `Expected delivery: ${eta}`
          : "Your package is on its way to you.",
      };
    case "out_for_delivery":
      return {
        ...base,
        icon: MapPin,
        headline: "Out for delivery",
        subtext: eta
          ? `Expected arrival: ${eta}`
          : "Your package will reach you today.",
        bgClass: "bg-orange-50 border-orange-200",
        iconBgClass: "bg-orange-100",
        iconColor: "text-orange-600",
      };
    case "delivered":
      return {
        ...base,
        icon: CheckCircle2,
        headline: "Delivered successfully",
        subtext: "Your order has been delivered. Enjoy your plants!",
        bgClass: "bg-green-50 border-green-200",
        iconBgClass: "bg-green-100",
        iconColor: "text-green-600",
      };
    case "cancelled":
      return {
        ...base,
        icon: AlertCircle,
        headline: "Order cancelled",
        subtext: "This order has been cancelled.",
        bgClass: "bg-red-50 border-red-200",
        iconBgClass: "bg-red-100",
        iconColor: "text-red-600",
      };
    default:
      return base;
  }
}

export function LiveStatusBanner({
  order,
  estimatedDelivery,
  className,
}: LiveStatusBannerProps) {
  const config = getBannerConfig(order, estimatedDelivery);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 flex items-start gap-3 sm:gap-4",
        "transition-all duration-300 hover:shadow-md",
        config.bgClass,
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={`Current status: ${ORDER_STATUS_LABELS[order.orderStatus]}`}
    >
      {/* Icon */}
      <div
        className={cn(
          "size-11 sm:size-12 rounded-xl flex items-center justify-center shrink-0",
          config.iconBgClass,
        )}
      >
        <Icon className={cn("size-5 sm:size-6", config.iconColor)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-sm sm:text-base font-bold text-slate-800">
            {config.headline}
          </h2>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            LIVE
          </span>
        </div>
        {config.subtext && (
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
            {config.subtext}
          </p>
        )}
        {estimatedDelivery &&
          (order.orderStatus === "shipped" ||
            order.orderStatus === "out_for_delivery") && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs font-medium text-slate-700">
              <Clock className="size-3.5" aria-hidden="true" />
              {estimatedDelivery}
            </div>
          )}
      </div>
    </div>
  );
}
