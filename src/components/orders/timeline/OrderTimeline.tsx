"use client";

/**
 * GrowPlants — OrderTimeline (Orchestrator)
 * ============================================================================
 * Premium 9-stage order tracking timeline. Composes:
 *   - LiveStatusBanner         (top)
 *   - DeliveryProgressCard     (top-right on desktop)
 *   - Timeline steps (9)       (horizontal desktop, vertical mobile)
 *   - TrackingSummaryCard      (bottom)
 *
 * State handling:
 *   - loading  → <TrackingSkeleton />
 *   - error    → <TrackingErrorState /> with retry
 *   - empty    → <TrackingEmptyState /> (no orderStatus or pending without history)
 *   - normal   → full premium UI
 *
 * Real-time:
 *   When the parent passes a new `order` object (from Firestore onSnapshot),
 *   all derived state (currentStep, progress, stepStates) recomputes via pure
 *   functions in stages.ts, and CSS transitions animate the changes.
 * ============================================================================
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Order } from "@/contexts/OrdersContext";
import {
  buildStepStates,
  getCurrentStageIndex,
} from "./stages";
import type { OrderTimelineProps } from "./types";
import { LiveStatusBanner } from "./LiveStatusBanner";
import { DeliveryProgressCard } from "./DeliveryProgressCard";
import { TrackingSummaryCard } from "./TrackingSummaryCard";
import { TimelineStep } from "./TimelineStep";
import { TimelineConnector } from "./TimelineConnector";
import { TrackingSkeleton } from "./TrackingSkeleton";
import { TrackingEmptyState } from "./TrackingEmptyState";
import { TrackingErrorState } from "./TrackingErrorState";

export function OrderTimeline({
  order,
  loading = false,
  error = null,
  onRetry,
  showBanner = true,
  showProgressCard = true,
  showSummaryCard = true,
  layout = "auto",
  compact = false,
  className,
}: OrderTimelineProps) {
  // Track mount for entrance animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ---------- State: loading ---------- */
  if (loading) {
    return <TrackingSkeleton variant="full" className={className} />;
  }

  /* ---------- State: error ---------- */
  if (error) {
    return (
      <TrackingErrorState
        message={error}
        onRetry={onRetry}
        onContactSupport={() => (window.location.href = "/contact")}
        className={className}
      />
    );
  }

  /* ---------- State: empty (no order or pending without history) ---------- */
  if (!order || (!order.orderStatus && !order.statusHistory?.length)) {
    return (
      <TrackingEmptyState
        orderNumber={order?.orderNumber}
        className={className}
      />
    );
  }

  /* ---------- Normal state ---------- */
  const stepStates = buildStepStates(order);
  const currentIndex = getCurrentStageIndex(order);
  const isCancelled = order.orderStatus === "cancelled";

  // Determine layout: 'auto' → responsive (horizontal desktop, vertical mobile)
  const isAutoLayout = layout === "auto";

  return (
    <div className={cn("space-y-4 md:space-y-5", className)}>
      {/* ─────────── Top: Banner + Progress Card ─────────── */}
      {(showBanner || showProgressCard) && (
        <div
          className={cn(
            "grid gap-4",
            showBanner && showProgressCard
              ? "md:grid-cols-[1.6fr_1fr]"
              : "grid-cols-1",
          )}
        >
          {showBanner && <LiveStatusBanner order={order} />}
          {showProgressCard && <DeliveryProgressCard order={order} />}
        </div>
      )}

      {/* ─────────── Timeline (9 steps) ─────────── */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-800">Tracking Timeline</h2>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] text-slate-500 font-medium">Live</span>
          </div>
        </div>

        {/* Cancelled notice (if applicable) */}
        {isCancelled && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <span className="text-red-500 text-sm" aria-hidden="true">⚠️</span>
            <p className="text-xs text-red-700 font-medium leading-relaxed">
              This order was cancelled after being placed.{" "}
              {order.statusHistory?.find((s) => s.status === "cancelled")?.note && (
                <span className="text-red-600/80">
                  Reason: {order.statusHistory.find((s) => s.status === "cancelled")?.note}
                </span>
              )}
            </p>
          </div>
        )}

        {/* ───── Desktop: Horizontal timeline ───── */}
        {(isAutoLayout || layout === "horizontal") && (
          <div className="hidden md:block" role="list" aria-label="Order tracking timeline">
            <div className="flex items-start justify-between gap-1">
              {stepStates.map((stepState, i) => (
                <div
                  key={stepState.stage.id}
                  className="flex items-start flex-1 min-w-0"
                >
                  {/* Step (icon + label) */}
                  <TimelineStep
                    stepState={stepState}
                    order={order}
                    orientation="horizontal"
                    compact={compact}
                    showFields={false}
                    showDate={!compact}
                    animationDelay={mounted ? i * 50 : 0}
                    className="flex-1"
                  />
                  {/* Connector (except after the last step) */}
                  {i < stepStates.length - 1 && (
                    <TimelineConnector
                      state={stepState.state}
                      orientation="horizontal"
                      length="w-4 md:w-6"
                      className="mt-5"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Display fields for current step (below the timeline, full width) */}
            {currentIndex >= 0 && stepStates[currentIndex]?.stage.displayFields && (
              <CurrentStepDetailCard stepState={stepStates[currentIndex]} order={order} />
            )}
          </div>
        )}

        {/* ───── Mobile: Vertical timeline ───── */}
        {(isAutoLayout || layout === "vertical") && (
          <div className="md:hidden" role="list" aria-label="Order tracking timeline">
            <ol className="relative">
              {/* Vertical connector line (absolute, behind icons) */}
              <div
                className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-200"
                aria-hidden="true"
              />
              {stepStates.map((stepState, i) => (
                <li
                  key={stepState.stage.id}
                  className="relative flex items-start gap-3 pb-5 last:pb-0"
                >
                  <TimelineStep
                    stepState={stepState}
                    order={order}
                    orientation="vertical"
                    compact={compact}
                    showFields
                    showDate
                    animationDelay={mounted ? i * 50 : 0}
                  />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* ─────────── Summary Card ─────────── */}
      {showSummaryCard && <TrackingSummaryCard order={order} />}
    </div>
  );
}

/* ============================================================================
 * CurrentStepDetailCard — Inline detail card for the current step on desktop.
 * Shows display fields (courier, tracking#, driver, etc.) below the timeline.
 * ============================================================================ */
function CurrentStepDetailCard({
  stepState,
  order,
}: {
  stepState: ReturnType<typeof buildStepStates>[number];
  order: Order;
}) {
  const { stage } = stepState;
  const fields = stage.displayFields?.(order) ?? [];
  if (fields.length === 0) return null;

  return (
    <div className="mt-5 p-4 rounded-xl bg-[#F3F8F1] border border-[#1A6B3C]/10">
      <div className="flex items-center gap-2 mb-3">
        <stage.icon className="size-4 text-[#1A6B3C]" />
        <h3 className="text-xs font-bold text-slate-800">{stage.label} — Details</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {fields.map((field, i) => (
          <div key={i} className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 leading-tight">
              {field.label}
            </p>
            <p className="text-xs font-semibold text-slate-800 truncate">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
