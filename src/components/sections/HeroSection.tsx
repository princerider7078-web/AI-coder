"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/data/homepageData";

/**
 * HeroSection — full-width hero with gardener image + dark overlay + white text.
 * Matches the screenshot design exactly.
 */
export function HeroSection() {
  const slide = HERO_SLIDES[0];

  return (
    <section className="relative w-full" aria-label="Hero">
      <div className="relative h-[500px] md:h-[560px] lg:h-[600px] overflow-hidden">
        {/* Background image */}
        <Image
          src={slide.image}
          alt={slide.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        {/* Content */}
        <div className="relative h-full container-mw container-px flex items-center">
          <div className="max-w-2xl space-y-5">
            {/* Verified badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-body-sm font-bold uppercase tracking-wide">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {slide.badge}
            </span>

            {/* Headline */}
            <h1 className="text-h1 md:text-display text-white font-bold leading-tight">
              {slide.headline}
            </h1>

            {/* Subtitle */}
            <p className="text-body-lg text-white/90 max-w-xl">
              {slide.subtitle}
            </p>

            {/* Trust badge */}
            {slide.trustBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-body-sm font-medium">
                <ShieldCheck className="size-4 text-success" aria-hidden="true" />
                {slide.trustBadge}
              </span>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2 text-base md:text-lg">
                <Link href={slide.primaryCta.href}>
                  {slide.primaryCta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base md:text-lg bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white">
                <Link href={slide.secondaryCta.href}>
                  {slide.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
