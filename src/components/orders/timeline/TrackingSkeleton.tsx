"use client";

/**
 * GrowPlants — TrackingSkeleton
 * ============================================================================
 * Loading shimmer state shown while the order document is being fetched
 * from Firestore.
 * ============================================================================
 */
import { cn } from "@/lib/utils";

interface TrackingSkeletonProps {
  className?: string;
}

export function TrackingSkeleton({ className }: TrackingSkeletonProps) {
  return (
    <div className={cn("space-y-4 animate-pulse", className)} aria-busy="true" aria-live="polite">
      {/* Live banner skeleton */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="flex items-start gap-3">
          <div className="size-12 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      {/* Timeline skeleton (horizontal) */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-5" />
        <div className="flex items-start justify-between gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="size-10 rounded-full bg-slate-200" />
              <div className="h-2 bg-slate-200 rounded w-full" />
              <div className="h-1.5 bg-slate-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
