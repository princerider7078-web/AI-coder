"use client";

/**
 * DeliveryProgressCard — Premium progress card.
 *
 * Shows:
 *   - Circular progress ring with %
 *   - Current step name
 *   - Expected next step
 *   - Estimated delivery date
 *   - Expected delivery time window
 */
import { cn } from "@/lib/utils";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import type { Order } from "@/contexts/OrdersContext";
import {
  TIMELINE_STAGES,
  getTimelineStageIndex,
  getProgressPercentage,
} from "./timeline-stages";
import { formatINR, formatDate } from "@/lib/utils";

interface DeliveryProgressCardProps {
  order: Order;
  /** Estimated delivery date (ISO or formatted string) */
  estimatedDeliveryDate?: string;
  /** Expected delivery time window, e.g. "10:00 AM – 2:00 PM" */
  estimatedDeliveryWindow?: string;
  className?: string;
}

export function DeliveryProgressCard({
  order,
  estimatedDeliveryDate,
  estimatedDeliveryWindow,
  className,
}: DeliveryProgressCardProps) {
  const currentIndex = getTimelineStageIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";
  const isDelivered = order.orderStatus === "delivered";
  const progress = isCancelled ? 0 : getProgressPercentage(currentIndex, TIMELINE_STAGES.length);

  const currentStage = currentIndex >= 0 ? TIMELINE_STAGES[currentIndex] : null;
  const nextStage =
    currentIndex >= 0 && currentIndex < TIMELINE_STAGES.length - 1
      ? TIMELINE_STAGES[currentIndex + 1]
      : null;

  // Compute ETA: 3 days from order date if not provided
  const eta = estimatedDeliveryDate ?? computeDefaultETA(order.createdAt);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm",
        "hover:shadow-md transition-shadow duration-300",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="size-4 text-[#E8930A]" aria-hidden="true" />
          Delivery Progress
        </h3>
        {!isCancelled && (
          <span
            className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full",
              isDelivered
                ? "bg-green-100 text-green-700"
                : progress > 50
                  ? "bg-[#1A6B3C]/10 text-[#1A6B3C]"
                  : "bg-amber-100 text-amber-700",
            )}
          >
            {progress}%
          </span>
        )}
      </div>

      {/* Circular progress + current step */}
      <div className="flex items-center gap-4 mb-4">
        <ProgressRing
          percentage={progress}
          isCancelled={isCancelled}
          isDelivered={isDelivered}
        />
        <div className="flex-1 min-w-0">
          {isCancelled ? (
            <>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Status
              </p>
              <p className="text-base font-bold text-red-600 mt-0.5">Order Cancelled</p>
              <p className="text-xs text-slate-500 mt-1">
                No delivery will be attempted.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Current Step
              </p>
              <p className="text-base font-bold text-[#1A6B3C] mt-0.5 truncate">
                {currentStage?.label ?? "Processing"}
              </p>
              {nextStage && (
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <span>Next:</span>
                  <span className="font-medium text-slate-700">{nextStage.label}</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </div>
              )}
              {isDelivered && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  All steps completed
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ETA row */}
      {!isCancelled && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar className="size-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide font-semibold">
                {isDelivered ? "Delivered" : "Est. Delivery"}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {formatDate(eta)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Clock className="size-3.5" aria-hidden="true" />
              <span className="uppercase tracking-wide font-semibold">Time Window</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {isDelivered
                ? "Completed"
                : estimatedDeliveryWindow ?? "10:00 AM – 6:00 PM"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Circular Progress Ring ---------- */

function ProgressRing({
  percentage,
  isCancelled,
  isDelivered,
}: {
  percentage: number;
  isCancelled: boolean;
  isDelivered: boolean;
}) {
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const ringColor = isCancelled
    ? "#EF4444"
    : isDelivered
      ? "#22C55E"
      : "#1A6B3C";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-sm font-bold"
          style={{ color: ringColor }}
        >
          {isCancelled ? "—" : `${percentage}%`}
        </span>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function computeDefaultETA(createdAtIso: string): string {
  const d = new Date(createdAtIso);
  d.setDate(d.getDate() + 3); // 3-day default ETA
  return d.toISOString();
}
