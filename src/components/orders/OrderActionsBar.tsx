"use client";

/**
 * GrowPlants — OrderActionsBar
 * ============================================================================
 * Premium actions bar with:
 *   - Download Invoice (primary outline)
 *   - Cancel Order (red outline, only if cancellable)
 *   - Reorder (brand solid, if delivered)
 *   - Need Help? (whatsapp/call support)
 *
 * Features:
 *   - Responsive (wrap on mobile, row on desktop)
 *   - Color-coded actions
 *   - Disabled state for non-cancellable orders
 * ============================================================================
 */
import { cn } from "@/lib/utils";
import {
  Download, X, RotateCcw, MessageCircle, Phone, Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/contexts/OrdersContext";

interface OrderActionsBarProps {
  order: Order;
  onCancel?: () => void;
  onReorder?: () => void;
  onDownloadInvoice?: () => void;
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
  supportPhone = "+919999999999",
  whatsappNumber = "919999999999",
  className,
}: OrderActionsBarProps) {
  const canCancel =
    order.orderStatus === "pending" ||
    order.orderStatus === "confirmed" ||
    order.orderStatus === "payment_confirmed";

  const canReorder = order.orderStatus === "delivered" || order.orderStatus === "cancelled";

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
        <h3 className="text-sm sm:text-base font-bold text-slate-800">
          Order Actions
        </h3>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2.5">
        {/* Download Invoice */}
        <Button
          variant="outline"
          onClick={onDownloadInvoice}
          className="border-[#1A6B3C] text-[#1A6B3C] hover:bg-[#F3F8F1] gap-2 text-sm"
          size="sm"
        >
          <Download className="size-4" />
          <span className="hidden sm:inline">Download</span> Invoice
        </Button>

        {/* Cancel Order */}
        {canCancel && onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2 text-sm"
            size="sm"
          >
            <X className="size-4" />
            Cancel Order
          </Button>
        )}

        {/* Reorder */}
        {canReorder && onReorder && (
          <Button
            onClick={onReorder}
            className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2 text-sm"
            size="sm"
          >
            <RotateCcw className="size-4" />
            Reorder
          </Button>
        )}

        {/* WhatsApp Support */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-sm font-medium transition-colors"
        >
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline">WhatsApp</span> Support
        </a>

        {/* Call Support */}
        <a
          href={`tel:${supportPhone}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:border-[#1A6B3C] hover:text-[#1A6B3C] text-sm font-medium transition-colors"
        >
          <Phone className="size-4" />
          <span className="hidden sm:inline">Call</span> Support
        </a>
      </div>

      {/* Help text */}
      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        Need help with your order? Our support team is available{" "}
        <span className="font-medium text-slate-700">9 AM – 9 PM</span>, all days.
        Average response time: <span className="font-medium text-slate-700">under 10 minutes</span>.
      </p>
    </div>
  );
}
