"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Share2, Check, Minus, Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { appToast } from "@/lib/toast";
import { formatINR, discountPercent } from "@/lib/utils";

interface ProductPricingPanelProps {
  price: number; salePrice: number | null; discount: number | null; savings: number | null;
  inStock: boolean; isBestSeller: boolean;
  productId: string; productName: string; productSlug: string; image: string;
  categoryName: string; categorySlug: string; stockQuantity: number;
  prices: Record<string, number> | null; productType: string;
}

export function ProductPricingPanel(props: ProductPricingPanelProps) {
  const { addItem, openDrawer } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    props.prices ? Object.keys(props.prices)[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const displayPrice = props.prices && selectedVariant ? props.prices[selectedVariant] : (props.salePrice ?? props.price);
  const discount = props.discount ?? discountPercent(props.price, displayPrice);
  const wishlisted = isWishlisted(props.productId);

  const handleAddToCart = () => {
    addItem({
      productId: props.productId,
      variantId: selectedVariant,
      name: `${props.productName}${selectedVariant ? ` (${selectedVariant})` : ""}`,
      slug: props.productSlug,
      price: displayPrice,
      image: props.image,
      quantity,
      inStock: props.inStock,
    });
    setIsAdded(true);
    appToast.success("Added to cart", `${props.productName} (${formatINR(displayPrice)})`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addItem({
      productId: props.productId,
      variantId: selectedVariant,
      name: `${props.productName}${selectedVariant ? ` (${selectedVariant})` : ""}`,
      slug: props.productSlug,
      price: displayPrice,
      image: props.image,
      quantity,
      inStock: props.inStock,
    });
    window.location.href = "/checkout";
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: props.productName, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      appToast.success("Link copied!", "Product link copied to clipboard");
    }
  };

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-bold text-[#1A6B3C] tabular-nums">{formatINR(displayPrice)}</span>
        {props.salePrice && (
          <>
            <span className="text-lg text-slate-400 line-through tabular-nums">{formatINR(props.price)}</span>
            {discount > 0 && <span className="text-sm font-bold text-green-600">{discount}% OFF</span>}
          </>
        )}
        {props.savings && (
          <span className="text-xs text-green-600 font-medium">Save {formatINR(props.savings)}</span>
        )}
      </div>

      {/* Variant selector (for pots with multiple sizes) */}
      {props.prices && Object.keys(props.prices).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Select Size:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(props.prices).map(([size, p]) => (
              <button
                key={size}
                onClick={() => setSelectedVariant(size)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                  selectedVariant === size
                    ? "border-[#1A6B3C] bg-[#F3F8F1] text-[#1A6B3C]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                {size} · {formatINR(p)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + stock */}
      {props.inStock ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-slate-200 rounded-lg">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10 flex items-center justify-center text-slate-600 hover:bg-slate-50" aria-label="Decrease quantity">
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-12 text-center text-sm font-semibold tabular-nums">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="size-10 flex items-center justify-center text-slate-600 hover:bg-slate-50" aria-label="Increase quantity">
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          {props.stockQuantity <= 5 && props.stockQuantity > 0 && (
            <span className="text-sm text-amber-600 font-medium">Only {props.stockQuantity} left!</span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600">
          <Bell className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium">Out of Stock — Notify me when available</span>
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!props.inStock || isAdded}
          className={cn("flex-1 h-12 gap-2 bg-[#1A6B3C] hover:bg-[#16A34A]", isAdded && "bg-green-600 hover:bg-green-600")}
        >
          {isAdded ? (<><Check className="size-4" aria-hidden="true" />Added!</>) : (<><ShoppingCart className="size-4" aria-hidden="true" />Add to Cart</>)}
        </Button>
        <Button onClick={handleBuyNow} disabled={!props.inStock} variant="outline" className="flex-1 h-12 border-[#1A6B3C] text-[#1A6B3C] hover:bg-[#1A6B3C] hover:text-white">
          Buy Now
        </Button>
      </div>

      {/* Wishlist + Share */}
      <div className="flex gap-3">
        <Button
          onClick={() => toggleWishlist(props.productId)}
          variant="outline"
          className="flex-1 h-10 gap-2"
        >
          <Heart className={cn("size-4", wishlisted && "fill-red-500 text-red-500")} aria-hidden="true" />
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1 h-10 gap-2">
          <Share2 className="size-4" aria-hidden="true" />
          Share
        </Button>
      </div>
    </div>
  );
}
