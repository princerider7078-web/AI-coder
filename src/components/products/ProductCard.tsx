"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Check, Star, Sun, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { appToast } from "@/lib/toast";
import type { Product } from "@/data/homepageData";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.availableStock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      quantity: 1,
      inStock: !isOutOfStock,
    });
    setIsAdded(true);
    appToast.success("Added to cart", `${product.name} (${formatINR(product.price)})`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    appToast.info(wishlisted ? "Removed from wishlist" : "Added to wishlist", product.name);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        "transition-all duration-200 hover:shadow-md hover:border-primary/30",
        className
      )}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-muted overflow-hidden" aria-label={`View ${product.name}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isBestseller && (
            <span className="px-2 py-0.5 rounded text-caption font-bold bg-warning text-on-warning">
              BESTSELLER
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded text-caption font-bold bg-error text-on-error">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist top-right */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 z-10 size-8 rounded-full",
            "flex items-center justify-center",
            "bg-background/90 backdrop-blur shadow-sm transition-colors hover:bg-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            wishlisted ? "text-destructive" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
        >
          <Heart className={cn("size-4", wishlisted && "fill-destructive")} aria-hidden="true" />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        {/* Category badge */}
        <p className="text-caption font-bold text-primary tracking-wide">
          {product.categoryBadge}
        </p>

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="text-body-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
          <span className="text-body-sm font-semibold text-foreground tabular-nums">
            {product.rating > 0 ? product.rating.toFixed(1) : "New"}
          </span>
          <span className="text-body-sm text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Sun + Water info */}
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sun className="size-3" aria-hidden="true" />
            {product.sunInfo}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Droplets className="size-3" aria-hidden="true" />
            {product.waterInfo}
          </span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div>
            <p className="text-h5 font-bold text-primary tabular-nums">
              {formatINR(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-caption text-muted-foreground line-through tabular-nums">
                {formatINR(product.originalPrice)}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size="sm"
            className={cn("gap-1.5", isAdded && "bg-success hover:bg-success text-success-foreground")}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <><Check className="size-3.5" aria-hidden="true" />Added</>
            ) : (
              <><ShoppingCart className="size-3.5" aria-hidden="true" />Add to Cart</>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
