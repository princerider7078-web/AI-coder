"use client";

/**
 * TimelineConnector — Animated connector line between timeline steps.
 *
 * Desktop (horizontal): rendered as a horizontal line between adjacent step icons.
 * Mobile (vertical):    rendered as a vertical line above/below step icons.
 *
 * States:
 *   - completed → solid green line (fills from left with transition)
 *   - upcoming  → dashed grey line
 *   - skipped   → dotted grey line
 *   - cancelled → solid red line
 */
import { cn } from "@/lib/utils";
import type { StepState } from "./types";

export interface TimelineConnectorProps {
  /** State of the connector (use the state of the PREVIOUS step) */
  state: StepState;
  /** Layout direction */
  orientation: "horizontal" | "vertical";
  /** Length (width for horizontal, height for vertical) — default 'flex-1' */
  length?: string;
  className?: string;
}

export function TimelineConnector({
  state,
  orientation,
  length = "flex-1",
  className,
}: TimelineConnectorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isHorizontal ? `h-0.5 ${length} self-center` : `w-0.5 ${length} mx-auto`,
        className,
      )}
      aria-hidden="true"
    >
      {/* Base line */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          state === "upcoming" && "bg-slate-200",
          state === "skipped" && "bg-slate-100 border-t border-dashed border-slate-200",
          state === "completed" && "bg-[#1A6B3C]",
          state === "cancelled" && "bg-red-300",
          state === "current" && "bg-[#1A6B3C]",
        )}
      />
      {/* Animated fill overlay for completed (draws from start) */}
      {state === "completed" && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-[#1A6B3C] to-[#43A047] animate-connector-fill",
            !isHorizontal && "bg-gradient-to-b",
          )}
        />
      )}
    </div>
  );
}
