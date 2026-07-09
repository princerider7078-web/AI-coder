"use client";

/**
 * TimelineConnector — Animated line between two steps.
 *
 * Desktop: horizontal line (flex-1, height 2px)
 * Mobile:  vertical line (absolute positioned between circles)
 *
 * State:
 *   - completed → green fill (animated width/height grow on mount)
 *   - upcoming  → grey dashed
 */
import { cn } from "@/lib/utils";

interface TimelineConnectorProps {
  state: "completed" | "upcoming";
  orientation: "horizontal" | "vertical";
  className?: string;
}

export function TimelineConnector({
  state,
  orientation,
  className,
}: TimelineConnectorProps) {
  if (orientation === "horizontal") {
    return (
      <div
        className={cn(
          "flex-1 h-0.5 mx-1 relative overflow-hidden rounded-full",
          "min-w-[24px] mt-4",
          className,
        )}
        aria-hidden="true"
      >
        {/* Base track */}
        <div className="absolute inset-0 bg-slate-200" />
        {/* Fill (animated) */}
        <div
          className={cn(
            "absolute inset-0 origin-left transition-all duration-700 ease-out",
            state === "completed" ? "bg-[#1A6B3C] scale-x-100" : "scale-x-0",
          )}
        />
      </div>
    );
  }

  // Vertical connector (mobile)
  return (
    <div
      className={cn(
        "absolute left-[14px] top-7 bottom-0 w-0.5 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-slate-200" />
      <div
        className={cn(
          "absolute inset-0 origin-top transition-all duration-700 ease-out",
          state === "completed" ? "bg-[#1A6B3C] scale-y-100" : "scale-y-0",
        )}
      />
    </div>
  );
}
