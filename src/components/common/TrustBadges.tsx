import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * TrustBadges — persistent trust bar (4 badges).
 * Source: HOMEPAGE_AUDIT_REPORT.md §9.1.5 ("No persistent trust badge visible
 * without scrolling" — fix: add visible trust badges).
 *
 * Used below the hero section to reinforce trust above the fold.
 */
interface TrustBadge {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const BADGES: TrustBadge[] = [
  { icon: Truck, title: "Free Delivery", subtitle: "Above ₹499 in Sonipat" },
  { icon: ShieldCheck, title: "24h Damage Guarantee", subtitle: "Free replacement" },
  { icon: RefreshCw, title: "7-Day Returns", subtitle: "On planters & accessories" },
  { icon: Headphones, title: "Expert Support", subtitle: "Mon–Sun, 9AM–7PM" },
];

export interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4",
        className
      )}
      role="list"
    >
      {BADGES.map((badge) => (
        <div
          key={badge.title}
          className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
          role="listitem"
        >
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <badge.icon className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-body-sm font-semibold text-foreground truncate">
              {badge.title}
            </p>
            <p className="text-caption text-muted-foreground truncate">
              {badge.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
