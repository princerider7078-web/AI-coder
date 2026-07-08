"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { QUICK_CATEGORIES } from "@/data/homepageData";

export function QuickCategoryGrid() {
  return (
    <section className="section-padding bg-[#F3F8F1]">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-widest uppercase text-[#E8930A]">Browse By Category</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#1A6B3C]">Find Your Perfect Plant</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#1A6B3C] hover:text-[#16A34A] flex items-center gap-1">
            View All <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Category grid */}
        <nav aria-label="Product categories">
          <ul className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {QUICK_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B3C]"
                >
                  <div className="relative size-14 md:size-16 rounded-full overflow-hidden bg-white border-2 border-slate-200 group-hover:border-[#1A6B3C]/40 transition-all group-hover:scale-105">
                    <Image src={cat.image} alt={cat.name} fill sizes="64px" className="object-cover" loading="lazy" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1A6B3C] transition-colors leading-tight">{cat.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.itemCount} items</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Browse All Categories button */}
        <div className="mt-6 text-center">
          <Link href="/shop" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1A6B3C] hover:bg-[#16A34A] text-white text-sm font-bold rounded-md transition-colors">
            Browse All Categories <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
