"use client";

/**
 * TrackingSummaryCard — Premium summary card with order/tracking/address/payment info.
 *
 * Layout: 2-column grid on desktop, stacked on mobile.
 *
 * Fields shown:
 *   - Order Number
 *   - Tracking Number (if available)
 *   - Courier Partner (if available)
 *   - Estimated Delivery
 *   - Current Status (with StatusBadge)
 *   - Last Updated
 *   - Shipping Address
 *   - Payment Method + Status
 */
import { MapPin, CreditCard, Package, Truck, Clock, Hash, type LucideIcon } from "lucide-react";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { Order } from "@/contexts/OrdersContext";
import { getLastUpdated, getEstimatedDelivery } from "./stages";
import { StatusBadge } from "./StatusBadge";

export interface TrackingSummaryCardProps {
  order: Order;
  className?: string;
}

interface SummaryField {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
}

export function TrackingSummaryCard({ order, className }: TrackingSummaryCardProps) {
  const lastUpdated = getLastUpdated(order);
  const eta = getEstimatedDelivery(order);
  const t = order.tracking;

  const fields: SummaryField[] = [
    { icon: Hash, label: "Order Number", value: `#${order.orderNumber}`, mono: true },
  ];

  if (t?.trackingNumber) {
    fields.push({ icon: Package, label: "Tracking Number", value: t.trackingNumber, mono: true });
  }
  if (t?.courierPartner) {
    fields.push({ icon: Truck, label: "Courier Partner", value: t.courierPartner });
  }
  if (eta && order.orderStatus !== "delivered" && order.orderStatus !== "cancelled") {
    fields.push({ icon: Clock, label: "Estimated Delivery", value: eta });
  }
  if (lastUpdated) {
    fields.push({
      icon: Clock,
      label: "Last Updated",
      value: `${formatDate(lastUpdated)} · ${formatTime(lastUpdated)}`,
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-sm",
        className,
      )}
    >
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#1A6B3C] animate-pulse" aria-hidden="true" />
        Tracking Information
      </h3>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {fields.map((field, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors"
          >
            <field.icon className="size-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 leading-tight">
                {field.label}
              </p>
              <p
                className={cn(
                  "text-xs font-semibold text-slate-800 truncate",
                  field.mono && "font-mono",
                )}
              >
                {field.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Current Status row */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[#F3F8F1] mb-3">
        <span className="text-xs font-medium text-slate-600">Current Status</span>
        <StatusBadge status={order.orderStatus} kind="order" size="sm" pulse />
      </div>

      {/* Shipping Address */}
      <div className="p-3 rounded-lg border border-slate-100 mb-3">
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 flex items-center gap-1">
          <MapPin className="size-3" aria-hidden="true" />
          Shipping Address
        </p>
        <p className="text-xs font-semibold text-slate-800">{order.address.fullName}</p>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          {order.address.addressLine1}
          {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </p>
        {order.address.phone && (
          <p className="text-xs text-slate-500 mt-1">📞 {order.address.phone}</p>
        )}
      </div>

      {/* Payment */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-slate-400" aria-hidden="true" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Payment</p>
            <p className="text-xs font-semibold text-slate-800">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}
            </p>
          </div>
        </div>
        <StatusBadge status={order.paymentStatus} kind="payment" size="sm" />
      </div>
    </div>
  );
}
