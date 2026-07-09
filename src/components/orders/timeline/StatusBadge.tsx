"use client";

/**
 * StatusBadge — Small pill showing the step's state.
 * Used inside TimelineStep and as a header chip.
 */
import { cn } from "@/lib/utils";
import type { StepState } from "./timeline-stages";

interface StatusBadgeProps {
  state: StepState;
  className?: string;
  size?: "sm" | "md";
}

const STATE_CONFIG: Record<StepState, { label: string; classes: string }> = {
  completed: {
    label: "Completed",
    classes: "bg-green-50 text-green-700 border border-green-200",
  },
  current: {
    label: "In Progress",
    classes: "bg-[#1A6B3C]/10 text-[#1A6B3C] border border-[#1A6B3C]/30",
  },
  upcoming: {
    label: "Upcoming",
    classes: "bg-slate-50 text-slate-500 border border-slate-200",
  },
  cancelled_step: {
    label: "Cancelled",
    classes: "bg-red-50 text-red-600 border border-red-200",
  },
};

export function StatusBadge({ state, className, size = "sm" }: StatusBadgeProps) {
  const config = STATE_CONFIG[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        config.classes,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {config.label}
    </span>
  );
}
