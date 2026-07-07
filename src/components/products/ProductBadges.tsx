import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Flame, Star, PackageX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * ProductBadges — Sale / New / Best Seller / Out of Stock badges for
 * ProductCard. Renders up to 2 badges (priority: OOS > Sale > BestSeller > New).
 *
 * Used on: ProductCard, PDP header.
 */
export interface ProductBadgesProps {
  isOutOfStock?: boolean;
  isOnSale?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  discountPercent?: number; // shown if isOnSale
  className?: string;
  maxBadges?: number;
}

interface BadgeConfig {
  icon: LucideIcon;
  label: string;
  className: string;
}

export function ProductBadges({
  isOutOfStock,
  isOnSale,
  isBestseller,
  isNewArrival,
  discountPercent,
  className,
  maxBadges = 2,
}: ProductBadgesProps) {
  const badges: BadgeConfig[] = [];

  if (isOutOfStock) {
    badges.push({
      icon: PackageX,
      label: "Out of Stock",
      className: "bg-muted text-muted-foreground",
    });
  }
  if (isOnSale && discountPercent && discountPercent > 0) {
    badges.push({
      icon: Flame,
      label: `${discountPercent}% OFF`,
      className: "bg-accent text-accent-foreground",
    });
  }
  if (isBestseller) {
    badges.push({
      icon: Star,
      label: "Best Seller",
      className: "bg-primary text-primary-foreground",
    });
  }
  if (isNewArrival) {
    badges.push({
      icon: Sparkles,
      label: "New",
      className: "bg-info/15 text-info border border-info/30",
    });
  }

  const visible = badges.slice(0, maxBadges);
  if (visible.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visible.map((badge, i) => (
        <Badge
          key={i}
          className={cn(
            "gap-1 rounded-md border-0 px-2 py-0.5 text-caption font-semibold",
            badge.className
          )}
          variant="outline"
        >
          <badge.icon className="size-3" aria-hidden="true" />
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}
