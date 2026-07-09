"use client";

/**
 * GrowPlants — ShippingDeliveryCard
 * ============================================================================
 * Premium shipping & delivery card showing:
 *   - Shipping method (Standard / Express / Same Day / Pickup) with icon
 *   - Courier/logistics partner name
 *   - Tracking number with external link
 *   - Shipment ID
 *   - Dispatched date & time
 *   - Estimated delivery date + time window
 *   - Actual delivery date (if delivered)
 *   - Delivery partner name + contact (if out for delivery)
 *   - Current location (if available)
 *   - Proof of delivery (if delivered)
 *
 * Features:
 *   - Color-coded shipping method badges
 *   - Clickable tracking link (opens courier website)
 *   - Delivery timeline mini-view
 *   - Empty state (no shipping info yet)
 * ============================================================================
 */
import { cn, formatDate } from "@/lib/utils";
import {
  Truck, Package, Zap, Clock, Store, ExternalLink, MapPin, User, Phone,
  Calendar, CheckCircle2, Navigation, FileText, Box,
} from "lucide-react";
import type { Order, ShippingMethod } from "@/contexts/OrdersContext";

interface ShippingDeliveryCardProps {
  order: Order;
  className?: string;
}

/* Shipping method config */
const SHIPPING_METHOD_CONFIG: Record<ShippingMethod, {
  icon: typeof Truck;
  label: string;
  description: string;
  color: string;
  bg: string;
}> = {
  standard: {
    icon: Truck,
    label: "Standard Delivery",
    description: "3-5 business days",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  express: {
    icon: Zap,
    label: "Express Delivery",
    description: "1-2 business days",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  same_day: {
    icon: Clock,
    label: "Same Day Delivery",
    description: "Within 6 hours",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  pickup: {
    icon: Store,
    label: "Store Pickup",
    description: "Pickup from our nursery",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
};

function InfoRow({
  icon: Icon,
  label,
  value,
  link,
  mono = false,
}: {
  icon: typeof Truck;
  label: string;
  value: string | undefined;
  link?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <div className="size-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-3.5 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{label}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#1A6B3C] hover:underline font-medium"
          >
            <span className={cn(mono && "font-mono")}>{value}</span>
            <ExternalLink className="size-3" />
          </a>
        ) : (
          <p className={cn("text-sm text-slate-700 font-medium", mono && "font-mono")}>{value}</p>
        )}
      </div>
    </div>
  );
}

export function ShippingDeliveryCard({ order, className }: ShippingDeliveryCardProps) {
  const method = order.shippingMethod ?? "standard";
  const methodConfig = SHIPPING_METHOD_CONFIG[method] ?? SHIPPING_METHOD_CONFIG.standard;
  const tracking = order.tracking;
  const isShipped = ["shipped", "out_for_delivery", "delivered"].includes(order.orderStatus);

  // Compute estimated delivery (3 days from order date if not provided)
  const estimatedDate = tracking?.estimatedDeliveryDate
    ?? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const estimatedWindow = tracking?.estimatedDeliveryWindow ?? "10:00 AM – 6:00 PM";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-5 sm:p-6 pb-3">
        <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center">
          <Truck className="size-4 text-[#1A6B3C]" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">Shipping & Delivery</h3>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="p-5 sm:p-6 pt-4 space-y-4">
        {/* Shipping method */}
        <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
          <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", methodConfig.bg)}>
            <methodConfig.icon className={cn("size-5", methodConfig.color)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">{methodConfig.label}</p>
            <p className="text-xs text-slate-500">{methodConfig.description}</p>
          </div>
        </div>

        {/* Tracking info (only when shipped) */}
        {isShipped && tracking ? (
          <div className="space-y-3">
            <InfoRow
              icon={Box}
              label="Courier Partner"
              value={tracking.courierPartner ?? "GrowPlants Express"}
            />
            <InfoRow
              icon={Package}
              label="Tracking Number"
              value={tracking.trackingNumber}
              link={tracking.trackingUrl ?? `https://www.delhivery.com/tracking/${tracking.trackingNumber}`}
              mono
            />
            {tracking.shipmentId && (
              <InfoRow
                icon={FileText}
                label="Shipment ID"
                value={tracking.shipmentId}
                mono
              />
            )}
            {tracking.dispatchedAt && (
              <InfoRow
                icon={Calendar}
                label="Dispatched On"
                value={formatDate(tracking.dispatchedAt)}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Clock className="size-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              {order.orderStatus === "pending" || order.orderStatus === "payment_confirmed"
                ? "Order received. Will be shipped soon."
                : "Preparing your order for dispatch."}
            </p>
          </div>
        )}

        {/* Estimated / Actual delivery */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {order.orderStatus === "delivered" && tracking?.deliveredAt ? (
          /* Delivered */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="size-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Delivered Successfully</p>
                <p className="text-xs text-green-700">
                  {formatDate(tracking.deliveredAt)} at{" "}
                  {new Date(tracking.deliveredAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit", hour12: true,
                  })}
                </p>
              </div>
            </div>
            {tracking.recipientName && (
              <InfoRow icon={User} label="Received By" value={tracking.recipientName} />
            )}
            {tracking.proofOfDelivery && (
              <InfoRow icon={FileText} label="Proof of Delivery" value={tracking.proofOfDelivery} />
            )}
          </div>
        ) : order.orderStatus === "out_for_delivery" && tracking ? (
          /* Out for delivery */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Navigation className="size-5 text-orange-600 shrink-0 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Out for Delivery</p>
                <p className="text-xs text-orange-700">
                  Arriving today: {tracking.estimatedArrivalTime ?? estimatedWindow}
                </p>
              </div>
            </div>
            {tracking.deliveryPartner && (
              <InfoRow icon={User} label="Delivery Partner" value={tracking.deliveryPartner} />
            )}
            {tracking.driverContact && (
              <InfoRow icon={Phone} label="Driver Contact" value={tracking.driverContact} link={`tel:${tracking.driverContact}`} />
            )}
            {tracking.currentLocation && (
              <InfoRow icon={MapPin} label="Current Location" value={tracking.currentLocation} />
            )}
          </div>
        ) : (
          /* Estimated delivery (pending/processing) */
          <div className="flex items-center gap-2.5 p-3 bg-[#F3F8F1] rounded-lg border border-[#1A6B3C]/10">
            <Calendar className="size-5 text-[#1A6B3C] shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
                Estimated Delivery
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {formatDate(estimatedDate)}
              </p>
              <p className="text-xs text-slate-500">{estimatedWindow}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
