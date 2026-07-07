"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FilterChip — a removable filter chip used in the active-filter bar
 * (Shop, Services, Search pages).
 *
 * Two variants:
 *   - "removable" (default): shows × on the right to remove the filter
 *   - "static": display-only (e.g., showing a single active category badge)
 *
 * Used by: FilterChipBar (Phase 7) — composed on top of Shop/Services pages.
 */
export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  variant?: "removable" | "static";
  className?: string;
}

export function FilterChip({
  label,
  onRemove,
  variant = "removable",
  className,
}: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20",
        "text-body-sm font-medium px-3 py-1",
        className
      )}
    >
      {label}
      {variant === "removable" && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter: ${label}`}
          className="rounded-full p-0.5 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
