"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, ShieldCheck, Clock, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { SERVICES, BOOKING_STEPS, SERVICE_TRUST_BADGES, SERVICE_CATEGORIES_STRIP } from "@/data/homepageData";

const TRUST_ICONS = [ShieldCheck, Star, Clock, Users];

export function ServicesSection() {
  return (
    <>
      {/* ---------- Service Categories Strip ---------- */}
      <section className="border-y border-border bg-card">
        <Container>
          <ul className="flex items-center justify-between overflow-x-auto scrollbar-pretty py-3 gap-4">
            {SERVICE_CATEGORIES_STRIP.map((cat) => (
              <li key={cat} className="shrink-0">
                <Link
                  href={`/services?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-1.5 text-body-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Services Section ---------- */}
      <section className="py-12 md:py-16 bg-background">
        <Container>
          {/* Section header */}
          <div className="mb-8 space-y-2">
            <p className="text-overline text-primary font-bold">PROFESSIONAL SERVICES</p>
            <h2 className="text-h2 text-foreground">Expert Gardeners, At Your Doorstep</h2>
            <p className="text-body text-muted-foreground max-w-2xl">
              From balcony garden setup to monthly maintenance — our verified experts handle every task, every time.
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded text-caption font-bold bg-primary text-primary-foreground">
                    {service.categoryBadge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="text-h5 font-semibold text-foreground">{service.name}</h3>
                  <p className="text-body-sm text-muted-foreground line-clamp-3">{service.description}</p>

                  {/* Rating + bookings */}
                  <div className="flex items-center gap-3 text-body-sm">
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                      <span className="font-semibold text-foreground tabular-nums">{service.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{service.bookingCount}+ bookings</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border">
                    <div>
                      <p className="text-caption text-muted-foreground">
                        {service.pricingType === "quote_based" ? "PRICE STARTS AT" : "PRICE STARTS AT"}
                      </p>
                      <p className="text-h5 font-bold text-primary tabular-nums">
                        {service.pricingType === "quote_based" ? "Custom Quote" : `${formatINR(service.priceFrom)}`}
                        {service.priceUnit && (
                          <span className="text-body-sm font-normal text-muted-foreground"> / {service.priceUnit}</span>
                        )}
                      </p>
                    </div>
                    <Button asChild size="sm" className="gap-1.5">
                      <Link href={service.href}>
                        {service.pricingType === "quote_based" ? "Custom Quote" : "Book Now"}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- How Booking Works (dark green) ---------- */}
          <div className="rounded-xl bg-primary text-primary-foreground p-6 md:p-10 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-h3 font-bold">How Booking Works — 4 Simple Steps</h3>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {BOOKING_STEPS.map((step) => (
                <li key={step.step} className="flex flex-col items-center text-center gap-2">
                  <div className="size-14 rounded-full bg-primary-foreground/15 text-primary-foreground flex items-center justify-center text-h4 font-bold tabular-nums border-2 border-primary-foreground/30">
                    {step.step}
                  </div>
                  <h4 className="text-body font-semibold">{step.title}</h4>
                  <p className="text-body-sm text-primary-foreground/80 max-w-xs">{step.description}</p>
                </li>
              ))}
            </ol>
            <div className="text-center">
              <Button asChild variant="secondary" className="bg-warning text-on-warning hover:bg-warning/90 gap-2">
                <Link href="/services">
                  Browse All Services
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* ---------- Trust Badges ---------- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICE_TRUST_BADGES.map((badge, i) => {
              const Icon = TRUST_ICONS[i] ?? CheckCircle2;
              return (
                <div key={badge} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-border">
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <p className="text-body-sm font-semibold text-foreground">{badge}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
