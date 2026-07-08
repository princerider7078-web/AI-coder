"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/data/homepageData";

const AUTOPLAY_MS = 6000;

export function HeroSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    setActive((prev) => (idx + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goNext = () => goTo(active + 1);
  const goPrev = () => goTo(active - 1);

  useEffect(() => {
    if (paused) return;
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    autoplayRef.current = setTimeout(() => setActive((prev) => (prev + 1) % HERO_SLIDES.length), AUTOPLAY_MS);
    return () => { if (autoplayRef.current) clearTimeout(autoplayRef.current); };
  }, [active, paused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) { if (delta > 0) goPrev(); else goNext(); }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ height: "clamp(420px, 55vw, 600px)" }}
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === active;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${HERO_SLIDES.length}: ${slide.headline}`}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              )}
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

              <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-6 flex items-center">
                <div className="max-w-xl space-y-4 md:space-y-5">
                  {/* Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A6B3C]/95 backdrop-blur-md rounded-full border border-emerald-500/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    {slide.badge}
                  </span>

                  {/* Headline */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {slide.headline}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base md:text-lg text-white/90 max-w-md">
                    {slide.subtitle}
                  </p>

                  {/* Trust badge */}
                  <div className="flex items-center gap-1.5 text-white/95 text-sm font-semibold">
                    <Star className="size-4 fill-[#E8930A] text-[#E8930A]" aria-hidden="true" />
                    {slide.trustBadge}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button asChild size="lg" className="gap-2 bg-[#1A6B3C] hover:bg-[#16A34A] text-white text-sm md:text-base">
                      <Link href={slide.primaryCta.href}>
                        {slide.primaryCta.label}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-sm md:text-base bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white">
                      <Link href={slide.secondaryCta.href}>
                        {slide.secondaryCta.label}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-800 hover:bg-white hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" role="tablist" aria-label="Slide navigation">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={idx === active}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                idx === active ? "w-8 bg-[#E8930A]" : "w-2.5 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>

        {/* Progress bar */}
        {!paused && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
            <div
              key={active}
              className="h-full bg-[#E8930A]"
              style={{ animation: `hero-progress ${AUTOPLAY_MS}ms linear forwards` }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
