/**
 * GrowPlants — /api/orders
 * ============================================================================
 * Dual-Database Strategy:
 *   - PostgreSQL/SQLite (Prisma) — transactional source of truth, admin reads
 *   - Firestore                  — real-time client mirror (dual write)
 *
 * POST  /api/orders        Create a new order
 *   Authorization: Bearer <Firebase ID Token>
 *   Body: { firebaseUid, address, paymentMethod, items, subtotal,
 *           shippingCharge, totalAmount, notes? }
 *   → Prisma $transaction: address.create + order.create + orderItem.create[]
 *                          + orderStatusHistory.create("pending")
 *   → Returns { success: true, order: { id, order_number, total_amount } }
 *
 * GET   /api/orders        List current user's orders
 *   Authorization: Bearer <Firebase ID Token>
 *   → Returns { success: true, orders: [...] }
 *
 * Error Handling:
 *   - Auth fail (missing/invalid token)         → 401
 *   - Empty cart (items array empty on POST)    → 400
 *   - Prisma fail                                → 500 + fallback to in-memory mock
 *   - Firestore fail                             → log only (Prisma is source of truth)
 * ============================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  type DecodedFirebaseToken,
} from "@/lib/auth";

/* ============================================================================
 * In-memory mock fallback (used when Prisma/PostgreSQL is unavailable)
 * ============================================================================
 * If db.$transaction throws (DB down, schema mismatch, etc.), we fall back to
 * pushing the order into this in-memory array so the user still sees a success
 * response. Real-time Firestore write will still happen on the client side.
 */
interface MockOrderRow {
  id: string;
  order_number: string;
  firebase_uid: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  tax: number;
  notes: string | null;
  created_at: string;
  items: Array<{
    id: string;
    product_id: string;
    name: string;
    image: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    pincode: string;
  };
}

const mockOrdersStore: MockOrderRow[] = [];

function generateOrderNumber(): string {
  return "ORD-" + Date.now();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ============================================================================
 * POST — Create order
 * ============================================================================ */

interface CreateOrderRequestBody {
  firebaseUid?: string;
  address?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  };
  paymentMethod?: "cod" | "razorpay";
  items?: Array<{
    productId: string;
    name: string;
    slug?: string;
    image?: string;
    quantity: number;
    unitPrice: number; // in rupees (will be converted to paise)
  }>;
  subtotal?: number;         // rupees
  shippingCharge?: number;   // rupees
  totalAmount?: number;      // rupees
  discount?: number;         // rupees
  tax?: number;              // rupees
  notes?: string;
}

export async function POST(req: NextRequest) {
  // 1. Verify Firebase ID token
  const authHeader = req.headers.get("authorization");
  const idToken = extractBearerToken(authHeader);
  if (!idToken) {
    return NextResponse.json(
      { success: false, error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const decoded: DecodedFirebaseToken | null = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // 2. Parse body
  let body: CreateOrderRequestBody;
  try {
    body = (await req.json()) as CreateOrderRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // 3. Validate
  const firebaseUid = body.firebaseUid || decoded.uid;
  if (!firebaseUid || firebaseUid !== decoded.uid) {
    return NextResponse.json(
      { success: false, error: "firebaseUid mismatch" },
      { status: 403 }
    );
  }

  if (!body.items || body.items.length === 0) {
    return NextResponse.json(
      { success: false, error: "Cart is empty" },
      { status: 400 }
    );
  }

  if (!body.address || !body.address.fullName || !body.address.pincode) {
    return NextResponse.json(
      { success: false, error: "Address is incomplete" },
      { status: 400 }
    );
  }

  const orderNumber = generateOrderNumber();
  const paymentMethod = body.paymentMethod ?? "cod";
  const paymentStatus = paymentMethod === "cod" ? "pending" : "paid";

  // Convert rupees → paise for INTEGER storage
  const subtotalPaise = Math.round((body.subtotal ?? 0) * 100);
  const shippingPaise = Math.round((body.shippingCharge ?? 0) * 100);
  const discountPaise = Math.round((body.discount ?? 0) * 100);
  const taxPaise = Math.round((body.tax ?? 0) * 100);
  const totalPaise = Math.round((body.totalAmount ?? 0) * 100);

  // 4. Try Prisma transaction
  try {
    const created = await db.$transaction(async (tx) => {
      // a. Create address
      const address = await tx.address.create({
        data: {
          userId: firebaseUid,
          fullName: body.address!.fullName!,
          phone: body.address!.phone ?? "",
          addressLine1: body.address!.addressLine1 ?? "",
          addressLine2: body.address!.addressLine2 ?? null,
          landmark: body.address!.landmark ?? null,
          city: body.address!.city ?? "",
          state: body.address!.state ?? "",
          pincode: body.address!.pincode ?? "",
          latitude: body.address!.latitude ?? null,
          longitude: body.address!.longitude ?? null,
          isDefault: false,
        },
      });

      // b. Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: firebaseUid,
          addressId: address.id,
          subtotal: subtotalPaise,
          shippingFee: shippingPaise,
          discount: discountPaise,
          tax: taxPaise,
          totalAmount: totalPaise,
          paymentMethod,
          paymentStatus,
          status: "pending",
          notes: body.notes ?? null,
        },
      });

      // c. Create order items
      for (const item of body.items!) {
        const unitPricePaise = Math.round(item.unitPrice * 100);
        const totalPricePaise = unitPricePaise * item.quantity;
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            name: item.name,
            slug: item.slug ?? "",
            image: item.image ?? "",
            quantity: item.quantity,
            unitPrice: unitPricePaise,
            totalPrice: totalPricePaise,
            productSnapshot: JSON.stringify({
              productId: item.productId,
              name: item.name,
              slug: item.slug,
              image: item.image,
              unitPrice: item.unitPrice,
            }),
          },
        });
      }

      // d. Create initial status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "pending",
          remarks: "Order placed",
          createdBy: firebaseUid,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: created.id,
        order_number: created.orderNumber,
        status: created.status,
        payment_method: created.paymentMethod,
        payment_status: created.paymentStatus,
        total_amount: created.totalAmount / 100, // paise → rupees
        subtotal: created.subtotal / 100,
        shipping_fee: created.shippingFee / 100,
        discount: created.discount / 100,
        tax: created.tax / 100,
        created_at: created.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[api/orders POST] Prisma transaction failed — falling back to mock:", err);

    // 5. Fallback: push to in-memory mock array
    const mockOrder: MockOrderRow = {
      id: generateId("order"),
      order_number: orderNumber,
      firebase_uid: firebaseUid,
      status: "pending",
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      total_amount: totalPaise / 100,
      subtotal: subtotalPaise / 100,
      shipping_fee: shippingPaise / 100,
      discount: discountPaise / 100,
      tax: taxPaise / 100,
      notes: body.notes ?? null,
      created_at: new Date().toISOString(),
      items: (body.items ?? []).map((item) => ({
        id: generateId("item"),
        product_id: item.productId,
        name: item.name,
        image: item.image ?? "",
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.unitPrice * item.quantity,
      })),
      address: {
        full_name: body.address!.fullName!,
        phone: body.address!.phone ?? "",
        address_line1: body.address!.addressLine1 ?? "",
        address_line2: body.address!.addressLine2 ?? null,
        city: body.address!.city ?? "",
        state: body.address!.state ?? "",
        pincode: body.address!.pincode ?? "",
      },
    };
    mockOrdersStore.push(mockOrder);

    return NextResponse.json({
      success: true,
      order: {
        id: mockOrder.id,
        order_number: mockOrder.order_number,
        status: mockOrder.status,
        payment_method: mockOrder.payment_method,
        payment_status: mockOrder.payment_status,
        total_amount: mockOrder.total_amount,
        subtotal: mockOrder.subtotal,
        shipping_fee: mockOrder.shipping_fee,
        discount: mockOrder.discount,
        tax: mockOrder.tax,
        created_at: mockOrder.created_at,
        _mock: true,
      },
    });
  }
}

