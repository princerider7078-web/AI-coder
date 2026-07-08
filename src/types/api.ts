/**
 * GrowPlants — API Response & Payload Types
 * Source: PRD §26 API Specification, §32.3 HTTP Status Codes
 *
 * Standard response wrapper (PRD §26):
 *   { success, data, message, pagination }
 * Error response (PRD §26):
 *   { success: false, error: { code, message, details } }
 */
import type {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  BookingStatus,
  ProviderVerificationStatus,
} from "@/lib/enums";
import type {
  ProductRow,
  CategoryRow,
  ReviewRow,
  ServiceRow,
  ServiceProviderRow,
  OrderRow,
  OrderItemRow,
  OrderStatusHistoryRow,
  AddressRow,
  ProductVariantRow,
  InventoryRow,
  BookingRow,
} from "@/types/database";
import type { FirestoreCartItem } from "@/types/firebase";

/* ---------- Standard Wrapper ---------- */

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: ApiPagination;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface ApiPagination {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/* ---------- Auth Payloads ---------- */

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  identifier: string; // email or phone
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "customer" | "admin" | "provider";
  status: "active" | "suspended" | "deleted";
  profileImageUrl: string | null;
  preferredLanguage: "en" | "hi";
}

/* ---------- Product Endpoints ---------- */

export interface ProductListQuery {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  suitableFor?: string;
  sunlight?: string;
  difficulty?: string;
  inStock?: boolean;
  tags?: string[];
  sort?:
    | "featured"
    | "price_asc"
    | "price_desc"
    | "newest"
    | "rating"
    | "bestseller";
  page?: number;
  perPage?: number;
  q?: string;
}

export interface ProductListResponse {
  products: ProductRow[];
  pagination: ApiPagination;
  facets?: {
    categories: { id: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}

export type ProductDetailResponse = ProductRow & {
  images: string[];
  variants: ProductVariantRow[];
  inventory: InventoryRow | null;
  category: CategoryRow | null;
  reviews: ReviewRow[];
  ratingBreakdown: { stars: 1 | 2 | 3 | 4 | 5; count: number; percentage: number }[];
  similar: ProductRow[];
};

/* ---------- Category Endpoints ---------- */

export interface CategoryTreeResponse {
  categories: (CategoryRow & {
    children: CategoryRow[];
  })[];
}

/* ---------- Cart Endpoints ---------- */

export interface CartItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CartResponseItem extends FirestoreCartItem {
  product?: ProductRow;
  variant?: ProductVariantRow;
}

export interface CartResponse {
  items: CartResponseItem[];
  subtotal: number;
  itemCount: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
  freeShippingProgress: {
    threshold: number;
    remaining: number;
    achieved: boolean;
  };
}

/* ---------- Order Endpoints ---------- */

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  deliverySlot?: string;
  notes?: string;
  couponCode?: string;
}

export interface OrderResponse extends OrderRow {
  items: OrderItemRow[];
  address: AddressRow;
  statusHistory: OrderStatusHistoryRow[];
}

/* ---------- Service Endpoints ---------- */

export interface ServiceListQuery {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "rating";
  page?: number;
  perPage?: number;
}

export interface ServiceListResponse {
  services: ServiceRow[];
  pagination: ApiPagination;
}

export interface ServiceDetailResponse extends ServiceRow {
  providers: (ServiceProviderRow & { ratingAverage: number })[];
  reviews: ReviewRow[];
}

export interface BookingDetailResponse extends BookingRow {
  service: ServiceRow;
  provider: ServiceProviderRow | null;
  address: AddressRow;
}

/* ---------- Booking Endpoints ---------- */

export interface CreateBookingPayload {
  serviceId: string;
  providerId?: string;
  address: {
    addressId?: string;
    newAddress?: import("@/lib/validations/address").AddressInput;
  };
  date: string; // YYYY-MM-DD
  timeSlot: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

export interface BookingResponse extends BookingRow {
  service: ServiceRow;
  provider: ServiceProviderRow | null;
  address: AddressRow;
}

/* ---------- Review Endpoints ---------- */

export interface ReviewListResponse {
  reviews: ReviewRow[];
  pagination: ApiPagination;
  ratingBreakdown: { stars: 1 | 2 | 3 | 4 | 5; count: number; percentage: number }[];
  averageRating: number;
  totalCount: number;
}

/* ---------- Address Endpoints ---------- */

export interface AddressListResponse {
  addresses: AddressRow[];
}

/* ---------- Pincode Check ---------- */

export interface PincodeCheckResponse {
  serviceable: boolean;
  city: string | null;
  state: string | null;
  deliveryCharge: number;
  codAvailable: boolean;
  estimatedDays: { min: number; max: number } | null;
  message: string;
}

/* ---------- Status Enums (for type narrowing) ---------- */

export type { OrderStatus, PaymentStatus, PaymentMethod, BookingStatus, ProviderVerificationStatus };
