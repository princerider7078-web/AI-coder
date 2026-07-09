"use client";

/**
 * DeliveryProgressCard — Beautiful progress card showing:
 *   - Progress Percentage (animated bar)
 *   - Current Step label
 *   - Expected Next Step label
 *   - Estimated Delivery Date + Time
 *
 * Botanical-themed: leaf accent on the progress bar.
 */
import { Sparkles, TrendingUp, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/contexts/OrdersContext";
import {
  computeProgress,
  getCurrentStage,
  getNextStage,
  getEstimatedDelivery,
} from "./stages";

export interface DeliveryProgressCardProps {
  order: Order;
  className?: string;
}

export function DeliveryProgressCard({ order, className }: DeliveryProgressCardProps) {
  const percent = computeProgress(order);
  const current = getCurrentStage(order);
  const next = getNextStage(order);
  const eta = getEstimatedDelivery(order);
  const isDelivered = order.orderStatus === "delivered";
  const isCancelled = order.orderStatus === "cancelled";

  // Split ETA into date + time if possible
  const etaParts = eta?.split(" · ") ?? [];
  const etaDate = etaParts[0] ?? eta ?? "—";
  const etaTime = etaParts[1] ?? "10:00 AM – 2:00 PM";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-sm hover-lift",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center">
            <TrendingUp className="size-4 text-[#1A6B3C]" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Delivery Progress</h3>
        </div>
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            isDelivered ? "text-green-600" : isCancelled ? "text-red-500" : "text-[#1A6B3C]",
          )}
        >
          {percent}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Order delivery progress"
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
            isDelivered
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : isCancelled
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : "bg-gradient-to-r from-[#1A6B3C] via-[#43A047] to-[#5ABB59]",
          )}
          style={{ width: `${percent}%` }}
        >
          {/* Shimmer overlay on the filled portion */}
          {!isDelivered && !isCancelled && percent > 0 && percent < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-x" />
          )}
        </div>

        {/* Leaf icon at the progress tip (when in progress) */}
        {!isDelivered && !isCancelled && percent > 5 && percent < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{ left: `calc(${percent}% - 8px)` }}
            aria-hidden="true"
          >
            <Sparkles className="size-3 text-[#1A6B3C]" />
          </div>
        )}
      </div>

      {/* Current + Next step row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-[#F3F8F1] p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#1A6B3C]/70 mb-1">
            Current Step
          </p>
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            {isDelivered
              ? "Delivered"
              : isCancelled
                ? "Cancelled"
                : current?.label ?? "Processing"}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-1">
            Next Step
          </p>
          <p className="text-xs font-semibold text-slate-600 leading-tight">
            {isDelivered
              ? "✅ Complete"
              : isCancelled
                ? "—"
                : next?.label ?? "Final step"}
          </p>
        </div>
      </div>

      {/* ETA row */}
      {!isCancelled && (
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-1">
            <Calendar className="size-3.5 text-slate-400" aria-hidden="true" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Est. Delivery</p>
              <p className="text-xs font-semibold text-slate-700">{etaDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-1">
            <Clock className="size-3.5 text-slate-400" aria-hidden="true" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Time Window</p>
              <p className="text-xs font-semibold text-slate-700">{isDelivered ? "Delivered" : etaTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
