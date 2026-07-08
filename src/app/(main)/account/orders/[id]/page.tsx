"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, Truck, Home, MapPin, CreditCard, Download, ArrowLeft, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrders, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/contexts/OrdersContext";
import { formatINR, formatDate } from "@/lib/utils";
import { appToast } from "@/lib/toast";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getOrder, cancelOrder } = useOrders();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const order = getOrder(id);

  if (!order) {
    return (
      <Container className="py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-slate-300 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
        <Button asChild className="bg-[#1A6B3C] hover:bg-[#16A34A]"><Link href="/account/orders">← Back to Orders</Link></Button>
      </Container>
    );
  }

  const canCancel = order.orderStatus === "pending" || order.orderStatus === "confirmed";

  const timeline = [
    { icon: CheckCircle2, label: "Order Placed", date: order.createdAt, done: true },
    { icon: Package, label: "Confirmed", date: order.statusHistory.find((s) => s.status === "confirmed")?.date ?? null, done: ["confirmed", "processing", "out_for_delivery", "delivered"].includes(order.orderStatus) },
    { icon: Package, label: "Processing", date: order.statusHistory.find((s) => s.status === "processing")?.date ?? null, done: ["processing", "out_for_delivery", "delivered"].includes(order.orderStatus) },
    { icon: Truck, label: "Out for Delivery", date: order.statusHistory.find((s) => s.status === "out_for_delivery")?.date ?? null, done: ["out_for_delivery", "delivered"].includes(order.orderStatus) },
    { icon: Home, label: "Delivered", date: order.statusHistory.find((s) => s.status === "delivered")?.date ?? null, done: order.orderStatus === "delivered" },
  ];

  const handleCancel = () => {
    cancelOrder(order.id, cancelReason || "Cancelled by customer");
    setShowCancelModal(false);
    appToast.success("Order cancelled", `Order ${order.orderNumber} has been cancelled`);
  };

  return (
    <Container className="py-6 md:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link href="/account/orders" className="flex items-center gap-1 hover:text-[#1A6B3C]"><ArrowLeft className="size-3.5" />Back to Orders</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-[#1A6B3C]">{order.orderNumber}</h1>
              <p className="text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", ORDER_STATUS_COLORS[order.orderStatus])}>
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </span>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Order Status</h2>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", step.done ? "bg-[#1A6B3C] text-white" : "bg-slate-100 text-slate-400")}>
                    <step.icon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm", step.done ? "text-slate-800 font-medium" : "text-slate-400")}>{step.label}</p>
                    {step.date && <p className="text-xs text-slate-400">{formatDate(step.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
            {order.orderStatus === "cancelled" && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Order Cancelled</p>
                <p className="text-xs text-red-500">{order.statusHistory.find((s) => s.status === "cancelled")?.note ?? "Cancelled by customer"}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Items ({order.items.length})</h2>
            <Separator />
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Link href={`/product/${item.slug}`} className="relative size-12 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium text-slate-800 hover:text-[#1A6B3C] line-clamp-1">{item.name}</Link>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatINR(item.price)}</p>
                </div>
                <p className="text-sm font-bold text-[#1A6B3C] tabular-nums">{formatINR(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-[#1A6B3C] text-[#1A6B3C] gap-2"><Download className="size-4" />Download Invoice</Button>
            {canCancel && <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 gap-2" onClick={() => setShowCancelModal(true)}><X className="size-4" />Cancel Order</Button>}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1 space-y-4">
          {/* Address */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5"><MapPin className="size-3.5" />Delivery Address</h3>
            <p className="text-sm font-medium text-slate-800">{order.address.fullName}</p>
            <p className="text-xs text-slate-600">{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}</p>
            <p className="text-xs text-slate-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="text-xs text-slate-600 mt-1">📞 {order.address.phone}</p>
          </div>

          {/* Payment */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5"><CreditCard className="size-3.5" />Payment</h3>
            <p className="text-sm font-medium text-slate-800">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}</p>
            <p className="text-xs">Status: <span className={order.paymentStatus === "paid" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>{order.paymentStatus === "paid" ? "Paid" : "Pending"}</span></p>
          </div>

          {/* Price summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">Price Details</h3>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="tabular-nums">{formatINR(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span className="tabular-nums">-{formatINR(order.discount)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-slate-600">Delivery</span><span className="tabular-nums">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
            <Separator />
            <div className="flex justify-between items-baseline"><span className="text-sm font-bold">Total</span><span className="text-lg font-bold text-[#1A6B3C] tabular-nums">{formatINR(order.total)}</span></div>
          </div>

          {order.notes && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">Order Notes</h3>
              <p className="text-xs text-slate-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900">Cancel Order?</h2>
            <p className="text-sm text-slate-500">Are you sure you want to cancel order {order.orderNumber}? This action cannot be undone.</p>
            <div className="space-y-1.5">
              <Label htmlFor="cancel-reason" className="text-sm">Reason (optional)</Label>
              <Textarea id="cancel-reason" rows={2} placeholder="Why are you cancelling?" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>Keep Order</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleCancel}>Yes, Cancel Order</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
