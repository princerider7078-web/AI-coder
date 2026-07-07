"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/common/Rating";
import { useBilingual } from "@/store/useBilingual";
import { TESTIMONIALS, TESTIMONIAL_STATS } from "@/data/homepageData";
import { formatINR, formatNumberIN } from "@/lib/utils";

/**
 * TestimonialsSection — social proof carousel + stats row.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (TestimonialsSection), PRD §8.2 (FR-HOME-008)
 *
 * Audit fixes:
 *   - C2: Full ARIA on carousel (role="region", aria-roledescription="carousel",
 *         aria-live, aria-current on dots)
 *   - C6: id="testimonials" anchor (fixes /#testimonials broken link)
 *   - C5: No hardcoded hex
 *   - §7.2.4: Testimonials carousel has ARIA live region
 *   - §5.3.5: Touch-friendly dots (10px min)
 *   - Pause on hover/focus + reduced-motion support
 *   - Stats row showing social proof numbers
 */
const AUTOPLAY_MS = 7000;

export function TestimonialsSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    setActive((prev) => (idx + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (paused) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    autoplayRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_MS);

    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [active, paused]);

  return (
    <section
      id="testimonials"
      className="section-py bg-muted/30 scroll-mt-20"
    >
      <Container>
        <SectionHeading
          overline={isHi ? "ग्राहक समीक्षाएं" : "Customer Reviews"}
          title={isHi ? "हमारे खुशहाल ग्राहक" : "Loved by Sonipat Gardeners"}
          subtitle={
            isHi
              ? "हमारे 1,200+ ग्राहकों की असली कहानियां पढ़ें"
              : "Read real stories from our 1,200+ happy customers"
          }
          align="center"
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
          <StatCard
            value={formatNumberIN(TESTIMONIAL_STATS.happyCustomers)}
            label={isHi ? "खुशहाल ग्राहक" : "Happy Customers"}
            suffix="+"
          />
          <StatCard
            value={TESTIMONIAL_STATS.averageRating.toFixed(1)}
            label={isHi ? "औसत रेटिंग" : "Average Rating"}
            prefix="★"
          />
          <StatCard
            value={formatNumberIN(TESTIMONIAL_STATS.totalReviews)}
            label={isHi ? "कुल समीक्षाएं" : "Total Reviews"}
            suffix="+"
          />
          <StatCard
            value={String(TESTIMONIAL_STATS.citiesServed)}
            label={isHi ? "शहर" : "City Served"}
          />
        </div>

        {/* Testimonial carousel */}
        <div
          className="relative max-w-3xl mx-auto"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 md:p-8 min-h-[280px]">
            <Quote
              className="absolute top-4 right-4 size-12 text-primary/10"
              aria-hidden="true"
            />
            {TESTIMONIALS.map((testimonial, idx) => {
              const isActive = idx === active;
              return (
                <div
                  key={testimonial.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Testimonial ${idx + 1} of ${TESTIMONIALS.length}`}
                  aria-hidden={!isActive}
                  className={cn(
                    "transition-opacity duration-500 ease-slow",
                    isActive ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <Rating value={testimonial.rating} size="md" />
                    <blockquote className="text-body-lg text-foreground leading-relaxed">
                      &ldquo;{isHi ? testimonial.text.hi : testimonial.text.en}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-body">
                        {testimonial.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-body font-semibold text-foreground">
                          {testimonial.customerName}
                        </p>
                        <p className="text-body-sm text-muted-foreground">
                          {testimonial.customerCity} · {testimonial.plantName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/90 backdrop-blur shadow-md flex items-center justify-center text-foreground hover:bg-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/90 backdrop-blur shadow-md flex items-center justify-center text-foreground hover:bg-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          {/* Dots */}
          <div
            className="flex items-center justify-center gap-2 mt-4"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={idx === active}
                aria-current={idx === active ? "true" : undefined}
                aria-label={`Go to testimonial ${idx + 1}`}
                onClick={() => goTo(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  idx === active ? "w-8 bg-primary" : "w-2.5 bg-foreground/30 hover:bg-foreground/50"
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function StatCard({
  value,
  label,
  prefix,
  suffix,
}: {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-h2 md:text-h1 font-bold text-foreground tabular-nums">
        {prefix && <span className="text-primary">{prefix}</span>}
        {value}
        {suffix && <span className="text-primary">{suffix}</span>}
      </p>
      <p className="text-body-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
