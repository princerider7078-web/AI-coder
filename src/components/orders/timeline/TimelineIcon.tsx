"use client";

/**
 * TimelineIcon — Icon wrapper with botanical styling.
 * Renders a Lucide icon inside a rounded square with theme-aware background.
 *
 * Variants by step state:
 *   - completed  → green bg, white icon, check badge overlay
 *   - current    → primary green bg, white icon, pulse glow
 *   - upcoming   → muted bg, grey icon
 *   - cancelled  → red bg, white X icon
 *   - skipped    → very muted bg, line-through icon
 *   - botanical  → teal tinted bg (for Quality Inspection stage)
 */
import { Check, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepState } from "./types";

export interface TimelineIconProps {
  icon: LucideIcon;
  state: StepState;
  /** Size in px (default 40) */
  size?: number;
  /** Botanical accent (for Quality Inspection stage) */
  botanical?: boolean;
  className?: string;
}

export function TimelineIcon({
  icon: Icon,
  state,
  size = 40,
  botanical = false,
  className,
}: TimelineIconProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Background circle */}
      <div
        className={cn(
          "size-full rounded-full flex items-center justify-center transition-all duration-300",
          state === "completed" && "bg-[#1A6B3C] text-white shadow-sm",
          state === "current" && "bg-[#1A6B3C] text-white ring-4 ring-[#1A6B3C]/15 animate-pulse-soft",
          state === "upcoming" && "bg-slate-100 text-slate-400",
          state === "cancelled" && "bg-red-500 text-white shadow-sm",
          state === "skipped" && "bg-slate-50 text-slate-300",
          botanical && state === "current" && "bg-teal-600 text-white ring-4 ring-teal-600/15",
          botanical && state === "completed" && "bg-teal-600 text-white",
        )}
        aria-hidden="true"
      >
        <Icon style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={2} />
      </div>

      {/* Check badge for completed steps (top-right corner) */}
      {state === "completed" && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full bg-white border-2 flex items-center justify-center shadow-sm",
            botanical ? "border-teal-600" : "border-[#1A6B3C]",
          )}
          style={{ width: size * 0.4, height: size * 0.4 }}
          aria-label="Completed"
        >
          <Check
            className={cn(botanical ? "text-teal-600" : "text-[#1A6B3C]")}
            style={{ width: size * 0.25, height: size * 0.25 }}
            strokeWidth={3.5}
          />
        </div>
      )}

      {/* X badge for cancelled steps */}
      {state === "cancelled" && (
        <div
          className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-white border-2 border-red-500 flex items-center justify-center shadow-sm"
          aria-label="Cancelled"
        >
          <X className="size-2.5 text-red-500" strokeWidth={3.5} />
        </div>
      )}
    </div>
  );
}
