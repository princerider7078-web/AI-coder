import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

/**
 * SectionHeader — reusable section title + optional subtitle + optional
 * action link (e.g., "View All"). Used on home, shop, PDP related, account
 * dashboard, and most page-level sections.
 *
 * Layout:
 *   [Title / Subtitle block]                    [Action link →]
 *
 * Accessibility:
 *   - Title is h2 by default (overridable via `as` for nested sections)
 *   - Action link uses arrow icon with descriptive aria-label
 */
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  icon?: LucideIcon;
  as?: "h1" | "h2" | "h3";
  className?: string;
  align?: "start" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  action,
  icon: Icon,
  as: Tag = "h2",
  className,
  align = "start",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 flex-wrap",
        align === "center" && "flex-col items-center text-center",
        className
      )}
    >
      <div className={cn("flex flex-col gap-1", align === "center" && "items-center")}>
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="size-5 text-primary" aria-hidden="true" />
          )}
          <Tag className="text-h2 md:text-h2 text-foreground">
            {title}
          </Tag>
        </div>
        {subtitle && (
          <p className="text-body-sm text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <a
          href={action.href}
          onClick={action.onClick}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:text-primary-hover transition-colors group/action rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${action.label} — ${title}`}
        >
          {action.label}
          <ArrowRight
            className="size-4 transition-transform group-hover/action:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  );
}
