"use client";

/**
 * TimelineStep — A single step in the tracking timeline.
 *
 * Renders: icon + label + description + (optional) display fields.
 * State-driven styling: completed, current, upcoming, cancelled, skipped.
 *
 * Layout adapts:
 *   - Horizontal (desktop): step is a column, icon on top, label below
 *   - Vertical (mobile): step is a row, icon on left, content on right
 */
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { Order } from "@/contexts/OrdersContext";
import type { TimelineStepState } from "./types";
import { TimelineIcon } from "./TimelineIcon";
import { TimelineDisplayFields } from "./TimelineDisplayFields";

export interface TimelineStepProps {
  stepState: TimelineStepState;
  order: Order;
  orientation: "horizontal" | "vertical";
  /** Show display fields (courier, tracking#, etc.) — only when step is completed or current */
  showFields?: boolean;
  /** Show completion date under the label */
  showDate?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Animation delay (ms) for staggered entrance */
  animationDelay?: number;
  className?: string;
}

export function TimelineStep({
  stepState,
  order,
  orientation,
  showFields = true,
  showDate = true,
  compact = false,
  animationDelay = 0,
  className,
}: TimelineStepProps) {
  const { stage, state, completedAt } = stepState;
  const isHorizontal = orientation === "horizontal";
  const isBotanical = stage.accent === "botanical";
  const isActive = state === "completed" || state === "current";

  // Don't render skipped stages at all on mobile; show muted on desktop
  if (state === "skipped" && isHorizontal) {
    return (
      <div
        className="flex flex-col items-center gap-1.5 flex-1 min-w-0 opacity-40 animate-step-enter"
        style={{ animationDelay: `${animationDelay}ms` }}
        aria-label={`${stage.label} (skipped)`}
      >
        <TimelineIcon icon={stage.icon} state="skipped" size={compact ? 32 : 40} botanical={isBotanical} />
        <p className="text-[10px] text-slate-400 text-center font-medium line-through leading-tight">
          {stage.label}
        </p>
      </div>
    );
  }
  if (state === "skipped") return null;

  // Compute display fields if the stage has them
  const displayFields = isActive && stage.displayFields ? stage.displayFields(order) : [];

  return (
    <div
      className={cn(
        "animate-step-enter",
        isHorizontal
          ? "flex flex-col items-center gap-1.5 flex-1 min-w-0"
          : "flex items-start gap-3 w-full",
        className,
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      role="listitem"
      aria-label={`${stage.label}: ${state}`}
    >
      {/* Icon */}
      <TimelineIcon
        icon={stage.icon}
        state={state}
        size={compact ? 32 : 40}
        botanical={isBotanical}
      />

      {/* Content */}
      <div className={cn("flex-1 min-w-0", isHorizontal && "text-center")}>
        {/* Label */}
        <p
          className={cn(
            "font-semibold leading-tight",
            compact ? "text-[10px]" : "text-xs",
            state === "completed" && "text-slate-800",
            state === "current" && (isBotanical ? "text-teal-700" : "text-[#1A6B3C]"),
            state === "upcoming" && "text-slate-400",
            state === "cancelled" && "text-red-600",
          )}
        >
          {state === "cancelled" ? "Cancelled" : stage.label}
          {state === "current" && (
            <span
              className={cn(
                "ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wide",
                isBotanical ? "bg-teal-100 text-teal-700" : "bg-[#1A6B3C]/10 text-[#1A6B3C]",
              )}
            >
              Current
            </span>
          )}
        </p>

        {/* Date (for completed/current steps) */}
        {showDate && completedAt && isActive && (
          <p
            className={cn(
              "text-[10px] mt-0.5 leading-tight",
              state === "current"
                ? (isBotanical ? "text-teal-600/70 font-medium" : "text-[#1A6B3C]/70 font-medium")
                : "text-slate-400",
            )}
          >
            {formatDate(completedAt)} · {formatTime(completedAt)}
          </p>
        )}

        {/* Description (only for current step in vertical layout, or compact mode off) */}
        {!compact && state === "current" && (
          <p
            className={cn(
              "text-[11px] mt-1 leading-relaxed",
              isHorizontal ? "text-slate-500" : "text-slate-600",
            )}
          >
            {stage.description}
          </p>
        )}

        {/* Display fields (courier, tracking#, etc.) */}
        {showFields && displayFields.length > 0 && (
          <TimelineDisplayFields
            fields={displayFields}
            orientation={orientation}
            compact={compact}
          />
        )}
      </div>
    </div>
  );
}
