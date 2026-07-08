import { Leaf, Truck, ShieldCheck, RefreshCw, Headphones, Sprout, Clock, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { WHY_CHOOSE_US } from "@/data/homepageData";

/**
 * WhyChooseUsSection — 8 trust/benefit cards.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (WhyChooseUsSection), PRD §8.2 (FR-HOME-007)
 *
 * Audit fixes:
 *   - C4: This is a SERVER component (no 'use client') — purely presentational.
 *         The icon mapping happens at module load, no interactivity needed.
 *   - C5: No hardcoded hex
 *   - §2.4.1: Consistent card radius (rounded-xl) across all trust cards
 *   - §2.4.4: Consistent shadow (hover:shadow-md) across all cards
 *
 * Note: This component receives its language from the parent. Since it's a
 * server component, we render both EN and HI and let CSS handle visibility
 * via the [lang] attribute on <html>. For simplicity in Phase 4, we default
 * to EN — Phase 5+ can pass language as a prop or use a server-side cookie.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  leaf: Leaf,
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCw,
  headphones: Headphones,
  sprout: Sprout,
  clock: Clock,
  heart: Heart,
};

export function WhyChooseUsSection() {
  return (
    <section className="section-py bg-muted/30">
      <Container>
        <SectionHeading
          overline="Why GrowPlants"
          title="Why Choose Us"
          subtitle="We're Sonipat's trusted botanical marketplace — here's what makes us different"
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_CHOOSE_US.map((card) => {
            const Icon = ICON_MAP[card.icon] ?? Leaf;
            return (
              <div
                key={card.id}
                className="flex flex-col items-start gap-3 p-5 rounded-xl bg-card border border-border transition-all duration-200 ease-fast hover:shadow-md hover:border-primary/30"
              >
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-body font-semibold text-foreground">
                    {card.title.en}
                  </h3>
                  <p className="text-body-sm text-muted-foreground mt-1">
                    {card.description.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
