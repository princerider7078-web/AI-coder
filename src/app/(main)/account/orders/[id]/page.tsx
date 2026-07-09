"use client";

/**
 * GrowPlants — Order Detail Page
 * ============================================================================
 * Wraps ProfessionalOrderDetail with Firestore real-time listener.
 * ============================================================================
 */
import { use } from "react";
import { ProfessionalOrderDetail } from "@/components/orders/ProfessionalOrderDetail";
import { OrderTrackingClientWrapper } from "@/components/orders/OrderTrackingClientWrapper";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderTrackingClientWrapper orderId={id} />;
}
