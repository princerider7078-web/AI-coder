import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/common/LogoMark";

/**
 * Logo — the GrowPlants brand lockup (icon + wordmark + optional tagline).
 * Used in the Header (desktop + mobile) and the Auth layout.
 *
 * The wordmark uses Plus Jakarta Sans 700 with -0.02em tracking to match
 * the design system typography (Part E.3).
 */
import { useBilingual } from "@/store/useBilingual";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  onNavigate?: () => void;
}

const WORDMARK_SIZE = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
} as const;

const TAGLINE_SIZE = {
  sm: "text-[10px]",
  md: "text-caption",
  lg: "text-body-sm",
} as const;

export function Logo({
  size = "md",
  showTagline = false,
  className,
  onNavigate,
}: LogoProps) {
  const { t } = useBilingual();
  const markSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";

  return (
    <a
      href="/"
      onClick={onNavigate}
      className={cn("inline-flex items-center gap-2.5 group", className)}
      aria-label={`${t("brand.name")} — ${t("brand.tagline")}`}
    >
      <LogoMark size={markSize} className="transition-transform group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            WORDMARK_SIZE[size]
          )}
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {t("brand.name")}
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-muted-foreground mt-0.5 hidden sm:block",
              TAGLINE_SIZE[size]
            )}
          >
            {t("brand.tagline")}
          </span>
        )}
      </span>
    </a>
  );
}
