/**
 * GrowPlants — Enum Unions
 * Source: PRD §32.1 Complete Enum List
 *
 * These TypeScript unions mirror the database enums. They are the canonical
 * reference for status badges, filter values, and form options across the app.
 */

/* ---------- User ---------- */
export type UserRole = "customer" | "admin" | "provider";
export type UserStatus = "active" | "suspended" | "deleted";
export type Gender = "male" | "female" | "other" | "prefer_not";
export type PreferredLanguage = "en" | "hi";

/* ---------- OTP ---------- */
export type OtpIdentifierType = "phone" | "email";
export type OtpPurpose =
  | "registration"
  | "login"
  | "password_reset"
  | "phone_change";

/* ---------- Product Care ---------- */
export type SunlightRequirement =
  | "full_sun"
  | "partial_shade"
  | "shade"
  | "indirect";
export type WaterFrequency = "daily" | "alternate_day" | "weekly" | "monthly";
export type DifficultyLevel = "easy" | "moderate" | "expert";
export type SuitableFor = "indoor" | "outdoor" | "balcony" | "office";
export type Season = "spring" | "summer" | "monsoon" | "winter";

/* ---------- Product Flags ---------- */
export type ProductStatus = "active" | "inactive";

/* ---------- Order ---------- */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "return_approved"
  | "return_completed"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partial_refund";

export type PaymentMethod = "razorpay" | "cod" | "wallet";

/* ---------- Booking ---------- */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "provider_assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show_provider"
  | "no_show_customer"
  | "disputed";

/* ---------- Service ---------- */
export type ServicePricingType = "fixed" | "hourly" | "quote_based";
export type ServiceType = "one_time" | "recurring" | "subscription";

/* ---------- Provider ---------- */
export type ProviderVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

/* ---------- Review ---------- */
export type ReviewableType = "product" | "service" | "provider";
export type ReviewReferenceType = "order_item" | "booking";

/* ---------- Return ---------- */
export type ReturnReason =
  | "damaged"
  | "wrong_item"
  | "quality_issue"
  | "other";
export type ReturnStatus =
  | "requested"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";
export type ReturnResolution = "replacement" | "refund";

/* ---------- Payment ---------- */
export type PaymentTransactionMethod =
  | "razorpay_upi"
  | "razorpay_card"
  | "razorpay_netbanking"
  | "razorpay_wallet"
  | "cod";

export type PaymentTransactionStatus =
  | "created"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded";

/* ---------- Notification ---------- */
export type NotificationType =
  | "order_update"
  | "booking_update"
  | "payment"
  | "promotional"
  | "system"
  | "review_request";

export type NotificationChannel = "email" | "sms" | "push" | "in_app";

/* ---------- Inventory ---------- */
export type InventoryTransactionType =
  | "restock"
  | "sale"
  | "return"
  | "adjustment"
  | "damage";

export type InventoryReferenceType = "order" | "return" | "manual";

/* ---------- Coupon ---------- */
export type CouponDiscountType = "percentage" | "flat";
export type CouponApplicableTo = "all" | "products" | "services";

/* ---------- ID Proof ---------- */
export type IdProofType =
  | "aadhar"
  | "pan"
  | "passport"
  | "driving_license";

/* ---------- Error Codes (PRD §32.4) ---------- */
export const ERROR_CODES = {
  AUTH_001: "Phone number already registered",
  AUTH_002: "Invalid OTP",
  AUTH_003: "OTP expired",
  AUTH_004: "Too many OTP attempts",
  AUTH_005: "Invalid credentials",
  AUTH_006: "Account suspended",
  AUTH_007: "Email already in use",
  CART_001: "Product out of stock",
  CART_002: "Quantity exceeds available stock",
  CART_003: "Cart item limit exceeded",
  CART_004: "Invalid coupon code",
  CART_005: "Coupon expired",
  CART_006: "Minimum order amount not met for coupon",
  ORDER_001: "Pincode not serviceable",
  ORDER_002: "Payment verification failed",
  ORDER_003: "Order cannot be cancelled at this stage",
  ORDER_004: "Return window expired",
  ORDER_005: "Already reviewed",
  BOOK_001: "Service not available in your city",
  BOOK_002: "Time slot not available",
  BOOK_003: "Provider not available on selected date",
  BOOK_004: "Booking cannot be cancelled at this stage",
  PROV_001: "Provider not yet approved",
  PROV_002: "Provider account suspended",
  VALIDATION_ERROR: "Input validation failed",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Not authenticated",
  FORBIDDEN: "Insufficient permissions",
  INTERNAL_ERROR: "Unexpected server error",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
