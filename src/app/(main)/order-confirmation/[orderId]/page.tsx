"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, Truck, Home, Download, ArrowRight, MapPin, CreditCard } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrders, ORDER_STATUS_LABELS } from "@/contexts/OrdersContext";
import { formatINR, formatDate } from "@/lib/utils";

export default function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { getOrder } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <Container className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
        <p className="text-sm text-slate-500">This order may have been removed or the link is incorrect.</p>
        <Button asChild className="bg-[#1A6B3C] hover:bg-[#16A34A]"><Link href="/account/orders">View My Orders</Link></Button>
      </Container>
    );
  }

  const timeline = [
    { icon: CheckCircle2, label: "Order Placed", date: order.createdAt, done: true },
    { icon: Package, label: "Confirmed", date: null, done: order.orderStatus !== "pending" },
    { icon: Package, label: "Processing", date: null, done: ["processing", "out_for_delivery", "delivered"].includes(order.orderStatus) },
    { icon: Truck, label: "Out for Delivery", date: null, done: ["out_for_delivery", "delivered"].includes(order.orderStatus) },
    { icon: Home, label: "Delivered", date: null, done: order.orderStatus === "delivered" },
  ];

  return (
    <Container className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success header */}
        <div className="text-center space-y-3">
          <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-8 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A6B3C]">Order Placed Successfully!</h1>
          <p className="text-sm text-slate-500">Thank you for your order. We&apos;ll send you a confirmation on SMS and email shortly.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F8F1] rounded-full">
            <span className="text-sm text-slate-600">Order Number:</span>
            <span className="text-sm font-bold text-[#1A6B3C]">{order.orderNumber}</span>
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Order Timeline</h2>
          <div className="flex items-center justify-between">
            {timeline.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`size-9 rounded-full flex items-center justify-center ${step.done ? "bg-[#1A6B3C] text-white" : "bg-slate-100 text-slate-400"}`}>
                  <step.icon className="size-4" />
                </div>
                <p className={`text-[10px] text-center ${step.done ? "text-slate-800 font-medium" : "text-slate-400"}`}>{step.label}</p>
                {step.date && <p className="text-[9px] text-slate-400">{formatDate(step.date)}</p>}
                {i < timeline.length - 1 && <div className={`hidden sm:block absolute h-0.5 ${step.done ? "bg-[#1A6B3C]" : "bg-slate-200"}`} style={{ left: `${(i + 1) * 20}%`, width: "20%", marginTop: "-32px" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Items Ordered ({order.items.length})</h2>
          <Separator />
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="relative size-12 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatINR(item.price)}</p>
              </div>
              <p className="text-sm font-bold text-[#1A6B3C] tabular-nums">{formatINR(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Delivery + Payment info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5"><MapPin className="size-3.5" />Delivery Address</h3>
            <p className="text-sm font-medium text-slate-800">{order.address.fullName}</p>
            <p className="text-xs text-slate-600">{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}</p>
            <p className="text-xs text-slate-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="text-xs text-slate-600 mt-1">📞 {order.address.phone}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5"><CreditCard className="size-3.5" />Payment Details</h3>
            <p className="text-sm font-medium text-slate-800">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}</p>
            <p className="text-xs text-slate-600">Status: <span className={order.paymentStatus === "paid" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>{order.paymentStatus === "paid" ? "Paid" : "Pending"}</span></p>
            {order.notes && <p className="text-xs text-slate-500 mt-1">Note: {order.notes}</p>}
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-medium tabular-nums">{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span className="font-medium tabular-nums">-{formatINR(order.discount)}</span></div>}
          <div className="flex justify-between text-sm"><span className="text-slate-600">Delivery</span><span className="font-medium tabular-nums">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
          <Separator />
          <div className="flex justify-between items-baseline"><span className="text-base font-bold text-slate-800">Total Paid</span><span className="text-xl font-bold text-[#1A6B3C] tabular-nums">{formatINR(order.total)}</span></div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" className="border-[#1A6B3C] text-[#1A6B3C] gap-2"><Download className="size-4" />Download Invoice</Button>
          <Button asChild className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2"><Link href="/account/orders">View My Orders<ArrowRight className="size-4" /></Link></Button>
          <Button asChild variant="outline" className="gap-2"><Link href="/shop">Continue Shopping</Link></Button>
        </div>
      </div>
    </Container>
  );
}
