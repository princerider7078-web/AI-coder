"use client";

/**
 * GrowPlants — StatusBadge
 * ============================================================================
 * Reusable pill-shaped status badge. Used in:
 *   - Order header (current status)
 *   - Tracking summary card
 *   - Live status banner
 *
 * Variants:
 *   - solid  → solid colored background, white text
 *   - soft   → light tinted background, colored text
 *   - outline→ transparent background, colored border + text
 * ============================================================================
 */
import { cn } from "@/lib/utils";

type BadgeVariant = "solid" | "soft" | "outline";
type BadgeColor =
  | "amber" | "blue" | "green" | "red" | "purple" | "orange"
  | "teal" | "cyan" | "indigo" | "emerald" | "slate" | "rose";

interface StatusBadgeProps {
  label: string;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

const COLOR_MAP: Record<BadgeColor, { solid: string; soft: string; outline: string; dot: string }> = {
  amber:   { solid: "bg-amber-500 text-white",       soft: "bg-amber-100 text-amber-700",       outline: "border border-amber-300 text-amber-700",       dot: "bg-amber-500" },
  blue:    { solid: "bg-blue-500 text-white",        soft: "bg-blue-100 text-blue-700",         outline: "border border-blue-300 text-blue-700",         dot: "bg-blue-500" },
  green:   { solid: "bg-green-500 text-white",       soft: "bg-green-100 text-green-700",       outline: "border border-green-300 text-green-700",       dot: "bg-green-500" },
  red:     { solid: "bg-red-500 text-white",         soft: "bg-red-100 text-red-700",           outline: "border border-red-300 text-red-700",           dot: "bg-red-500" },
  purple:  { solid: "bg-purple-500 text-white",      soft: "bg-purple-100 text-purple-700",     outline: "border border-purple-300 text-purple-700",     dot: "bg-purple-500" },
  orange:  { solid: "bg-orange-500 text-white",      soft: "bg-orange-100 text-orange-700",     outline: "border border-orange-300 text-orange-700",     dot: "bg-orange-500" },
  teal:    { solid: "bg-teal-500 text-white",        soft: "bg-teal-100 text-teal-700",         outline: "border border-teal-300 text-teal-700",         dot: "bg-teal-500" },
  cyan:    { solid: "bg-cyan-500 text-white",        soft: "bg-cyan-100 text-cyan-700",         outline: "border border-cyan-300 text-cyan-700",         dot: "bg-cyan-500" },
  indigo:  { solid: "bg-indigo-500 text-white",      soft: "bg-indigo-100 text-indigo-700",     outline: "border border-indigo-300 text-indigo-700",     dot: "bg-indigo-500" },
  emerald: { solid: "bg-emerald-500 text-white",     soft: "bg-emerald-100 text-emerald-700",   outline: "border border-emerald-300 text-emerald-700",   dot: "bg-emerald-500" },
  slate:   { solid: "bg-slate-500 text-white",       soft: "bg-slate-100 text-slate-700",       outline: "border border-slate-300 text-slate-700",       dot: "bg-slate-500" },
  rose:    { solid: "bg-rose-500 text-white",        soft: "bg-rose-100 text-rose-700",         outline: "border border-rose-300 text-rose-700",         dot: "bg-rose-500" },
};

const SIZE_MAP = {
  xs: "text-[10px] px-2 py-0.5 gap-1",
  sm: "text-xs px-2.5 py-1 gap-1.5",
  md: "text-sm px-3 py-1.5 gap-1.5",
};

export function StatusBadge({
  label,
  color = "slate",
  variant = "soft",
  size = "sm",
  icon,
  className,
}: StatusBadgeProps) {
  const colors = COLOR_MAP[color];

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full whitespace-nowrap transition-colors",
        SIZE_MAP[size],
        variant === "solid" && colors.solid,
        variant === "soft" && colors.soft,
        variant === "outline" && colors.outline,
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
