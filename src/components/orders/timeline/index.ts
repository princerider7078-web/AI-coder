/**
 * GrowPlants — Order Timeline Component Library
 * ============================================================================
 * Premium, production-quality order tracking timeline.
 *
 * Public API:
 *   <OrderTimeline />          — main orchestrator (use this)
 *   <LiveStatusBanner />       — top status banner
 *   <DeliveryProgressCard />   — progress % + ETA
 *   <TrackingSummaryCard />    — order/tracking/address/payment info
 *   <TimelineStep />           — individual step
 *   <TimelineIcon />           — icon with state-driven styling
 *   <TimelineConnector />      — animated connector line
 *   <StatusBadge />            — status pill
 *   <TrackingSkeleton />       — loading state
 *   <TrackingEmptyState />     — empty state
 *   <TrackingErrorState />     — error state
 *
 * Pure helpers (stages.ts):
 *   buildStepStates(order)     — derive all step states from order
 *   computeProgress(order)     — 0-100 progress %
 *   getCurrentStage(order)     — current TimelineStage | null
 *   getNextStage(order)        — next TimelineStage | null
 *   getEstimatedDelivery(order)— ETA string
 *   TIMELINE_STAGES            — 9-stage config (data-driven, future-ready)
 * ============================================================================
 */
export { OrderTimeline } from "./OrderTimeline";
export { LiveStatusBanner } from "./LiveStatusBanner";
export { DeliveryProgressCard } from "./DeliveryProgressCard";
export { TrackingSummaryCard } from "./TrackingSummaryCard";
export { TimelineStep } from "./TimelineStep";
export { TimelineIcon } from "./TimelineIcon";
export { TimelineConnector } from "./TimelineConnector";
export { StatusBadge } from "./StatusBadge";
export { TrackingSkeleton } from "./TrackingSkeleton";
export { TrackingEmptyState } from "./TrackingEmptyState";
export { TrackingErrorState } from "./TrackingErrorState";
export { TimelineDisplayFields } from "./TimelineDisplayFields";

export {
  TIMELINE_STAGES,
  buildStepStates,
  computeProgress,
  getCurrentStage,
  getNextStage,
  getCurrentStageIndex,
  getStepStateForStage,
  getEstimatedDelivery,
  getLastUpdated,
} from "./stages";

export type {
  OrderTimelineProps,
  TimelineStage,
  TimelineStepState,
  StepState,
  TimelineDisplayField,
  TimelinePrimitiveProps,
} from "./types";
