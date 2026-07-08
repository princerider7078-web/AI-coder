"use client";

import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ReviewsSection — shows honest review state.
 * If no rating/review data exists: "No reviews yet — be the first"
 * If rating exists but no individual reviews: shows overall rating + distribution placeholder
 */
export function ReviewsSection({
  rating,
  reviewCount,
  productName,
}: {
  rating: number | null;
  reviewCount: number | null;
  productName: string;
}) {
  // No rating data at all → honest empty state
  if (rating === null || reviewCount === null || reviewCount === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center bg-[#F3F8F1] rounded-xl">
          <div className="size-14 rounded-full bg-white flex items-center justify-center mb-3">
            <MessageSquare className="size-6 text-[#1A6B3C]" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">No reviews yet — be the first</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            {productName} hasn&apos;t been reviewed yet. Share your experience to help other plant lovers.
          </p>
          <Button className="mt-4 bg-[#1A6B3C] hover:bg-[#16A34A] gap-2">
            <Star className="size-4" aria-hidden="true" />
            Write a Review
          </Button>
        </div>
      </div>
    );
  }

  // Has overall rating + count but no individual review data
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating summary */}
        <div className="text-center p-5 bg-[#F3F8F1] rounded-xl">
          <p className="text-4xl font-bold text-[#1A6B3C] tabular-nums">{rating.toFixed(1)}</p>
          <div className="flex items-center justify-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`size-4 ${s <= Math.round(rating) ? "fill-[#E8930A] text-[#E8930A]" : "text-gray-200"}`} />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-1">{reviewCount} reviews</p>
        </div>

        {/* Review list placeholder */}
        <div className="lg:col-span-2">
          <p className="text-sm text-slate-500 text-center py-8">
            Individual reviews are not available yet. Based on {reviewCount} customer ratings, this product has an average of {rating.toFixed(1)} stars.
          </p>
        </div>
      </div>
    </div>
  );
}
