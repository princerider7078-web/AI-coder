"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProviderCard } from "@/components/services/ProviderCard";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/store/useBilingual";
import { PROVIDERS } from "@/data/homepageData";

/**
 * ProvidersSection — 4 gardener profiles + "Become a Provider" CTA.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (ProvidersSection), PRD §8.2 (FR-HOME-006)
 *
 * Audit fixes:
 *   - C5: No hardcoded hex
 *   - M1: Uses reusable ProviderCard component (not inline cards)
 *   - C6: Links to /become-provider and /providers (these are future routes;
 *         they will 404 until Phase 11 builds them, but the links are correct)
 *   - §3.2.2: "Become a Provider" CTA is positioned after provider profiles
 *     (auditor noted it's buried — but per BRD this is the right audience
 *     context; we keep it here but make it prominent)
 */
export function ProvidersSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";

  return (
    <section className="section-py bg-background">
      <Container>
        <SectionHeading
          overline={isHi ? "हमारे माली" : "Our Gardeners"}
          title={isHi ? "सत्यापित विशेषज्ञ माली" : "Meet Our Verified Gardeners"}
          subtitle={
            isHi
              ? "पृष्ठभूमि-जांच, प्रशिक्षित, और ग्राहकों द्वारा रेटेड"
              : "Background-checked, trained, and rated by happy customers"
          }
          action={{ label: isHi ? "सभी माली देखें" : "View All Gardeners", href: "/providers" }}
        />

        {/* Provider cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        {/* Become a Provider CTA banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 md:p-8">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-body-sm font-medium">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {isHi ? "क्या आप माली हैं?" : "Are you a gardener?"}
              </span>
              <h3 className="text-h3 font-bold">
                {isHi ? "ग्रोप्लांट्स के साथ कमाई करें" : "Earn with GrowPlants"}
              </h3>
              <p className="text-body-sm text-primary-foreground/90">
                {isHi
                  ? "सोनीपत में अपनी बागवानी सेवाएं दिखाएं। अपना शेड्यूल तय करें, अपने नियम बनाएं।"
                  : "List your gardening services in Sonipat. Set your schedule, work on your terms."}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="shrink-0 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link href="/become-provider">
                {isHi ? "प्रदाता बनें" : "Become a Provider"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Decorative leaves */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none" aria-hidden="true">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <path d="M100 20 C 60 60, 60 140, 100 180 C 140 140, 140 60, 100 20 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
