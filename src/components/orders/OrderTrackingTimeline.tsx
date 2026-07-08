"use client";

/**
 * GrowPlants — OrderTrackingTimeline
 *
 * 7-step fixed timeline:
 *   Placed → Confirmed → Processing → Packed → Shipped → Out For Delivery → Delivered
 *
 * Step states (getStepState):
 *   - completed       → green circle + checkmark (step index < currentIndex)
 *   - current         → primary color + glow pulse (step index === currentIndex)
 *   - upcoming        → grey circle (step index > currentIndex)
 *   - cancelled_step  → red circle with X (only when order is cancelled, applied to step 2)
 *
 * Layouts:
 *   - Desktop (md+): horizontal stepper — left to right with connecting lines
 *   - Mobile (<md):  vertical stepper — circles on left, connecting line vertical
 *
 * Special cases:
 *   - cancelled        → Step 1 = completed, Step 2 label becomes "Cancelled" with red X, rest = upcoming
 *   - unknown status   → fallback "Status: <label>" pill, no timeline
 *   - null/empty       → returns null
 */
import { CheckCircle2, Package, Box, Truck, Home, X, AlertCircle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import {
  ORDER_TIMELINE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type Order,
  type OrderStatus,
} from "@/contexts/OrdersContext";

type StepState = "completed" | "current" | "upcoming" | "cancelled_step";

// Icons for each step (by index in ORDER_TIMELINE)
const STEP_ICONS = [CheckCircle2, CheckCircle2, Package, Box, Truck, Truck, Home];

interface OrderTrackingTimelineProps {
  order: Order;
  /** Show step dates under labels when available in statusHistory */
  showDates?: boolean;
  /** Compact mode (smaller circles / tighter spacing) */
  compact?: boolean;
  className?: string;
}

/**
 * Compute current step index in the ORDER_TIMELINE.
 * Returns -1 if status is unknown / cancelled / not in timeline.
 */
export function getStepIndex(status: OrderStatus | undefined | null): number {
  if (!status) return -1;
  return ORDER_TIMELINE.findIndex((t) => t.status === status);
}

/**
 * Compute the state of a given step given the order's current status.
 *
 * Cancelled special case:
 *   - Step 0 (Placed)    → completed
 *   - Step 1 (Confirmed) → cancelled_step (label is overridden to "Cancelled")
 *   - Steps 2..6         → upcoming
 */
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

export function OrderTrackingTimeline({
  order,
  showDates = true,
  compact = false,
  className,
}: OrderTrackingTimelineProps) {
  const status = order.orderStatus;

  // null / empty → render nothing
  if (!status) return null;

  const isCancelled = status === "cancelled";
  const currentIndex = getStepIndex(status);

  // Unknown status fallback (status not in ORDER_TIMELINE and not cancelled)
  if (currentIndex < 0 && !isCancelled) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <AlertCircle className="size-4 text-slate-400" />
        <span className="text-slate-500">Status:</span>
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            ORDER_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700",
          )}
        >
          {ORDER_STATUS_LABELS[status] ?? status}
        </span>
      </div>
    );
  }

  const cancelledNote = isCancelled
    ? (order.statusHistory.find((s) => s.status === "cancelled")?.note ??
      "This order was cancelled after being placed.")
    : null;

  const circleSize = compact ? "size-7" : "size-8";
  const iconSize = compact ? "size-3.5" : "size-4";
  const labelSize = compact ? "text-[9px]" : "text-[10px]";

  return (
    <div className={cn("w-full", className)}>
      {/* Cancelled notice */}
      {isCancelled && cancelledNote && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="size-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 font-medium leading-relaxed">
            {cancelledNote}
          </p>
        </div>
      )}

      {/* ───────────── Desktop: Horizontal stepper (md+) ───────────── */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between gap-1">
          {ORDER_TIMELINE.map((step, i) => {
            const state = getStepState(i, currentIndex, isCancelled);
            const StepIcon = STEP_ICONS[i] ?? CheckCircle2;
            const isLast = i === ORDER_TIMELINE.length - 1;
            // Connector color: green when this step is completed (line to next step)
            const connectorActive = state === "completed";
            // Override label for cancelled_step (step 2)
            const displayLabel = state === "cancelled_step" ? "Cancelled" : step.label;
            // Step date from statusHistory
            const histEntry = order.statusHistory.find((s) => s.status === step.status);

            return (
              <div
                key={step.status}
                className="flex flex-col items-center gap-1.5 flex-1 relative min-w-0"
              >
                {/* Connector line (drawn from this step to next) */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute top-4 left-1/2 w-full h-0.5 transition-colors",
                      connectorActive ? "bg-[#1A6B3C]" : "bg-slate-200",
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Step circle */}
                <div
                  className={cn(
                    "relative z-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                    circleSize,
                    state === "completed" && "bg-[#1A6B3C] text-white",
                    state === "current" &&
                      "bg-[#1A6B3C] text-white ring-4 ring-[#1A6B3C]/20 animate-pulse-soft",
                    state === "upcoming" && "bg-slate-100 text-slate-400",
                    state === "cancelled_step" && "bg-red-500 text-white",
                  )}
                  aria-label={`${displayLabel} — ${state}`}
                >
                  {state === "cancelled_step" ? (
                    <X className={iconSize} />
                  ) : state === "completed" ? (
                    <CheckCircle2 className={iconSize} />
                  ) : (
                    <StepIcon className={iconSize} />
                  )}
                </div>

                {/* Step label */}
                <p
                  className={cn(
                    "text-center font-medium leading-tight",
                    labelSize,
                    state === "completed" && "text-slate-800",
                    state === "current" && "text-[#1A6B3C] font-semibold",
                    state === "upcoming" && "text-slate-400",
                    state === "cancelled_step" && "text-red-600 font-semibold",
                  )}
                >
                  {displayLabel}
                </p>

                {/* Step date (optional) */}
                {showDates && histEntry && state === "completed" && (
                  <p className="text-[9px] text-slate-400 text-center leading-tight">
                    {formatDate(histEntry.date)}
                  </p>
                )}
                {showDates && state === "current" && histEntry && (
                  <p className="text-[9px] text-[#1A6B3C]/70 text-center leading-tight font-medium">
                    {formatDate(histEntry.date)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────── Mobile: Vertical stepper (<md) ───────────── */}
      <div className="md:hidden">
        <ol className="relative pl-1">
          {/* Vertical connector line (absolute, behind circles) */}
          <div
            className="absolute left-[14px] top-2 bottom-2 w-0.5 bg-slate-200"
            aria-hidden="true"
          />
          {ORDER_TIMELINE.map((step, i) => {
            const state = getStepState(i, currentIndex, isCancelled);
            const StepIcon = STEP_ICONS[i] ?? CheckCircle2;
            const displayLabel = state === "cancelled_step" ? "Cancelled" : step.label;
            const histEntry = order.statusHistory.find((s) => s.status === step.status);
            const isLast = i === ORDER_TIMELINE.length - 1;

            return (
              <li key={step.status} className="relative flex items-start gap-3 pb-4 last:pb-0">
                {/* Circle (sits on top of vertical line) */}
                <div
                  className={cn(
                    "relative z-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                    "size-7",
                    state === "completed" && "bg-[#1A6B3C] text-white",
                    state === "current" &&
                      "bg-[#1A6B3C] text-white ring-4 ring-[#1A6B3C]/20 animate-pulse-soft",
                    state === "upcoming" && "bg-slate-100 text-slate-400",
                    state === "cancelled_step" && "bg-red-500 text-white",
                  )}
                  aria-label={`${displayLabel} — ${state}`}
                >
                  {state === "cancelled_step" ? (
                    <X className="size-3.5" />
                  ) : state === "completed" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <StepIcon className="size-3.5" />
                  )}
                </div>

                {/* Label + date */}
                <div className={cn("flex-1 pt-0.5", isLast && "pb-0")}>
                  <p
                    className={cn(
                      "text-xs font-medium leading-tight",
                      state === "completed" && "text-slate-800",
                      state === "current" && "text-[#1A6B3C] font-semibold",
                      state === "upcoming" && "text-slate-400",
                      state === "cancelled_step" && "text-red-600 font-semibold",
                    )}
                  >
                    {displayLabel}
                    {state === "current" && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#1A6B3C]/10 text-[#1A6B3C] text-[9px] font-bold uppercase tracking-wide">
                        Current
                      </span>
                    )}
                    {state === "cancelled_step" && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wide">
                        Cancelled
                      </span>
                    )}
                  </p>
                  {showDates && histEntry && (state === "completed" || state === "current") && (
                    <p
                      className={cn(
                        "text-[10px] mt-0.5 leading-tight",
                        state === "current" ? "text-[#1A6B3C]/70 font-medium" : "text-slate-400",
                      )}
                    >
                      {formatDate(histEntry.date)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
