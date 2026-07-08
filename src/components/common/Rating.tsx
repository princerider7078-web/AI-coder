"use client";

import { useState, useId } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rating — star rating component with two modes:
 *
 *   - display (default): read-only stars showing a numeric rating (supports
 *     half-stars for precision like 4.5). Optionally shows review count.
 *   - interactive: clickable star input for review forms. Calls onChange
 *     with the selected integer (1-5).
 *
 * Used on: ProductCard, PDP review summary, ReviewCard, ServiceCard,
 * ProviderCard, ReviewForm, account reviews.
 *
 * Accessibility:
 *   - Display mode: role="img" with aria-label "Rated X out of 5"
 *   - Interactive mode: role="radiogroup" with each star as a radio button
 */
export interface RatingProps {
  value: number; // 0-5, supports halves in display mode
  count?: number; // review count (display mode only)
  size?: "sm" | "md" | "lg";
  variant?: "display" | "interactive";
  onChange?: (value: number) => void;
  className?: string;
  showCount?: boolean;
  countLabel?: string; // override the "{count} reviews" label
}

const STAR_SIZE = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-6",
} as const;

export function Rating({
  value,
  count,
  size = "sm",
  variant = "display",
  onChange,
  className,
  showCount = false,
  countLabel,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const groupId = useId();
  const displayValue = hoverValue ?? value;
  const clamped = Math.max(0, Math.min(5, displayValue));

  if (variant === "interactive") {
    return (
      <div
        role="radiogroup"
        aria-label="Star rating"
        className={cn("inline-flex items-center gap-1", className)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= clamped;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              tabIndex={value === star ? 0 : -1}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
              onFocus={() => setHoverValue(star)}
              onBlur={() => setHoverValue(null)}
              className={cn(
                "rounded-sm transition-colors",
                "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                STAR_SIZE[size]
              )}
            >
              <Star
                className={cn(
                  STAR_SIZE[size],
                  isFilled
                    ? "fill-warning text-warning"
                    : "fill-transparent text-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span className="sr-only">{star} star{star > 1 ? "s" : ""}</span>
            </button>
          );
        })}
        <span className="sr-only" id={groupId}>
          Current rating: {value} out of 5
        </span>
      </div>
    );
  }

  // Display mode — supports half-stars
  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5${count ? `, ${count} reviews` : ""}`}
    >
      <div className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent = Math.max(0, Math.min(1, clamped - (star - 1))) * 100;
          return (
            <div key={star} className={cn("relative", STAR_SIZE[size])}>
              <Star
                className={cn(STAR_SIZE[size], "text-muted-foreground fill-muted")}
                aria-hidden="true"
              />
              {fillPercent > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star
                    className={cn(STAR_SIZE[size], "text-warning fill-warning")}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showCount && (
        <span className="text-body-sm text-muted-foreground tabular-nums">
          {countLabel ?? (count !== undefined ? `${value.toFixed(1)} (${count})` : value.toFixed(1))}
        </span>
      )}
    </div>
  );
}
