/**
 * GrowPlants — Database Row Types
 * Source: 03_database_design.md (PostgreSQL schema), PRD §05 (Full DB Schema)
 *
 * These mirror the PostgreSQL schema (35+ models, 12 enums).
 * When Prisma schema is expanded in a later task, the generated
 * @prisma/client types will replace these. For Phase 1, these interfaces
 * are the canonical reference for all DB row shapes used by the frontend.
 */
import type {
  UserRole,
  UserStatus,
  Gender,
  PreferredLanguage,
  SunlightRequirement,
  WaterFrequency,
  DifficultyLevel,
  SuitableFor,
  Season,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  BookingStatus,
  ServicePricingType,
  ServiceType,
  ProviderVerificationStatus,
  ReviewableType,
  ReviewReferenceType,
  ReturnReason,
  ReturnStatus,
  ReturnResolution,
  InventoryTransactionType,
  InventoryReferenceType,
  CouponDiscountType,
  CouponApplicableTo,
  IdProofType,
} from "@/lib/enums";

/* ---------- User Domain ---------- */

export interface UserRow {
  id: string;
  fullName: string;
  email: string;
  phone: string; // +91XXXXXXXXXX
  phoneVerified: boolean;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  profileImageUrl: string | null;
  dateOfBirth: string | null; // ISO date
  gender: Gender | null;
  preferredLanguage: PreferredLanguage;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfileRow {
  id: string;
  userId: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyTier: "none" | "bronze" | "silver" | "gold"; // future
  preferredCategories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddressRow {
  id: string;
  userId: string;
  label: string | null;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface RefreshTokenRow {
  id: string;
  userId: string;
  tokenHash: string;
  deviceInfo: {
    device?: string;
    os?: string;
    appVersion?: string;
    ip?: string;
  } | null;
  expiresAt: string;
  isRevoked: boolean;
  createdAt: string;
}

/* ---------- Catalog Domain ---------- */

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  nameHi: string | null;
  description: string | null;
  descriptionHi: string | null;
  parentId: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRow {
  id: string;
  name: string;
  nameHi: string | null;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  descriptionHi: string | null;
  categoryId: string;
  sku: string;
  barcode: string | null;
  basePrice: number;
  sellingPrice: number;
  discountPercent: number;
  costPrice: number | null;
  taxRate: number;
  taxIncluded: boolean;
  weightGrams: number | null;
  dimensionsCm: { length: number; width: number; height: number } | null;
  careInstructions: string | null;
  sunlightReq: SunlightRequirement | null;
  waterFreq: WaterFrequency | null;
  difficultyLevel: DifficultyLevel | null;
  isPetSafe: boolean | null;
  isAirPurifying: boolean | null;
  suitableFor: SuitableFor[] | null;
  seasonal: boolean;
  seasonAvailable: Season[] | null;
  primaryImageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  tags: string[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  metaKeywords: string[] | null;
  totalSold: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageRow {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariantRow {
  id: string;
  productId: string;
  name: string; // e.g., "Small", "Medium"
  attributes: Record<string, string>; // { size: "S", pot: "ceramic" }
  priceAdjustment: number; // added to sellingPrice
  sku: string;
  isActive: boolean;
}

export interface InventoryRow {
  id: string;
  productId: string;
  variantId: string | null;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  reorderLevel: number;
  updatedAt: string;
}

export interface InventoryTransactionRow {
  id: string;
  productId: string;
  variantId: string | null;
  type: InventoryTransactionType;
  refType: InventoryReferenceType;
  refId: string | null;
  quantity: number; // positive=in, negative=out
  reason: string | null;
  performedById: string | null;
  createdAt: string;
}

/* ---------- Cart & Order Domain ---------- */

export interface CartItemRow {
  id: string;
  userId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  addedAt: string;
}

export interface OrderRow {
  id: string;
  orderNumber: string; // GP-prefix
  userId: string;
  addressId: string;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode: string | null;
  notes: string | null;
  deliveryPersonName: string | null;
  deliveryPersonPhone: string | null;
  trackingUrl: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  name: string; // snapshot
  image: string; // snapshot
  unitPrice: number; // snapshot
  quantity: number;
  lineTotal: number;
  isReviewed: boolean;
}

export interface OrderStatusHistoryRow {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  changedById: string | null;
  createdAt: string;
}

/* ---------- Service & Booking Domain ---------- */

export interface ServiceRow {
  id: string;
  name: string;
  nameHi: string | null;
  slug: string;
  shortDescription: string | null;
  description: string;
  descriptionHi: string | null;
  categoryId: string | null;
  serviceType: ServiceType;
  pricingType: ServicePricingType;
  basePrice: number;
  hourlyRate: number | null;
  estimatedDurationMins: number | null;
  imageUrl: string;
  galleryImages: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  availableCities: string[];
  advanceRequired: boolean;
  advanceAmount: number | null; // percentage or amount
  codAllowed: boolean;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  faqs: { q: string; a: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProviderRow {
  id: string;
  userId: string;
  businessName: string;
  bio: string | null;
  experienceYears: number;
  specializations: string[]; // service IDs or category slugs
  serviceRadiusKm: number;
  city: string;
  state: string;
  verificationStatus: ProviderVerificationStatus;
  approvedAt: string | null;
  rejectedReason: string | null;
  commissionPercent: number;
  bankAccountName: string | null;
  bankAccountNumber: string | null; // encrypted at rest
  bankIfsc: string | null;
  upiId: string | null;
  availabilityHours: Record<
    string,
    { start: string; end: string; isAvailable: boolean }
  >;
  blockedDates: string[];
  ratingAverage: number;
  ratingCount: number;
  totalBookingsCompleted: number;
  totalEarnings: number;
  pendingPayout: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderIdProofRow {
  id: string;
  providerId: string;
  type: IdProofType;
  documentNumber: string; // encrypted
  frontImageUrl: string;
  backImageUrl: string | null;
  uploadedAt: string;
}

export interface BookingRow {
  id: string;
  bookingNumber: string; // GB-prefix
  userId: string;
  providerId: string | null;
  serviceId: string;
  addressId: string;
  bookingDate: string; // date of service
  timeSlot: string; // "09:00-11:00"
  notes: string | null;
  status: BookingStatus;
  basePrice: number;
  advancePaid: number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cancellationReason: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  disputeReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderEarningRow {
  id: string;
  providerId: string;
  bookingId: string;
  grossAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  netAmount: number;
  status: "pending" | "processed" | "failed";
  processedAt: string | null;
  createdAt: string;
}

/* ---------- Review Domain ---------- */

export interface ReviewRow {
  id: string;
  reviewableType: ReviewableType;
  reviewableId: string;
  userId: string;
  referenceType: ReviewReferenceType;
  referenceId: string; // order_item id or booking id
  rating: number; // 1-5
  title: string | null;
  body: string | null;
  images: string[];
  isVerifiedPurchase: boolean;
  isHidden: boolean;
  adminResponse: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Return Domain ---------- */

export interface ReturnRow {
  id: string;
  returnNumber: string; // GR-prefix
  orderId: string;
  orderItemId: string;
  userId: string;
  reason: ReturnReason;
  description: string;
  evidenceImages: string[];
  status: ReturnStatus;
  resolution: ReturnResolution | null;
  adminNotes: string | null;
  refundAmount: number | null;
  refundId: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Payment Domain ---------- */

export interface PaymentRow {
  id: string;
  orderId: string | null;
  bookingId: string | null;
  userId: string;
  method: PaymentMethod;
  amount: number;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  gatewayOrderId: string | null; // razorpay_order_id
  gatewayPaymentId: string | null; // razorpay_payment_id
  gatewaySignature: string | null;
  gatewayResponse: Record<string, unknown> | null;
  refundId: string | null;
  refundAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Coupon Domain ---------- */

export interface CouponRow {
  id: string;
  code: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  applicableTo: CouponApplicableTo;
  applicableIds: string[]; // empty = all
  startDate: string;
  endDate: string;
  maxUses: number | null;
  maxUsesPerUser: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Notification Domain ---------- */

export interface NotificationRow {
  id: string;
  userId: string;
  type: import("@/lib/enums").NotificationType;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

/* ---------- Banner Domain ---------- */

export interface BannerRow {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkType: "category" | "product" | "service" | "url";
  linkValue: string;
  displayOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

/* ---------- Location Domain ---------- */

export interface CityRow {
  id: string;
  name: string;
  state: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceablePincodeRow {
  id: string;
  cityId: string;
  pincode: string;
  deliveryCharge: number;
  codAvailable: boolean;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  isActive: boolean;
}

/* ---------- Settings ---------- */

export interface AdminSettingsRow {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  description: string | null;
  updatedAt: string;
}
