import { cn } from "@/lib/utils";

/**
 * LogoMark — the GrowPlants icon (Sprout in a rounded forest-green tile).
 * Used as the favicon, app icon, and standalone mark where the wordmark
 * doesn't fit (mobile bottom nav, loading states, etc.).
 *
 * Variants:
 *   - "tile" (default): forest-green rounded tile with white sprout icon
 *   - "bare": sprout icon only (inherits currentColor)
 */
import { Sprout } from "lucide-react";

export interface LogoMarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "tile" | "bare";
  className?: string;
}

const SIZE_MAP = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
} as const;

const ICON_SIZE_MAP = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
  xl: "size-10",
} as const;

export function LogoMark({
  size = "md",
  variant = "tile",
  className,
}: LogoMarkProps) {
  if (variant === "bare") {
    return <Sprout className={cn(ICON_SIZE_MAP[size], className)} aria-hidden="true" />;
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm",
        SIZE_MAP[size],
        className
      )}
      role="img"
      aria-label="GrowPlants"
    >
      <Sprout className={cn(ICON_SIZE_MAP[size])} aria-hidden="true" />
    </div>
  );
}
