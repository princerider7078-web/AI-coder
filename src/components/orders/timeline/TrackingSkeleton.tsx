"use client";

/**
 * TrackingSkeleton — Loading shimmer state for the tracking timeline.
 * Renders a placeholder layout with animated shimmer bars.
 */
import { cn } from "@/lib/utils";

export interface TrackingSkeletonProps {
  className?: string;
  /** "full" = banner + timeline + cards; "timeline" = just the timeline */
  variant?: "full" | "timeline";
}

export function TrackingSkeleton({ className, variant = "full" }: TrackingSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)} aria-busy="true" aria-live="polite">
      {/* Banner skeleton */}
      {variant === "full" && (
        <div className="rounded-2xl bg-white border border-slate-200 p-5 overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="size-12 md:size-14 rounded-2xl bg-slate-100 animate-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-slate-100 rounded animate-shimmer" />
              <div className="h-3 w-3/4 bg-slate-100 rounded animate-shimmer" />
              <div className="h-3 w-1/3 bg-slate-100 rounded animate-shimmer mt-2" />
            </div>
          </div>
        </div>
      )}

      {/* Timeline skeleton (9 steps) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="h-4 w-1/4 bg-slate-100 rounded animate-shimmer mb-5" />
        {/* Horizontal on desktop */}
        <div className="hidden md:flex items-start justify-between gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="size-10 rounded-full bg-slate-100 animate-shimmer" />
              <div className="h-2 w-full bg-slate-100 rounded animate-shimmer" />
              <div className="h-1.5 w-2/3 bg-slate-100 rounded animate-shimmer" />
            </div>
          ))}
        </div>
        {/* Vertical on mobile */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-slate-100 animate-shimmer shrink-0" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-2.5 w-1/3 bg-slate-100 rounded animate-shimmer" />
                <div className="h-2 w-1/2 bg-slate-100 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      {variant === "full" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="h-4 w-1/3 bg-slate-100 rounded animate-shimmer" />
            <div className="h-2 bg-slate-100 rounded animate-shimmer" />
            <div className="h-2 w-3/4 bg-slate-100 rounded animate-shimmer" />
            <div className="h-2 w-1/2 bg-slate-100 rounded animate-shimmer" />
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="h-4 w-1/4 bg-slate-100 rounded animate-shimmer" />
            <div className="h-2 bg-slate-100 rounded animate-shimmer" />
            <div className="h-2 w-2/3 bg-slate-100 rounded animate-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
}
