import { cn } from "@/lib/utils";

/**
 * Container — responsive max-width wrapper.
 * Uses the container-mw + container-px utilities from globals.css.
 *
 * Variants:
 *   - default: max-w-7xl (1280px) — standard page content
 *   - narrow: max-w-4xl (896px) — articles, legal pages, auth forms
 *   - wide: max-w-[1600px] — admin tables, dashboards
 */
export interface ContainerProps {
  children: React.ReactNode;
  variant?: "default" | "narrow" | "wide";
  className?: string;
  as?: "div" | "section" | "main" | "article" | "aside" | "header" | "footer";
}

const VARIANT_CLASSES = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-[1600px]",
} as const;

export function Container({
  children,
  variant = "default",
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
}
