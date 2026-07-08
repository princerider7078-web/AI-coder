"use client";

import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCTS, FILTER_TABS } from "@/data/homepageData";

export function BestSellersSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.id === activeFilter);
    if (!tab) return PRODUCTS;
    return PRODUCTS.filter(tab.filter);
  }, [activeFilter]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <Container>
        <SectionHeading
          overline="FEATURED PRODUCTS"
          title="Customer Favourites"
          action={{ label: "View Full Shop", href: "/shop" }}
        />

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Product filters"
          className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-pretty pb-2"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = tab.id === activeFilter;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:border-primary/30"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Explore All button */}
        <div className="mt-8 text-center">
          <Button asChild size="lg" variant="outline" className="gap-2">
            <a href="/shop">
              Explore All Plants
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
