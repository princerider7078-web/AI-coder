"use client";

/**
 * GrowPlants — CustomerDetailsCard
 * ============================================================================
 * Premium customer details card showing:
 *   - Full name, phone, email
 *   - Shipping address (with GPS verified badge)
 *   - Billing address (if different from shipping)
 *   - "Same as shipping" indicator if billing === shipping
 *
 * Features:
 *   - Clickable phone (tel:) and email (mailto:) links
 *   - GPS Verified badge
 *   - Two-column layout when billing differs
 *   - Botanical-themed icons
 * ============================================================================
 */
import { cn } from "@/lib/utils";
import {
  User, Phone, Mail, MapPin, Home, Navigation, CheckCircle2, CreditCard,
} from "lucide-react";
import type { Order, OrderAddress } from "@/contexts/OrdersContext";

interface CustomerDetailsCardProps {
  order: Order;
  className?: string;
}

function AddressBlock({
  address,
  title,
  icon: Icon = MapPin,
  showGpsBadge = false,
}: {
  address: OrderAddress;
  title: string;
  icon: typeof MapPin;
  showGpsBadge?: boolean;
}) {
  const hasGps = address.latitude != null && address.longitude != null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3.5 text-[#1A6B3C]" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">{title}</h4>
        </div>
        {showGpsBadge && hasGps && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
            <Navigation className="size-2.5" />
            GPS Verified
          </span>
        )}
      </div>

      <div className="space-y-1.5 pl-1">
        <div className="flex items-start gap-2">
          <User className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-slate-800">{address.fullName}</p>
        </div>

        <a
          href={`tel:${address.phone}`}
          className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#1A6B3C] transition-colors"
        >
          <Phone className="size-3.5 text-slate-400 shrink-0" />
          {address.phone}
        </a>

        {address.email && (
          <a
            href={`mailto:${address.email}`}
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#1A6B3C] transition-colors"
          >
            <Mail className="size-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{address.email}</span>
          </a>
        )}

        <div className="flex items-start gap-2">
          <MapPin className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
            {address.landmark ? `, Near ${address.landmark}` : ""}
            <br />
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CustomerDetailsCard({ order, className }: CustomerDetailsCardProps) {
  const hasBillingAddress = Boolean(order.billingAddress);
  const billingSameAsShipping = hasBillingAddress
    ? JSON.stringify(order.billingAddress) === JSON.stringify(order.address)
    : true;

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
          <User className="size-4 text-[#1A6B3C]" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">Customer Details</h3>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="p-5 sm:p-6 pt-4 space-y-5">
        {/* Shipping + Billing addresses */}
        {hasBillingAddress && !billingSameAsShipping ? (
          // Two-column layout when billing differs
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AddressBlock
              address={order.address}
              title="Shipping Address"
              icon={Home}
              showGpsBadge
            />
            <div className="sm:border-l sm:border-slate-100 sm:pl-5">
              <AddressBlock
                address={order.billingAddress!}
                title="Billing Address"
                icon={CreditCard}
              />
            </div>
          </div>
        ) : (
          // Single address (shipping === billing)
          <div className="space-y-3">
            <AddressBlock
              address={order.address}
              title="Shipping Address"
              icon={Home}
              showGpsBadge
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 italic pt-2 border-t border-slate-100">
              <CheckCircle2 className="size-3.5 text-green-500" />
              <span>Billing address same as shipping</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
