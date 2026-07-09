"use client";

/**
 * TrackingEmptyState — Shown when tracking hasn't started yet.
 * Premium botanical illustration + calm message.
 */
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingEmptyStateProps {
  className?: string;
  /** Custom message */
  message?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function TrackingEmptyState({
  className,
  message,
  action,
}: TrackingEmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-[#F3F8F1] to-white rounded-2xl border border-[#1A6B3C]/10",
        "p-8 sm:p-12 flex flex-col items-center text-center",
        className,
      )}
      role="status"
    >
      {/* Botanical illustration (CSS-drawn sprout) */}
      <div className="relative mb-4">
        <div className="size-20 rounded-full bg-[#1A6B3C]/10 flex items-center justify-center">
          <Sprout className="size-10 text-[#1A6B3C]" strokeWidth={1.5} aria-hidden="true" />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 size-2 rounded-full bg-[#43A047]/40" aria-hidden="true" />
        <div className="absolute -bottom-2 -left-2 size-2.5 rounded-full bg-[#E8930A]/40" aria-hidden="true" />
        <div className="absolute top-1/2 -right-3 size-1.5 rounded-full bg-[#1A6B3C]/30" aria-hidden="true" />
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-1">
        Tracking Not Available Yet
      </h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
        {message ??
          "Tracking information will appear once your order is processed. This usually takes a few minutes."}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 rounded-full bg-[#1A6B3C] text-white text-sm font-semibold hover:bg-[#16A34A] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
