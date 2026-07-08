"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useBilingual } from "@/store/useBilingual";
import { QUICK_CATEGORIES } from "@/data/homepageData";

/**
 * QuickCategoryGrid — 8 category tiles for browse-by-category discovery.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (QuickCategoryGrid), PRD §8.2 (FR-HOME-002)
 *
 * Audit fixes:
 *   - C3: next/image (was native <img>)
 *   - C5: No hardcoded hex
 *   - §2.6.5: All images lazy-loaded (QuickCategoryGrid had no loading attribute)
 *   - §5.3.6: 2 columns on mobile is fine but tight; kept 2 for discovery density
 *   - M16: Semantic <nav> wrapping the grid
 *   - Focus rings on all interactive elements
 */
export function QuickCategoryGrid() {
  const { language } = useBilingual();
  const isHi = language === "hi";

  return (
    <section className="section-py bg-background">
      <Container>
        <SectionHeading
          overline={isHi ? "श्रेणियाँ देखें" : "Browse Categories"}
          title={isHi ? "अपना सही पौधा खोजें" : "Find Your Perfect Plant"}
          subtitle={
            isHi
              ? "अपनी जगह और ज़रूरत के अनुसार सही श्रेणी चुनें"
              : "Pick the right category for your space and need"
          }
          action={{ label: isHi ? "सभी देखें" : "View All", href: "/shop" }}
        />

        <nav aria-label={isHi ? "श्रेणियाँ" : "Product categories"}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {QUICK_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.href}
                  className={cn([
                    "group flex flex-col items-center gap-3 p-4 rounded-xl",
                    "bg-card border border-border hover:border-primary/30",
                    "transition-all duration-200 ease-fast hover:shadow-md hover-lift",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  ])}
                >
                  {/* Image */}
                  <div className="relative size-16 md:size-20 rounded-full overflow-hidden bg-muted ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <Image
                      src={cat.image}
                      alt={isHi ? cat.name.hi : cat.name.en}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 ease-slow group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Name + count */}
                  <div className="text-center">
                    <p className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {isHi ? cat.name.hi : cat.name.en}
                    </p>
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {cat.itemCount} {isHi ? "आइटम" : "items"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