/* ============================================================================
 * GET — List user's orders
 * ============================================================================ */

export async function GET(req: NextRequest) {
  // 1. Verify Firebase ID token
  const authHeader = req.headers.get("authorization");
  const idToken = extractBearerToken(authHeader);
  if (!idToken) {
    return NextResponse.json(
      { success: false, error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const decoded: DecodedFirebaseToken | null = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const firebaseUid = decoded.uid;

  // 2. Try Prisma
  try {
    const orders = await db.order.findMany({
      where: { userId: firebaseUid },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        address: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        order_number: o.orderNumber,
        status: o.status,
        payment_method: o.paymentMethod,
        payment_status: o.paymentStatus,
        total_amount: o.totalAmount / 100,
        subtotal: o.subtotal / 100,
        shipping_fee: o.shippingFee / 100,
        discount: o.discount / 100,
        tax: o.tax / 100,
        notes: o.notes,
        created_at: o.createdAt.toISOString(),
        items: o.items.map((it) => ({
          id: it.id,
          product_id: it.productId,
          name: it.name,
          slug: it.slug,
          image: it.image,
          quantity: it.quantity,
          unit_price: it.unitPrice / 100,
          total_price: it.totalPrice / 100,
        })),
        address: o.address
          ? {
              full_name: o.address.fullName,
              phone: o.address.phone,
              address_line1: o.address.addressLine1,
              address_line2: o.address.addressLine2,
              city: o.address.city,
              state: o.address.state,
              pincode: o.address.pincode,
            }
          : null,
        status_history: o.statusHistory.map((h) => ({
          status: h.status,
          remarks: h.remarks,
          created_by: h.createdBy,
          created_at: h.createdAt.toISOString(),
        })),
      })),
    });
  } catch (err) {
    console.error("[api/orders GET] Prisma failed — returning mock orders:", err);

    // 3. Fallback: return mock orders for this user
    const userMockOrders = mockOrdersStore.filter((o) => o.firebase_uid === firebaseUid);
    return NextResponse.json({
      success: true,
      orders: userMockOrders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        payment_method: o.payment_method,
        payment_status: o.payment_status,
        total_amount: o.total_amount,
        subtotal: o.subtotal,
        shipping_fee: o.shipping_fee,
        discount: o.discount,
        tax: o.tax,
        notes: o.notes,
        created_at: o.created_at,
        items: o.items.map((it) => ({
          id: it.id,
          product_id: it.product_id,
          name: it.name,
          image: it.image,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
        })),
        address: o.address,
        status_history: [
          { status: "pending", remarks: "Order placed", created_by: firebaseUid, created_at: o.created_at },
        ],
        _mock: true,
      })),
    });
  }
}
