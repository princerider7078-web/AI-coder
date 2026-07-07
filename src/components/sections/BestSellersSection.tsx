"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/feedback/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBilingual } from "@/store/useBilingual";
import { PRODUCTS, FILTER_TABS } from "@/data/homepageData";

/**
 * BestSellersSection — featured products with filter tabs.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (BestSellersSection), PRD §8.2 (FR-HOME-003/004/005)
 *
 * Audit fixes:
 *   - C2: Full ARIA on filter tabs (role="tablist", role="tab", aria-selected,
 *         aria-controls, role="tabpanel", id)
 *   - C5: No hardcoded hex
 *   - §5.1.2: xl:grid-cols-5 for very large screens (was max 4 cols)
 *   - §3.3.1: 8 products with filter tabs (no infinite scroll on homepage)
 *   - §3.3.3: Filter state is local (acceptable for single-page; persists
 *     within session via React state)
 *   - L6: role="tab" + aria-selected on filter tabs
 *   - M7: formatINR via ProductCard → Price component
 */
export function BestSellersSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.id === activeFilter);
    if (!tab) return PRODUCTS;
    return PRODUCTS.filter(tab.filter).slice(0, 8);
  }, [activeFilter]);

  return (
    <section className="section-py bg-muted/30">
      <Container>
        <SectionHeading
          overline={isHi ? "ग्राहकों के पसंदीदा" : "Customer Favourites"}
          title={isHi ? "बेस्ट सेलर्स" : "Best Sellers & New Arrivals"}
          subtitle={
            isHi
              ? "सोनीपत के ग्राहकों द्वारा सबसे पसंद किए गए पौधे"
              : "The most-loved plants by Sonipat customers"
          }
          action={{ label: isHi ? "सभी देखें" : "View All", href: "/shop" }}
        />

        {/* Filter tabs (audit C2 + L6 fix: full ARIA) */}
        <div
          role="tablist"
          aria-label={isHi ? "उत्पाद फ़िल्टर" : "Product filters"}
          className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-pretty pb-2"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = tab.id === activeFilter;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`filter-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="filter-tabpanel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap",
                  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:border-primary/30"
                )}
              >
                {isHi ? tab.label.hi : tab.label.en}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div
          id="filter-tabpanel"
          role="tabpanel"
          aria-labelledby={`filter-tab-${activeFilter}`}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          )}
        </div>

        {/* Mobile view-all CTA */}
        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" size="lg">
            <a href="/shop">{isHi ? "सभी उत्पाद देखें" : "View All Products"}</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
