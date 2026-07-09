"use client";

/**
 * TrackingErrorState — Shown when tracking can't be loaded.
 * Includes Retry + Support buttons.
 */
import { AlertCircle, RefreshCw, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingErrorStateProps {
  className?: string;
  /** Error message */
  message?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Support callback (defaults to opening WhatsApp) */
  onSupport?: () => void;
}

export function TrackingErrorState({
  className,
  message,
  onRetry,
  onSupport,
}: TrackingErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-red-50/50 rounded-2xl border border-red-200 p-6 sm:p-8 flex flex-col items-center text-center",
        className,
      )}
      role="alert"
    >
      <div className="size-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
        <AlertCircle className="size-7 text-red-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">
        Unable to Load Tracking
      </h3>
      <p className="text-sm text-slate-600 max-w-sm leading-relaxed mb-5">
        {message ??
          "We couldn't load your tracking information. Please check your connection and try again."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A6B3C] text-white text-sm font-semibold hover:bg-[#16A34A] transition-colors"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Retry
          </button>
        )}
        <button
          onClick={onSupport ?? defaultSupport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:border-[#1A6B3C] hover:text-[#1A6B3C] transition-colors"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Contact Support
        </button>
      </div>
    </div>
  );
}

function defaultSupport() {
  if (typeof window !== "undefined") {
    window.open("https://wa.me/919999999999?text=Hi%20GrowPlants,%20I%20need%20help%20with%20my%20order", "_blank");
  }
}
