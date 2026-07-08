import { Leaf, Truck, ShieldCheck, Sprout, Heart, Clock, Calendar, Recycle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/common/Container";
import { WHY_CHOOSE_CARDS } from "@/data/homepageData";

const ICON_MAP: Record<string, LucideIcon> = {
  leaf: Leaf, truck: Truck, shield: ShieldCheck, sprout: Sprout,
  heart: Heart, clock: Clock, calendar: Calendar, recycle: Recycle,
};

export function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#E8930A] mb-2">Why GrowPlants</p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#1A6B3C] mb-3">The GrowPlants Difference</h2>
          <p className="text-base text-slate-600">Sonipat&apos;s first professional plant &amp; gardening service built on quality, trust, and green values.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {WHY_CHOOSE_CARDS.map((card) => {
            const Icon = ICON_MAP[card.icon] ?? Leaf;
            return (
              <div key={card.id} className="flex flex-col items-start gap-3 p-5 rounded-lg bg-[#F3F8F1] border border-slate-100 hover:shadow-md hover:border-[#1A6B3C]/20 transition-all">
                <div className="size-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#E8930A15" }}>
                  <Icon className="size-6" style={{ color: "#E8930A" }} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
