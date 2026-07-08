"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { QUICK_CATEGORIES } from "@/data/homepageData";

export function QuickCategoryGrid() {
  return (
    <section className="py-12 md:py-16 bg-surface-container-low">
      <Container>
        <SectionHeading
          overline="BROWSE BY CATEGORY"
          title="Find Your Perfect Plant"
          action={{ label: "View All", href: "/shop" }}
        />

        <nav aria-label="Product categories">
          <ul className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mt-8">
            {QUICK_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="relative size-14 md:size-16 rounded-full overflow-hidden bg-card border-2 border-border group-hover:border-primary/40 transition-all group-hover:scale-105">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {cat.itemCount} items
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
