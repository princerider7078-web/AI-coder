import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Star, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/store/useBilingual";
import type { Provider } from "@/data/homepageData";

/**
 * ProviderCard — reusable gardener profile card.
 * Source: HOMEPAGE_AUDIT_REPORT.md M1 ("ProviderCard component is never used —
 * fix: build and use it"), C3 (next/image), C5 (no hardcoded hex).
 *
 * Used on: Homepage ProvidersSection, Providers directory page.
 */
export interface ProviderCardProps {
  provider: Provider;
  className?: string;
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  const { language } = useBilingual();
  const isHi = language === "hi";

  return (
    <Card
      className={cn(
        "group overflow-hidden flex flex-col h-full",
        "transition-all duration-200 ease-fast",
        "hover:shadow-md hover:border-primary/30"
      )}
    >
      <CardContent className="p-5 flex flex-col items-center text-center gap-3 flex-1">
        {/* Avatar */}
        <div className="relative">
          <div className="relative size-20 rounded-full overflow-hidden bg-muted ring-4 ring-primary/10">
            <Image
              src={provider.avatarImage}
              alt={provider.displayName}
              fill
              sizes="80px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          {provider.verified && (
            <BadgeCheck
              className="absolute -bottom-1 -right-1 size-7 text-primary bg-background rounded-full"
              aria-label="Verified"
            />
          )}
        </div>

        {/* Name */}
        <div>
          <h3 className="text-body font-semibold text-foreground">
            {provider.displayName}
          </h3>
          <p className="text-body-sm text-muted-foreground">
            {isHi ? provider.specialty.hi : provider.specialty.en}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <span className="text-body-sm font-semibold text-foreground tabular-nums">
              {provider.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-body-sm text-muted-foreground">
            ({provider.reviewCount})
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
          <Briefcase className="size-4" aria-hidden="true" />
          {provider.jobsCompleted}+ {isHi ? "काम पूरे" : "jobs completed"}
        </div>

        {/* Experience badge */}
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-caption font-medium">
          {provider.experienceYears}+ {isHi ? "वर्ष अनुभव" : "years experience"}
        </span>

        {/* CTA */}
        <Button asChild variant="outline" size="sm" className="w-full mt-auto">
          <Link href={`/providers/${provider.id}`}>
            {isHi ? "बुक करें" : "Book This Gardener"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
