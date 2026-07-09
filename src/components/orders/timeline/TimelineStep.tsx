"use client";

/**
 * TimelineStep — Single step in the tracking timeline.
 *
 * Renders differently based on state:
 *   - completed       → green circle with checkmark, soft success bg
 *   - current         → primary color, pulsing glow, elevated card
 *   - upcoming        → grey circle, muted text
 *   - cancelled_step  → red circle with X
 *
 * Desktop: vertical stack (circle on top, label below)
 * Mobile:  horizontal row (circle on left, content on right)
 *
 * Detail fields (courier, tracking #, etc.) render only when step is
 * completed or current.
 */
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type TimelineStage,
  type StepState,
} from "./timeline-stages";
import { TimelineIcon, TimelineDetailIcon } from "./TimelineIcon";
import { StatusBadge } from "./StatusBadge";

interface TimelineStepProps {
  stage: TimelineStage;
  state: StepState;
  /** Metadata values keyed by detailField.key */
  details?: Record<string, string | undefined>;
  /** Timestamp when this step was completed (ISO string) */
  timestamp?: string;
  /** Format function for timestamps */
  formatDate?: (iso: string) => string;
  /** Whether this is the last step (no connector after) */
  isLast?: boolean;
  /** Index for ARIA labeling */
  index: number;
}

export function TimelineStep({
  stage,
  state,
  details,
  timestamp,
  formatDate,
  isLast,
  index,
}: TimelineStepProps) {
  const isCompleted = state === "completed";
  const isCurrent = state === "current";
  const isCancelled = state === "cancelled_step";
  const isUpcoming = state === "upcoming";
  const showDetails = (isCompleted || isCurrent) && stage.detailFields && details;

  return (
    <>
      {/* ============ DESKTOP: vertical stack ============ */}
      <div
        className="hidden md:flex flex-col items-center gap-2 flex-1 min-w-0 relative"
        aria-label={`Step ${index + 1}: ${stage.label} — ${state}`}
        role="listitem"
      >
        {/* Step circle */}
        <div
          className={cn(
            "relative z-10 size-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
            // State-based styling
            isCompleted && "bg-[#1A6B3C] text-white shadow-md shadow-[#1A6B3C]/20",
            isCurrent &&
              "bg-[#1A6B3C] text-white ring-4 ring-[#1A6B3C]/20 animate-pulse-soft shadow-lg shadow-[#1A6B3C]/30",
            isUpcoming && "bg-slate-50 text-slate-400 border-2 border-slate-200",
            isCancelled && "bg-red-500 text-white shadow-md shadow-red-500/20",
          )}
        >
          {isCompleted ? (
            <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          ) : isCancelled ? (
            <X className="size-5" strokeWidth={3} aria-hidden="true" />
          ) : (
            <TimelineIcon
              name={stage.iconName}
              className="size-5"
              withLeafAccent={stage.isBotanical && (isCurrent || isCompleted)}
            />
          )}
        </div>

        {/* Label */}
        <p
          className={cn(
            "text-xs font-semibold text-center leading-tight max-w-[100px]",
            isUpcoming ? "text-slate-400" : "text-slate-800",
            isCurrent && "text-[#1A6B3C]",
            isCancelled && "text-red-600",
          )}
        >
          {isCancelled ? "Cancelled" : stage.label}
        </p>

        {/* Timestamp */}
        {isCompleted && timestamp && formatDate && (
          <p className="text-[10px] text-slate-400 text-center leading-tight">
            {formatDate(timestamp)}
          </p>
        )}
        {isCurrent && timestamp && formatDate && (
          <p className="text-[10px] text-[#1A6B3C]/70 text-center leading-tight font-medium">
            {formatDate(timestamp)}
          </p>
        )}
      </div>

      {/* ============ MOBILE: horizontal row ============ */}
      <div
        className="md:hidden flex items-start gap-3 relative pb-6 last:pb-0"
        role="listitem"
        aria-label={`Step ${index + 1}: ${stage.label} — ${state}`}
      >
        {/* Circle */}
        <div
          className={cn(
            "relative z-10 size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5",
            isCompleted && "bg-[#1A6B3C] text-white shadow-md shadow-[#1A6B3C]/20",
            isCurrent &&
              "bg-[#1A6B3C] text-white ring-4 ring-[#1A6B3C]/20 animate-pulse-soft shadow-lg shadow-[#1A6B3C]/30",
            isUpcoming && "bg-slate-50 text-slate-400 border-2 border-slate-200",
            isCancelled && "bg-red-500 text-white shadow-md shadow-red-500/20",
          )}
        >
          {isCompleted ? (
            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          ) : isCancelled ? (
            <X className="size-4" strokeWidth={3} aria-hidden="true" />
          ) : (
            <TimelineIcon
              name={stage.iconName}
              className="size-4"
              withLeafAccent={stage.isBotanical && (isCurrent || isCompleted)}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={cn(
                "text-sm font-semibold leading-tight",
                isUpcoming ? "text-slate-400" : "text-slate-800",
                isCurrent && "text-[#1A6B3C]",
                isCancelled && "text-red-600",
              )}
            >
              {isCancelled ? "Cancelled" : stage.label}
            </p>
            <StatusBadge state={state} size="sm" />
          </div>

          <p
            className={cn(
              "text-xs mt-0.5 leading-relaxed",
              isUpcoming ? "text-slate-400" : "text-slate-600",
            )}
          >
            {isCancelled ? "This order was cancelled after being placed." : stage.description}
          </p>

          {/* Timestamp */}
          {(isCompleted || isCurrent) && timestamp && formatDate && (
            <p
              className={cn(
                "text-[10px] mt-1",
                isCurrent ? "text-[#1A6B3C]/70 font-medium" : "text-slate-400",
              )}
            >
              {formatDate(timestamp)}
            </p>
          )}

          {/* Detail fields */}
          {showDetails && (
            <div className="mt-2 space-y-1 p-2.5 rounded-lg bg-[#F3F8F1] border border-[#1A6B3C]/10">
              {stage.detailFields!.map((field) => {
                const value = details?.[field.key];
                if (!value) return null;
                return (
                  <div key={field.key} className="flex items-center gap-2 text-xs">
                    <TimelineDetailIcon
                      name={field.iconName}
                      className="size-3.5 text-[#1A6B3C] shrink-0"
                    />
                    <span className="text-slate-500">{field.label}:</span>
                    <span
                      className={cn(
                        "text-slate-800 font-medium",
                        field.critical && "font-bold text-[#1A6B3C]",
                      )}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
