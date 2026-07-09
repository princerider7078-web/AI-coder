"use client";

/**
 * TrackingErrorState — Shown when tracking cannot be loaded.
 * Friendly error message + Retry + Support buttons.
 */
import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export function TrackingErrorState({
  message = "Unable to load tracking information.",
  onRetry,
  onContactSupport,
  className,
}: TrackingErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 p-8 md:p-10 text-center",
        className,
      )}
      role="alert"
    >
      {/* Error icon */}
      <div className="relative mx-auto mb-5">
        <div className="size-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="size-10 text-red-500" strokeWidth={1.8} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Tracking Unavailable
      </h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-5">
        {message}
        <br />
        <span className="text-xs text-slate-500">
          Please check your connection and try again, or contact our support team.
        </span>
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#1A6B3C] hover:bg-[#16A34A] transition-colors shadow-sm"
          >
            <RefreshCw className="size-3.5" />
            Retry
          </button>
        )}
        {onContactSupport && (
          <button
            type="button"
            onClick={onContactSupport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <MessageCircle className="size-3.5" />
            Contact Support
          </button>
        )}
      </div>
    </div>
  );
}
