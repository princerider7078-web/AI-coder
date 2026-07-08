import Image from "next/image";
import Link from "next/link";
import { Clock, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { useBilingual } from "@/store/useBilingual";
import type { Service } from "@/data/homepageData";

/**
 * ServiceCard — reusable gardening service card.
 * Source: HOMEPAGE_AUDIT_REPORT.md §4.2 (ServiceCard used on homepage),
 *         C3 (next/image), C5 (no hardcoded hex), M7 (formatINR).
 *
 * Used on: Homepage ServicesSection, Services listing page.
 */
export interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const { language } = useBilingual();
  const isHi = language === "hi";

  const priceLabel =
    service.pricingType === "quote_based"
      ? isHi ? "कोटेशन पाएं" : "Get Quote"
      : service.pricingType === "hourly"
      ? `${formatINR(service.priceFrom)}${isHi ? "/घंटा से" : "/hr onwards"}`
      : `${isHi ? "से" : "from"} ${formatINR(service.priceFrom)}`;

  return (
    <Card
      className={cn(
        "group overflow-hidden flex flex-col h-full",
        "transition-all duration-200 ease-fast",
        "hover:shadow-md hover:border-primary/30"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        <Image
          src={service.image}
          alt={isHi ? service.name.hi : service.name.en}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-slow group-hover:scale-105"
          loading="lazy"
        />
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur border-0">
          {service.pricingType === "fixed" && (isHi ? "निश्चित मूल्य" : "Fixed Price")}
          {service.pricingType === "hourly" && (isHi ? "प्रति घंटा" : "Hourly")}
          {service.pricingType === "quote_based" && (isHi ? "कस्टम" : "Custom Quote")}
        </Badge>
      </div>

      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        {/* Name */}
        <h3 className="text-h4 font-semibold text-foreground">
          {isHi ? service.name.hi : service.name.en}
        </h3>

        {/* Description */}
        <p className="text-body-sm text-muted-foreground line-clamp-2">
          {isHi ? service.description.hi : service.description.en}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          {isHi ? service.duration.hi : service.duration.en}
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mt-1">
          {(isHi ? service.features.hi : service.features.en).slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-body-sm text-foreground">
              <Check className="size-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border">
          <div>
            <p className="text-caption text-muted-foreground">
              {isHi ? "कीमत" : "Price"}
            </p>
            <p className="text-h4 font-bold text-foreground">{priceLabel}</p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href={service.href}>
              {isHi ? "बुक करें" : "Book Now"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
