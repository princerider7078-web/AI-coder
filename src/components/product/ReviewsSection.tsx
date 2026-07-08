"use client";

import { useState } from "react";
import { Star, BadgeCheck, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/lib/product-data";

export function ReviewsSection({
  productSlug,
  rating,
  reviewCount,
  reviews,
}: {
  productSlug: string;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
}) {
  const [filter, setFilter] = useState<number | null>(null);

  const filtered = filter ? reviews.filter((r) => Math.round(r.rating) === filter) : reviews;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    percentage: reviews.length > 0 ? Math.round((reviews.filter((r) => Math.round(r.rating) === stars).length / reviews.length) * 100) : 0,
  }));

  return (
    <div className="border-t border-gray-200 pt-8 lg:pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating summary */}
        <div className="space-y-4">
          <div className="text-center p-5 bg-[#F3F8F1] rounded-xl">
            <p className="text-4xl font-bold text-[#1A6B3C] tabular-nums">{rating.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("size-4", s <= Math.round(rating) ? "fill-[#E8930A] text-[#E8930A]" : "text-gray-200")} aria-hidden="true" />
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-1">{reviewCount} reviews</p>
          </div>

          {/* Histogram */}
          <div className="space-y-1.5">
            {breakdown.map((b) => (
              <button
                key={b.stars}
                onClick={() => setFilter(filter === b.stars ? null : b.stars)}
                className={cn("flex items-center gap-2 w-full p-1.5 rounded-md hover:bg-slate-50 transition-colors", filter === b.stars && "bg-slate-100")}
              >
                <span className="text-xs text-slate-600 w-12 text-right">{b.stars} star</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#E8930A]" style={{ width: `${b.percentage}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-8 tabular-nums">{b.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="lg:col-span-2 space-y-4">
          {filter && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Filtered by: {filter} stars</span>
              <button onClick={() => setFilter(null)} className="text-[#1A6B3C] font-medium hover:underline">Clear</button>
            </div>
          )}
          {filtered.length > 0 ? (
            filtered.map((review) => (
              <div key={review.id} className="p-5 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-9 rounded-full bg-[#1A6B3C] text-white flex items-center justify-center text-sm font-bold">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                        {review.author}
                        {review.verified && <BadgeCheck className="size-4 text-[#1A6B3C]" aria-hidden="true" />}
                      </p>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("size-3.5", s <= review.rating ? "fill-[#E8930A] text-[#E8930A]" : "text-gray-200")} aria-hidden="true" />
                    ))}
                  </div>
                </div>
                {review.title && <p className="text-sm font-semibold text-slate-800 mb-1">{review.title}</p>}
                <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#1A6B3C]">
                    <ThumbsUp className="size-3.5" aria-hidden="true" /> Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">No reviews for this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
