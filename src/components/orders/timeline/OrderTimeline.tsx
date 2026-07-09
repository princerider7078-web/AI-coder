"use client";

/**
 * OrderTimeline — Main orchestrator component.
 *
 * Renders the complete tracking experience:
 *   1. LiveStatusBanner (top)
 *   2. Timeline (horizontal on desktop, vertical on mobile)
 *   3. DeliveryProgressCard + TrackingSummaryCard (grid below)
 *
 * Handles loading/empty/error states via child components.
 * All data is derived from the `order` prop — no internal state.
 */
import { cn, formatDate } from "@/lib/utils";
import type { Order } from "@/contexts/OrdersContext";
import {
  TIMELINE_STAGES,
  getTimelineStageIndex,
  getStepState,
  type StepState,
} from "./timeline-stages";
import { TimelineStep } from "./TimelineStep";
import { TimelineConnector } from "./TimelineConnector";
import { LiveStatusBanner } from "./LiveStatusBanner";
import { DeliveryProgressCard } from "./DeliveryProgressCard";
import { TrackingSummaryCard } from "./TrackingSummaryCard";

interface OrderTimelineProps {
  order: Order;
  /** Per-stage metadata (courier, tracking #, etc.) keyed by stage.id */
  stageDetails?: Record<string, Record<string, string>>;
  /** Tracking number from courier */
  trackingNumber?: string;
  /** Courier partner name */
  courierPartner?: string;
  /** Estimated delivery date (ISO or formatted) */
  estimatedDeliveryDate?: string;
  /** Estimated delivery time window */
  estimatedDeliveryWindow?: string;
  className?: string;
}

export function OrderTimeline({
  order,
  stageDetails,
  trackingNumber,
  courierPartner,
  estimatedDeliveryDate,
  estimatedDeliveryWindow,
  className,
}: OrderTimelineProps) {
  const currentIndex = getTimelineStageIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  // Build ETA string for live banner
  const etaString =
    estimatedDeliveryDate && estimatedDeliveryWindow
      ? `${formatDate(estimatedDeliveryDate)} between ${estimatedDeliveryWindow}`
      : estimatedDeliveryDate
        ? formatDate(estimatedDeliveryDate)
        : undefined;

  return (
    <div className={cn("space-y-4", className)}>
      {/* 1. LIVE STATUS BANNER */}
      <LiveStatusBanner order={order} estimatedDelivery={etaString} />

      {/* 2. TIMELINE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-800">Order Journey</h3>
          {!isCancelled && currentIndex >= 0 && (
            <span className="text-xs text-slate-500">
              Step{" "}
              <span className="font-bold text-[#1A6B3C]">{currentIndex + 1}</span>{" "}
              of {TIMELINE_STAGES.length}
            </span>
          )}
        </div>

        {/* Desktop: horizontal timeline */}
        <div
          className="hidden md:flex items-start justify-between gap-1"
          role="list"
          aria-label="Order tracking timeline"
        >
          {TIMELINE_STAGES.map((stage, i) => {
            const state: StepState = getStepState(i, currentIndex, isCancelled);
            const stageData = stageDetails?.[stage.id];
            const timestamp = getStageTimestamp(order, stage.status);
            return (
              <div key={stage.id} className="flex items-start flex-1 min-w-0">
                <TimelineStep
                  stage={stage}
                  state={state}
                  details={stageData}
                  timestamp={timestamp}
                  formatDate={formatDate}
                  index={i}
                />
                {i < TIMELINE_STAGES.length - 1 && (
                  <TimelineConnector
                    orientation="horizontal"
                    state={state === "completed" ? "completed" : "upcoming"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical timeline */}
        <div
          className="md:hidden relative"
          role="list"
          aria-label="Order tracking timeline"
        >
          {/* Vertical connector line (background) */}
          <div
            className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-slate-200"
            aria-hidden="true"
          />
          {TIMELINE_STAGES.map((stage, i) => {
            const state: StepState = getStepState(i, currentIndex, isCancelled);
            const stageData = stageDetails?.[stage.id];
            const timestamp = getStageTimestamp(order, stage.status);
            return (
              <TimelineStep
                key={stage.id}
                stage={stage}
                state={state}
                details={stageData}
                timestamp={timestamp}
                formatDate={formatDate}
                index={i}
                isLast={i === TIMELINE_STAGES.length - 1}
              />
            );
          })}
        </div>
      </div>

      {/* 3. PROGRESS + SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeliveryProgressCard
          order={order}
          estimatedDeliveryDate={estimatedDeliveryDate}
          estimatedDeliveryWindow={estimatedDeliveryWindow}
        />
        <TrackingSummaryCard
          order={order}
          trackingNumber={trackingNumber}
          courierPartner={courierPartner}
          estimatedDelivery={estimatedDeliveryDate}
        />
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

/**
 * Find the timestamp for a given stage by looking up the order's statusHistory.
 * Falls back to order.createdAt for the first step.
 */
function getStageTimestamp(
  order: Order,
  status: string | null,
): string | undefined {
  if (!status) return undefined;
  const entry = order.statusHistory.find((h) => h.status === status);
  return entry?.date ?? (status === "pending" ? order.createdAt : undefined);
}
