"use client";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { BadgeCheck, Star, Users, Calendar } from "lucide-react";
import { useBilingual } from "@/store/useBilingual";
import { SERVICES, BOOKING_STEPS } from "@/data/homepageData";

/**
 * ServicesSection — gardening service offerings + booking flow steps + trust badges.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (ServicesSection), PRD §8.2 (FR-HOME-006)
 *
 * Audit fixes:
 *   - C3: next/image (via ServiceCard)
 *   - C5: No hardcoded hex
 *   - C4: This section is 'use client' only because ServiceCard uses useBilingual
 *   - Uses reusable ServiceCard component (not inline cards)
 *   - "How Booking Works" process strip
 *   - Trust badges row (Background Verified, 4.8★ Rating, etc.)
 */
const TRUST_BADGES = [
  { icon: BadgeCheck, labelEn: "Background Verified", labelHi: "पृष्ठभूमि सत्यापित" },
  { icon: Star, labelEn: "4.8★ Average Rating", labelHi: "4.8★ औसत रेटिंग" },
  { icon: Users, labelEn: "20+ Expert Gardeners", labelHi: "20+ विशेषज्ञ माली" },
  { icon: Calendar, labelEn: "Flexible Slots", labelHi: "लचीले स्लॉट" },
];

export function ServicesSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";

  return (
    <section className="section-py bg-background">
      <Container>
        <SectionHeading
          overline={isHi ? "बागवानी सेवाएं" : "Gardening Services"}
          title={isHi ? "घर पर माली बुक करें" : "Book a Gardener at Home"}
          subtitle={
            isHi
              ? "बालकनी सेटअप से लेकर लैंडस्केप डिज़ाइन तक — सत्यापित स्थानीय विशेषज्ञ"
              : "From balcony setup to landscape design — verified local experts"
          }
          action={{ label: isHi ? "सभी सेवाएं" : "All Services", href: "/services" }}
        />

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* How Booking Works */}
        <div className="rounded-2xl bg-muted/50 p-6 md:p-8">
          <div className="text-center mb-8">
            <p className="text-overline text-primary font-semibold mb-2">
              {isHi ? "कैसे काम करता है" : "How It Works"}
            </p>
            <h3 className="text-h3 text-foreground">
              {isHi ? "बुकिंग इतनी आसान" : "Booking Made Simple"}
            </h3>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOOKING_STEPS.map((step) => (
              <li key={step.id} className="flex flex-col items-center text-center gap-2">
                <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-h4 font-bold tabular-nums">
                  {step.step}
                </div>
                <h4 className="text-body font-semibold text-foreground">
                  {isHi ? step.title.hi : step.title.en}
                </h4>
                <p className="text-body-sm text-muted-foreground">
                  {isHi ? step.description.hi : step.description.en}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Trust badges row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.labelEn}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
            >
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <badge.icon className="size-5" aria-hidden="true" />
              </div>
              <p className="text-body-sm font-medium text-foreground">
                {isHi ? badge.labelHi : badge.labelEn}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
