"use client";

/**
 * TrackingSkeleton — Loading shimmer state.
 * Mirrors the layout of the actual tracking section.
 */
import { cn } from "@/lib/utils";

interface TrackingSkeletonProps {
  className?: string;
}

export function TrackingSkeleton({ className }: TrackingSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)} role="status" aria-label="Loading tracking information">
      {/* Live banner skeleton */}
      <div className="rounded-2xl border border-slate-200 p-5 flex items-start gap-4">
        <div className="size-12 rounded-xl bg-slate-100 animate-shimmer" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-1/3 rounded bg-slate-100 animate-shimmer" />
          <div className="h-3 w-2/3 rounded bg-slate-100 animate-shimmer" />
        </div>
      </div>

      {/* Timeline skeleton (desktop horizontal) */}
      <div className="hidden md:block rounded-2xl border border-slate-200 p-6">
        <div className="h-4 w-1/4 rounded bg-slate-100 animate-shimmer mb-6" />
        <div className="flex items-start justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="size-10 rounded-full bg-slate-100 animate-shimmer" />
              <div className="h-2 w-12 rounded bg-slate-100 animate-shimmer" />
              <div className="h-2 w-10 rounded bg-slate-100 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline skeleton (mobile vertical) */}
      <div className="md:hidden rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="h-4 w-1/3 rounded bg-slate-100 animate-shimmer" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-slate-100 animate-shimmer shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-1/2 rounded bg-slate-100 animate-shimmer" />
              <div className="h-2 w-3/4 rounded bg-slate-100 animate-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="h-4 w-1/3 rounded bg-slate-100 animate-shimmer" />
          <div className="h-16 w-16 rounded-full bg-slate-100 animate-shimmer" />
          <div className="h-3 w-full rounded bg-slate-100 animate-shimmer" />
          <div className="h-3 w-2/3 rounded bg-slate-100 animate-shimmer" />
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="h-4 w-1/3 rounded bg-slate-100 animate-shimmer" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-slate-100 animate-shimmer shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-1/4 rounded bg-slate-100 animate-shimmer" />
                <div className="h-3 w-1/2 rounded bg-slate-100 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading order tracking…</span>
    </div>
  );
}
