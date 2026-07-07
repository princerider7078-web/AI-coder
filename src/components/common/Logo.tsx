"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBilingual } from "@/store/useBilingual";

/**
 * Logo — the GrowPlants brand lockup using the uploaded brand logo image.
 * Used in the Header (desktop + mobile) and the Auth layout.
 *
 * The image at /public/logo.png is 1024×246 (wide aspect — icon + wordmark).
 * We render it via next/image with responsive heights so it stays crisp on
 * retina displays.
 *
 * Note: No language toggle is shown next to the logo per user request
 * (Phase 3). The bilingual Zustand store remains active internally for all
 * UI labels.
 */
export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  onNavigate?: () => void;
  href?: string;
}

const HEIGHT_PX = {
  sm: 28,
  md: 36,
  lg: 48,
} as const;

const TAGLINE_SIZE = {
  sm: "text-[10px]",
  md: "text-caption",
  lg: "text-body-sm",
} as const;

// Logo aspect ratio is 1024:246 ≈ 4.16:1
const ASPECT = 1024 / 246;

export function Logo({
  size = "md",
  showTagline = false,
  className,
  onNavigate,
  href = "/",
}: LogoProps) {
  const { t } = useBilingual();
  const height = HEIGHT_PX[size];
  const width = Math.round(height * ASPECT);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn("inline-flex items-center gap-2.5 group", className)}
      aria-label={`${t("brand.name")} — ${t("brand.tagline")}`}
    >
      <Image
        src="/logo.png"
        alt={`${t("brand.name")} — ${t("brand.tagline")}`}
        width={width}
        height={height}
        className="object-contain transition-transform group-hover:scale-[1.02]"
        priority
      />
      {showTagline && (
        <span
          className={cn(
            "text-muted-foreground hidden sm:block leading-none mt-1",
            TAGLINE_SIZE[size]
          )}
        >
          {t("brand.tagline")}
        </span>
      )}
    </Link>
  );
}
