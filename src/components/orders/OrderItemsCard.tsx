"use client";

/**
 * GrowPlants — OrderItemsCard (Enhanced)
 * ============================================================================
 * Premium items section showing all products in the order:
 *   - Product image (clickable → PDP)
 *   - Product name (clickable → PDP)
 *   - SKU/code (mono font)
 *   - Variant (size, color, model)
 *   - Quantity × unit price
 *   - Item subtotal (line total)
 *   - Item status badge (for split shipments)
 *   - Subtotal footer
 *
 * Features:
 *   - Hover lift effect on each item
 *   - Responsive (image size adapts)
 *   - Variant chips with color swatch
 *   - SKU in monospace font
 * ============================================================================
 */
import Link from "next/link";
import Image from "next/image";
import { cn, formatINR } from "@/lib/utils";
import { Package, ShoppingBag, Tag, Hash, Palette, Ruler, Box } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type Order,
  type OrderItem,
} from "@/contexts/OrdersContext";

interface OrderItemsCardProps {
  order: Order;
  className?: string;
}

function VariantChip({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Tag }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
      <Icon className="size-2.5 text-slate-400" />
      <span className="font-medium">{label}:</span>
      <span className="text-slate-700">{value}</span>
    </span>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  const lineTotal = item.itemSubtotal ?? item.price * item.quantity;

  return (
    <div className="flex gap-3 sm:gap-4 items-start group transition-all duration-200 p-2 -mx-2 rounded-lg hover:bg-[#F3F8F1]/50">
      {/* Product image */}
      <Link
        href={`/product/${item.slug}`}
        className="relative size-16 sm:size-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 transition-transform group-hover:scale-105"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="size-8 text-slate-300" />
          </div>
        )}
      </Link>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              className="text-sm sm:text-base font-medium text-slate-800 hover:text-[#1A6B3C] line-clamp-1 transition-colors"
            >
              {item.name}
            </Link>

            {/* SKU */}
            {item.sku && (
              <div className="flex items-center gap-1 mt-0.5">
                <Hash className="size-3 text-slate-400" />
                <span className="text-[10px] text-slate-500 font-mono">{item.sku}</span>
              </div>
            )}

            {/* Variant chips */}
            {item.variant && (
              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                {item.variant.size && (
                  <VariantChip label="Size" value={item.variant.size} icon={Ruler} />
                )}
                {item.variant.color && (
                  <VariantChip label="Color" value={item.variant.color} icon={Palette} />
                )}
                {item.variant.model && (
                  <VariantChip label="Model" value={item.variant.model} icon={Box} />
                )}
                {item.variant.label && !item.variant.size && !item.variant.color && !item.variant.model && (
                  <VariantChip label="Variant" value={item.variant.label} icon={Tag} />
                )}
              </div>
            )}
          </div>

          {/* Line total */}
          <div className="text-right shrink-0">
            <p className="text-sm sm:text-base font-bold text-[#1A6B3C] tabular-nums">
              {formatINR(lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] sm:text-xs text-slate-400 tabular-nums">
                {formatINR(item.price)} × {item.quantity}
              </p>
            )}
          </div>
        </div>

        {/* Footer row: qty + price + item status */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Qty:</span> {item.quantity}
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Price:</span> {formatINR(item.price)}
          </span>
          {item.itemStatus && item.itemStatus !== "delivered" && (
            <>
              <span className="text-slate-300">·</span>
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  ORDER_STATUS_COLORS[item.itemStatus],
                )}
              >
                {ORDER_STATUS_LABELS[item.itemStatus]}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
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
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Order Items</h2>
            <p className="text-xs text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} · {totalQuantity} {totalQuantity === 1 ? "unit" : "units"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Items list */}
      <div className="p-5 sm:p-6 pt-4 space-y-4">
        {order.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="size-10 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No items in this order</p>
          </div>
        ) : (
          order.items.map((item, i) => <ItemRow key={i} item={item} />)
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
