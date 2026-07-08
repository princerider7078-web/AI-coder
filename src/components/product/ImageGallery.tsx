"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/product-data";

export function ImageGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!images.length) {
    return <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">No image</div>;
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <Image
          src={images[active].url}
          alt={images[active].alt || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <button
          className="absolute top-3 right-3 size-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-600 hover:bg-white"
          aria-label="Zoom image"
        >
          <ZoomIn className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-pretty">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                i === active ? "border-[#1A6B3C]" : "border-slate-200 hover:border-slate-300"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-3xl w-full aspect-square">
            <Image src={images[active].url} alt={productName} fill sizes="100vw" className="object-contain" />
            <button
              className="absolute top-4 right-4 size-10 rounded-full bg-white/90 flex items-center justify-center text-slate-800"
              onClick={() => setZoomed(false)}
              aria-label="Close zoom"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
