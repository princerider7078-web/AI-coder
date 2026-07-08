import { Heart, Clock, Calendar, Leaf } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/common/Container";
import { WHY_CHOOSE_CARDS } from "@/data/homepageData";

const ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  clock: Clock,
  calendar: Calendar,
  leaf: Leaf,
};

export function WhyChooseUsSection() {
  return (
    <section className="py-12 md:py-16 bg-surface-container-low">
      <Container>
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-overline text-primary font-bold mb-2">WHY GROWPLANTS</p>
          <h2 className="text-h2 text-foreground mb-3">The GrowPlants Difference</h2>
          <p className="text-body text-muted-foreground">
            Sonipat's first professional plant &amp; gardening service built on quality, trust, and green values.
          </p>
        </div>

        {/* 4 feature cards (2×2 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {WHY_CHOOSE_CARDS.map((card) => {
            const Icon = ICON_MAP[card.icon] ?? Leaf;
            return (
              <div
                key={card.id}
                className="flex items-start gap-4 p-5 rounded-lg bg-card border border-border hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-h6 font-semibold text-foreground mb-1">{card.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{card.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
