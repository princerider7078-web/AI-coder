import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * LogoMark — the GrowPlants icon (square crop from the uploaded brand logo).
 * Used as the favicon, app icon, and standalone mark where the wordmark
 * doesn't fit (mobile bottom nav, loading states, etc.).
 *
 * Variants:
 *   - "image" (default): uses /logo-mark.png (square crop of the brand logo)
 *   - "tile": forest-green rounded tile with the image inside (for contrast
 *             on light backgrounds where the logo alone might not pop)
 *
 * Sizes map to pixel dimensions for next/image optimization.
 */
export interface LogoMarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "image" | "tile";
  className?: string;
}

const PX_SIZE = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
} as const;

export function LogoMark({
  size = "md",
  variant = "image",
  className,
}: LogoMarkProps) {
  const px = PX_SIZE[size];

  if (variant === "tile") {
    return (
      <div
        className={cn(
          "rounded-xl bg-primary flex items-center justify-center shadow-sm overflow-hidden",
          className
        )}
        style={{ width: px, height: px }}
        role="img"
        aria-label="GrowPlants"
      >
        <Image
          src="/logo-mark.png"
          alt="GrowPlants"
          width={px}
          height={px}
          className="object-contain p-1"
          priority
        />
      </div>
    );
  }

  return (
    <Image
      src="/logo-mark.png"
      alt="GrowPlants"
      width={px}
      height={px}
      className={cn("object-contain", className)}
      priority
    />
  );
}
