"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS, TESTIMONIAL_STATS } from "@/data/homepageData";

const AUTOPLAY_MS = 7000;

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    setActive((prev) => (idx + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (paused || TESTIMONIALS.length <= 1) return;
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
      className="bg-primary text-primary-foreground scroll-mt-20"
    >
      <Container className="py-12 md:py-16">
        {/* ---------- Testimonial carousel ---------- */}
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
                  "transition-opacity duration-500",
                  isActive ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                )}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Avatar */}
                  <div className="relative size-16 rounded-full overflow-hidden bg-primary-foreground/20 ring-2 ring-primary-foreground/30">
                    <Image
                      src={testimonial.avatarImage}
                      alt={testimonial.customerName}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Name + verified */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-h5 font-semibold">{testimonial.customerName}</h3>
                    <BadgeCheck className="size-5 text-success" aria-hidden="true" />
                  </div>

                  {/* 5 stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-4 fill-warning text-warning" aria-hidden="true" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-body-lg leading-relaxed max-w-2xl">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>

                  <p className="text-body-sm text-primary-foreground/70">{testimonial.attribution}</p>
                </div>
              </div>
            );
          })}

          {/* Arrows (only if multiple testimonials) */}
          {TESTIMONIALS.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 size-10 rounded-full bg-primary-foreground/10 backdrop-blur flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-10 rounded-full bg-primary-foreground/10 backdrop-blur flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                aria-label="Next testimonial"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>

              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === active}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    onClick={() => goTo(idx)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground",
                      idx === active ? "w-8 bg-warning" : "w-2.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>

      {/* ---------- Statistics bar ---------- */}
      <div className="border-t border-primary-foreground/15">
        <Container className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TESTIMONIAL_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-h2 md:text-h1 font-bold text-primary-foreground tabular-nums">
                  {stat.value}
                </p>
                <p className="text-body-sm text-primary-foreground/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
