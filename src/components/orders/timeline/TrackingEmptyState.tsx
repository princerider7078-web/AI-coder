"use client";

/**
 * TrackingEmptyState — Shown when tracking has not started yet.
 * Premium illustration + message + helpful CTA.
 *
 * Example: order just placed, no tracking data yet.
 */
import { Sprout, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TrackingEmptyStateProps {
  orderNumber?: string;
  className?: string;
}

export function TrackingEmptyState({ orderNumber, className }: TrackingEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-[#F3F8F1] to-white border border-[#1A6B3C]/10 p-8 md:p-12 text-center",
        className,
      )}
      role="status"
    >
      {/* Botanical illustration (CSS-drawn leaf in a circle) */}
      <div className="relative mx-auto mb-5">
        <div className="size-20 mx-auto rounded-full bg-[#1A6B3C]/10 flex items-center justify-center">
          <Sprout className="size-10 text-[#1A6B3C]" strokeWidth={1.8} />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 right-1/4 size-2 rounded-full bg-[#E8930A]/60" aria-hidden="true" />
        <div className="absolute -bottom-1 left-1/4 size-1.5 rounded-full bg-[#1A6B3C]/40" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Tracking Starting Soon
      </h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        Tracking information will appear once your order is processed.
        {orderNumber && (
          <>
            <br />
            <span className="text-xs text-slate-500 mt-1 inline-block">
              Order <span className="font-mono font-semibold">#{orderNumber}</span> is being prepared.
            </span>
          </>
        )}
      </p>

      <div className="flex items-center justify-center gap-3 mt-5">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-[#1A6B3C] bg-white border border-[#1A6B3C]/20 hover:border-[#1A6B3C]/40 transition-colors"
        >
          Continue Shopping
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
