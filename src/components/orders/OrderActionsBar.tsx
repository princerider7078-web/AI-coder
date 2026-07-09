"use client";

/**
 * GrowPlants — OrderActionsBar (Enhanced)
 * ============================================================================
 * Premium actions bar with:
 *   - Download Invoice (PDF) — primary outline
 *   - Cancel Order (red, only if cancellable: pending/confirmed)
 *   - Return / Exchange (only if delivered, within return window)
 *   - Reorder (brand solid, if delivered/cancelled)
 *   - WhatsApp Support + Call Support
 *
 * Features:
 *   - Responsive (wrap on mobile, row on desktop)
 *   - Color-coded actions
 *   - Conditional rendering based on order status
 * ============================================================================
 */
import { cn } from "@/lib/utils";
import {
  Download, X, RotateCcw, MessageCircle, Phone, Headphones, RefreshCw, ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/contexts/OrdersContext";

interface OrderActionsBarProps {
  order: Order;
  onCancel?: () => void;
  onReorder?: () => void;
  onDownloadInvoice?: () => void;
  onReturn?: () => void;
  onExchange?: () => void;
  /** Support phone number */
  supportPhone?: string;
  /** WhatsApp number */
  whatsappNumber?: string;
  className?: string;
}

export function OrderActionsBar({
  order,
  onCancel,
  onReorder,
  onDownloadInvoice,
  onReturn,
  onExchange,
  supportPhone = "+919999999999",
  whatsappNumber = "919999999999",
  className,
}: OrderActionsBarProps) {
  const canCancel =
    order.orderStatus === "pending" ||
    order.orderStatus === "confirmed" ||
    order.orderStatus === "payment_confirmed";

  const canReorder = order.orderStatus === "delivered" || order.orderStatus === "cancelled";

  // Return/exchange: only for delivered orders (within 7-day window)
  const deliveredDate = order.statusHistory.find((s) => s.status === "delivered")?.date;
  const isWithinReturnWindow = deliveredDate
    ? Date.now() - new Date(deliveredDate).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;
  const canReturnOrExchange = order.orderStatus === "delivered" && isWithinReturnWindow;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="size-8 rounded-lg bg-[#F3F8F1] flex items-center justify-center">
          <Headphones className="size-4 text-[#1A6B3C]" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-800">Order Actions</h3>
      </div>

      {/* Action buttons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Download Invoice */}
        <Button
          variant="outline"
          onClick={onDownloadInvoice}
          className="border-[#1A6B3C] text-[#1A6B3C] hover:bg-[#F3F8F1] gap-2 text-sm justify-start"
          size="sm"
        >
          <Download className="size-4 shrink-0" />
          <span className="truncate">Invoice</span>
        </Button>

        {/* Cancel Order */}
        {canCancel && onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2 text-sm justify-start"
            size="sm"
          >
            <X className="size-4 shrink-0" />
            <span className="truncate">Cancel</span>
          </Button>
        )}

        {/* Return */}
        {canReturnOrExchange && onReturn && (
          <Button
            variant="outline"
            onClick={onReturn}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 gap-2 text-sm justify-start"
            size="sm"
          >
            <RefreshCw className="size-4 shrink-0" />
            <span className="truncate">Return</span>
          </Button>
        )}

        {/* Exchange */}
        {canReturnOrExchange && onExchange && (
          <Button
            variant="outline"
            onClick={onExchange}
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 gap-2 text-sm justify-start"
            size="sm"
          >
            <ArrowLeftRight className="size-4 shrink-0" />
            <span className="truncate">Exchange</span>
          </Button>
        )}

        {/* Reorder */}
        {canReorder && onReorder && (
          <Button
            onClick={onReorder}
            className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2 text-sm justify-start"
            size="sm"
          >
            <RotateCcw className="size-4 shrink-0" />
            <span className="truncate">Reorder</span>
          </Button>
        )}

        {/* WhatsApp Support */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-sm font-medium transition-colors justify-start"
        >
          <MessageCircle className="size-4 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>

        {/* Call Support */}
        <a
          href={`tel:${supportPhone}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-[#1A6B3C] hover:text-[#1A6B3C] text-sm font-medium transition-colors justify-start"
        >
          <Phone className="size-4 shrink-0" />
          <span className="truncate">Call Us</span>
        </a>
      </div>

      {/* Help text */}
      <div className="mt-4 p-3 bg-[#F3F8F1] rounded-lg border border-[#1A6B3C]/10">
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">Need help?</span> Our support team is available{" "}
          <span className="font-medium text-[#1A6B3C]">9 AM – 9 PM</span>, all days.
          Average response time: <span className="font-medium text-[#1A6B3C]">under 10 minutes</span> on WhatsApp.
        </p>
      </div>

      {/* Return window notice */}
      {canReturnOrExchange && (
        <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5">
          <RefreshCw className="size-3" />
          <span>Return/exchange window: 7 days from delivery</span>
        </p>
      )}
    </div>
  );
}
