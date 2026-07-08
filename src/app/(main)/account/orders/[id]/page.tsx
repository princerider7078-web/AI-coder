"use client";

import { use } from "react";
import { OrderTrackingClient } from "@/components/orders/OrderTrackingClient";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderTrackingClient orderId={id} />;
}
