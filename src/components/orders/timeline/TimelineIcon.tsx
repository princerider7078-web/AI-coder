"use client";

/**
 * TimelineIcon — Resolves an icon name to a Lucide icon component.
 * Keeps the timeline-stages.ts file free of JSX imports.
 */
import {
  ShoppingBag,
  Wallet,
  CheckCircle2,
  Package,
  ShieldCheck,
  Leaf,
  Box,
  Truck,
  MapPin,
  BadgeCheck,
  Calendar,
  Clock,
  Hash,
  User,
  Phone,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import type { TimelineIconName } from "./timeline-stages";

const ICON_MAP: Record<TimelineIconName, LucideIcon> = {
  "shopping-bag": ShoppingBag,
  wallet: Wallet,
  "check-circle": CheckCircle2,
  package: Package,
  "leaf-shield": ShieldCheck, // we'll overlay Leaf inside the component for botanical feel
  box: Box,
  truck: Truck,
  "map-pin": MapPin,
  "check-badge": BadgeCheck,
  clock: Clock,
};

const DETAIL_ICON_MAP: Record<string, LucideIcon> = {
  calendar: Calendar,
  clock: Clock,
  hash: Hash,
  user: User,
  phone: Phone,
  truck: Truck,
  "map-pin": MapPin,
  "credit-card": CreditCard,
  package: Package,
  "check-circle": CheckCircle2,
};

interface TimelineIconProps {
  name: TimelineIconName;
  className?: string;
  /** Show botanical leaf overlay (GrowPlants signature) */
  withLeafAccent?: boolean;
}

export function TimelineIcon({ name, className, withLeafAccent }: TimelineIconProps) {
  const Icon = ICON_MAP[name] ?? CheckCircle2;
  return (
    <span className="relative inline-flex">
      <Icon className={className} aria-hidden="true" />
      {withLeafAccent && (
        <Leaf
          className="absolute -bottom-1 -right-1 size-3 text-[#43A047] opacity-80"
          aria-hidden="true"
          strokeWidth={3}
        />
      )}
    </span>
  );
}

export function TimelineDetailIcon({ name, className }: { name: string; className?: string }) {
  const Icon = DETAIL_ICON_MAP[name] ?? Hash;
  return <Icon className={className} aria-hidden="true" />;
}
