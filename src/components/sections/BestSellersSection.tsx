"use client";

import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCTS, FILTER_TABS } from "@/data/homepageData";

export function BestSellersSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.id === activeFilter);
    return tab ? PRODUCTS.filter(tab.filter) : PRODUCTS;
  }, [activeFilter]);

  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-widest uppercase text-[#E8930A]">Featured Products</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#1A6B3C]">Customer Favourites</h2>
          </div>
          <a href="/shop" className="text-sm font-semibold text-[#1A6B3C] hover:text-[#16A34A] flex items-center gap-1">
            View Full Shop <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Filter tabs */}
        <div role="tablist" aria-label="Product filters" className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {FILTER_TABS.map((tab) => {
            const isActive = tab.id === activeFilter;
            return (
              <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => setActiveFilter(tab.id)}
                className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B3C]",
                  isActive ? "bg-[#1A6B3C] text-white" : "bg-white text-slate-700 border border-slate-200 hover:border-[#1A6B3C]/30")}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        <div className="mt-8 text-center">
          <Button asChild size="lg" variant="outline" className="gap-2 border-[#1A6B3C] text-[#1A6B3C] hover:bg-[#1A6B3C] hover:text-white">
            <a href="/shop">Explore All Plants <ArrowRight className="size-4" aria-hidden="true" /></a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
