"use client";

/**
 * GrowPlants — TimelineIcon
 * ============================================================================
 * Icon registry for timeline stages. Resolves a TimelineIconName to a Lucide
 * icon component, wrapped in a consistent visual style.
 *
 * Each icon is rendered inside a circular container. The container's appearance
 * changes based on step state:
 *   - completed       → solid brand green, white icon, checkmark overlay
 *   - current         → accent color classes from stage, white icon, pulse glow
 *   - upcoming        → light grey background, muted icon
 *   - cancelled_step  → solid red, white X
 * ============================================================================
 */
import {
  ShoppingBag, Wallet, CheckCircle2, Package, Leaf, Box,
  Truck, MapPin, CheckCheck, AlertCircle, XCircle, Shield, Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineIconName } from "./timeline-stages";

const ICON_REGISTRY: Partial<Record<TimelineIconName, LucideIcon>> = {
  "shopping-bag": ShoppingBag,
  wallet: Wallet,
  "check-circle": CheckCircle2,
  package: Package,
  "leaf-shield": Leaf,
  box: Box,
  truck: Truck,
  "map-pin": MapPin,
  "check-badge": CheckCheck,
  clock: Clock,
};

interface TimelineIconProps {
  name: TimelineIconName;
  /** Tailwind classes for the circle background (when current) — from stage.accentColor */
  accentColor?: string;
  /** Tailwind classes for the icon color (when current) — from stage.iconColor */
  iconColor?: string;
  state: "completed" | "current" | "upcoming" | "cancelled_step";
  size?: "sm" | "md" | "lg";
  showCheckOnComplete?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { circle: "size-7", icon: "size-3.5" },
  md: { circle: "size-10", icon: "size-5" },
  lg: { circle: "size-12", icon: "size-6" },
};

export function TimelineIcon({
  name,
  accentColor = "bg-[#1A6B3C] text-white",
  iconColor = "text-white",
  state,
  size = "md",
  showCheckOnComplete = true,
  className,
}: TimelineIconProps) {
  const Icon = ICON_REGISTRY[name] ?? Package;
  const dims = SIZE_MAP[size];

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
        dims.circle,
        // State-based styling
        state === "completed" && "bg-[#1A6B3C] text-white shadow-sm",
        state === "current" && cn(accentColor, "shadow-md ring-4 ring-[#1A6B3C]/15 animate-pulse-soft"),
        state === "upcoming" && "bg-slate-100 text-slate-400",
        state === "cancelled_step" && "bg-red-500 text-white shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      {/* Special: leaf-shield gets a shield overlay */}
      {name === "leaf-shield" && (
        <Shield
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-white p-0.5",
            state === "completed" && "text-[#1A6B3C]",
            state === "current" && "text-[#1A6B3C]",
            state === "upcoming" && "text-slate-400",
            state === "cancelled_step" && "text-red-500",
          )}
        />
      )}
      <Icon className={dims.icon} strokeWidth={2.2} />

      {/* Checkmark overlay on completed steps */}
      {state === "completed" && showCheckOnComplete && name !== "check-circle" && name !== "check-badge" && (
        <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-white flex items-center justify-center shadow-sm animate-checkmark-pop">
          <CheckCircle2 className="size-4 text-[#1A6B3C]" strokeWidth={2.5} />
        </div>
      )}

      {/* X overlay on cancelled step */}
      {state === "cancelled_step" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <XCircle className={cn(dims.icon, "text-white")} strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * TimelineDetailIcon — resolves field icons for detail rows
 * ============================================================================ */
const DETAIL_ICON_REGISTRY: Record<string, LucideIcon> = {
  calendar: CheckCircle2, // re-use; replace with Calendar if needed
  clock: Clock,
  hash: CheckCircle2,
  user: CheckCircle2,
  phone: CheckCircle2,
  truck: Truck,
  "map-pin": MapPin,
  "credit-card": Wallet,
  package: Package,
  "check-circle": CheckCircle2,
};

export function TimelineDetailIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = DETAIL_ICON_REGISTRY[name] ?? CheckCircle2;
  return <Icon className={cn("size-3.5", className)} aria-hidden="true" />;
}
