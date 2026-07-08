import { cn } from "@/lib/utils";
import { discountPercent as calcDiscount } from "@/lib/utils";

/**
 * DiscountBadge — standalone discount percentage badge for PDP hero / cart
 * totals. Differs from ProductBadges by being a single bold pill (no icon).
 *
 * Used on: PDP price row, Cart summary line.
 */
export interface DiscountBadgeProps {
  basePrice: number;
  sellingPrice: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-caption px-1.5 py-0.5",
  md: "text-body-sm px-2 py-0.5",
  lg: "text-body px-2.5 py-1",
} as const;

export function DiscountBadge({
  basePrice,
  sellingPrice,
  className,
  size = "md",
}: DiscountBadgeProps) {
  const discount = calcDiscount(basePrice, sellingPrice);
  if (discount <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-success/15 text-success border border-success/30 font-semibold tabular-nums",
        SIZE_CLASSES[size],
        className
      )}
      aria-label={`${discount}% discount`}
    >
      {discount}% OFF
    </span>
  );
}
