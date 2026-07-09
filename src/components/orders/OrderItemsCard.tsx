"use client";

/**
 * GrowPlants — OrderItemsCard
 * ============================================================================
 * Premium items section showing all products in the order:
 *   - Product image (clickable → PDP)
 *   - Product name (clickable → PDP)
 *   - Quantity × unit price
 *   - Line total (brand color, prominent)
 *   - Subtotal footer
 *
 * Features:
 *   - Hover lift effect on each item
 *   - Responsive (image size adapts)
 *   - Empty state (no items)
 * ============================================================================
 */
import Link from "next/link";
import Image from "next/image";
import { cn, formatINR } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/contexts/OrdersContext";

interface OrderItemsCardProps {
  order: Order;
  className?: string;
}

export function OrderItemsCard({ order, className }: OrderItemsCardProps) {
  const itemCount = order.items.length;
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center">
            <Package className="size-4 text-[#1A6B3C]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              Order Items
            </h2>
            <p className="text-xs text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} · {totalQuantity} {totalQuantity === 1 ? "unit" : "units"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Items list */}
      <div className="p-5 sm:p-6 pt-4 space-y-3">
        {order.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="size-10 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No items in this order</p>
          </div>
        ) : (
          order.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 sm:gap-4 items-center group transition-all duration-200",
                "p-2 -mx-2 rounded-lg hover:bg-[#F3F8F1]/50",
              )}
            >
              {/* Product image */}
              <Link
                href={`/product/${item.slug}`}
                className="relative size-14 sm:size-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 transition-transform group-hover:scale-105"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="size-6 text-slate-300" />
                  </div>
                )}
              </Link>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm sm:text-base font-medium text-slate-800 hover:text-[#1A6B3C] line-clamp-1 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  <span className="font-medium">Qty:</span> {item.quantity}
                  <span className="mx-1.5 text-slate-300">·</span>
                  <span className="font-medium">Price:</span> {formatINR(item.price)}
                </p>
              </div>

              {/* Line total */}
              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-bold text-[#1A6B3C] tabular-nums">
                  {formatINR(item.price * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-[10px] sm:text-xs text-slate-400 tabular-nums">
                    {formatINR(item.price)} × {item.quantity}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtotal footer */}
      {order.items.length > 0 && (
        <>
          <Separator />
          <div className="flex items-center justify-between p-5 sm:p-6 pt-4">
            <span className="text-sm text-slate-600 font-medium">Items Subtotal</span>
            <span className="text-base font-bold text-slate-800 tabular-nums">
              {formatINR(order.subtotal)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
