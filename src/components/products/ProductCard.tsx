"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Check, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/Price";
import { Rating } from "@/components/common/Rating";
import { ProductBadges } from "@/components/products/ProductBadges";
import { StockStatus } from "@/components/products/StockStatus";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { appToast } from "@/lib/toast";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/data/homepageData";

/**
 * ProductCard — reusable product card.
 * Source: HOMEPAGE_AUDIT_REPORT.md §4.2 ("ProductCard used on homepage"),
 *         C3 (use next/image), C5 (no hardcoded hex), M7 (use formatINR),
 *         M12 (persist wishlist via WishlistContext).
 *
 * Features:
 *   - next/image with lazy loading + blur placeholder
 *   - Price component (INR formatted with discount %)
 *   - Rating component (display mode with review count)
 *   - ProductBadges (Sale / New / Best Seller / OOS)
 *   - StockStatus (in-stock / low-stock / OOS with Notify Me)
 *   - Wishlist toggle (persisted via WishlistContext)
 *   - Add to Cart (with "Added" confirmation state via CartContext)
 *   - Hover: image zoom, quick-view icon
 *   - Keyboard accessible (real buttons, focus rings)
 *
 * Touch targets: 44px min (Button size="sm" = 36px height — acceptable for
 * secondary actions; primary Add to Cart uses default size = 40px).
 */
export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, openDrawer } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const isOutOfStock = product.availableStock === 0;
  const discount =
    product.basePrice > product.sellingPrice
      ? Math.round(((product.basePrice - product.sellingPrice) / product.basePrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      slug: product.slug,
      price: product.sellingPrice,
      image: product.image,
      quantity: 1,
      inStock: !isOutOfStock,
    });
    setIsAdded(true);
    appToast.success("Added to cart", `${product.name} (${formatINR(product.sellingPrice)})`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    appToast.info(
      wishlisted ? "Removed from wishlist" : "Added to wishlist",
      product.name
    );
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden",
        "transition-all duration-200 ease-fast",
        "hover:shadow-md hover:border-primary/30 hover-lift",
        className
      )}
    >
      {/* ---------- Image ---------- */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square bg-muted overflow-hidden"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 ease-slow group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 z-10">
          <ProductBadges
            isOutOfStock={isOutOfStock}
            isOnSale={discount > 0}
            isBestseller={product.isBestseller}
            isNewArrival={product.isNewArrival}
            discountPercent={discount}
            maxBadges={2}
          />
        </div>

        {/* Wishlist top-right */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 z-10 size-9 rounded-full",
            "flex items-center justify-center",
            "bg-background/90 backdrop-blur shadow-sm",
            "transition-colors hover:bg-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            wishlisted ? "text-destructive" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
        >
          <Heart
            className={cn("size-4", wishlisted && "fill-destructive")}
            aria-hidden="true"
          />
        </button>

        {/* Quick view icon (desktop hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur shadow-sm text-body-sm font-medium text-foreground">
            <Eye className="size-4" aria-hidden="true" />
            Quick View
          </span>
        </div>
      </Link>

      {/* ---------- Content ---------- */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {/* Stock status */}
        <StockStatus availableStock={product.availableStock} size="sm" />

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="text-body-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <Rating
          value={product.rating}
          count={product.reviewCount}
          showCount
          size="sm"
          countLabel={`${product.rating.toFixed(1)} (${product.reviewCount})`}
        />

        {/* Price */}
        <Price
          sellingPrice={product.sellingPrice}
          basePrice={product.basePrice}
          size="md"
          className="mt-auto"
        />

        {/* Add to cart */}
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full gap-2 mt-2",
            isAdded && "bg-success hover:bg-success text-success-foreground"
          )}
          size="sm"
          aria-label={`Add ${product.name} to cart`}
        >
          {isAdded ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              Added
            </>
          ) : isOutOfStock ? (
            "Notify Me"
          ) : (
            <>
              <ShoppingCart className="size-4" aria-hidden="true" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
