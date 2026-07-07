/**
 * GrowPlants — Application Constants
 * Source: PRD §32.2 Default Configuration Values
 *
 * These are compile-time defaults. Runtime overrides (admin_settings table)
 * will be merged in later phases; for Phase 1 these constants are the source
 * of truth for cart rules, booking slots, return windows, etc.
 */

/* ---------- Pricing & Shipping ---------- */
export const FREE_SHIPPING_THRESHOLD = 499; // INR
export const DEFAULT_SHIPPING_CHARGE = 49; // INR
export const COD_MAX_AMOUNT = 5000; // INR
export const DEFAULT_TAX_RATE = 18; // GST %
export const DEFAULT_CURRENCY = "INR" as const;
export const CURRENCY_SYMBOL = "₹";

/* ---------- Authentication & Security ---------- */
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_LOCKOUT_MINUTES = 30;
export const MAX_FAILED_LOGINS = 5;
export const LOGIN_LOCKOUT_MINUTES = 30;
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";
export const BCRYPT_SALT_ROUNDS = 12;

/* ---------- Cart Rules ---------- */
export const CART_EXPIRY_DAYS = 7;
export const CART_MAX_ITEMS = 20;
export const CART_MAX_QUANTITY_PER_ITEM = 10;

/* ---------- Inventory ---------- */
export const STOCK_RESERVATION_MINUTES = 30;
export const LOW_STOCK_DEFAULT_THRESHOLD = 5;

/* ---------- Returns ---------- */
export const RETURN_WINDOW_PLANTS_HOURS = 24;
export const RETURN_WINDOW_OTHERS_DAYS = 7;

/* ---------- Reviews ---------- */
export const REVIEW_WINDOW_DAYS = 30;
export const REVIEW_MAX_IMAGES = 5;
export const REVIEW_IMAGE_MAX_MB = 5;
export const REVIEW_EDIT_WINDOW_DAYS = 7;

/* ---------- Product Images ---------- */
export const PRODUCT_IMAGE_MAX_IMAGES = 10;
export const PRODUCT_IMAGE_MAX_MB = 5;
export const PRODUCT_IMAGE_THUMBNAIL_PX = 200;
export const PRODUCT_IMAGE_CARD_PX = 400;
export const PRODUCT_IMAGE_FULL_PX = 800;

/* ---------- Service Providers & Bookings ---------- */
export const DEFAULT_PROVIDER_COMMISSION = 20; // %
export const MIN_ADVANCE_BOOKING_DAYS = 1;
export const BOOKING_SLOTS = [
  "09:00-11:00",
  "11:00-13:00",
  "14:00-16:00",
  "16:00-18:00",
] as const;
export const BOOKING_CANCEL_FULL_REFUND_HOURS = 24;

/* ---------- Admin ---------- */
export const ADMIN_MAX_ACCOUNTS = 3;
export const NOTIFICATION_BACKSTOCK_LIMIT = 100;

/* ---------- Order / Booking / Return Number Prefixes ---------- */
export const ORDER_NUMBER_PREFIX = "GP";
export const BOOKING_NUMBER_PREFIX = "GB";
export const RETURN_NUMBER_PREFIX = "GR";

/* ---------- Geography ---------- */
export const DEFAULT_CITY = "Sonipat";
export const DEFAULT_STATE = "Haryana";

/* ---------- Localization ---------- */
export const DEFAULT_LANGUAGE = "en" as const;
export const SUPPORTED_LANGUAGES = ["en", "hi"] as const;
export const SUPPORTED_LANGUAGE_LABELS: Record<
  (typeof SUPPORTED_LANGUAGES)[number],
  string
> = {
  en: "English",
  hi: "हिन्दी",
};

/* ---------- Delivery Slots (PRD §22.1 FR-DEL-007) ---------- */
export const DELIVERY_SLOTS = [
  { id: "morning", label: "Morning", time: "9 AM – 12 PM" },
  { id: "afternoon", label: "Afternoon", time: "2 PM – 5 PM" },
  { id: "evening", label: "Evening", time: "5 PM – 8 PM" },
] as const;

/* ---------- Pagination ---------- */
export const PRODUCTS_PER_PAGE = 20;
export const ORDERS_PER_PAGE = 10;
export const BOOKINGS_PER_PAGE = 10;
export const REVIEWS_PER_PAGE = 10;

/* ---------- App URLs ---------- */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const APP_NAME = "GrowPlants";
export const APP_TAGLINE_EN = "Plants, Planters & Gardening Services in Sonipat";
export const APP_TAGLINE_HI = "सोनीपत में पौधे, प्लांटर और बागवानी सेवाएं";

/* ---------- Contact (placeholder — admin updates in Phase 14) ---------- */
export const CONTACT_PHONE = "+919999999999";
export const CONTACT_EMAIL = "hello@growplants.in";
export const CONTACT_ADDRESS = "Sonipat, Haryana, India";
export const BUSINESS_HOURS = "Mon – Sun, 9:00 AM – 7:00 PM IST";

/* ---------- Social (placeholder) ---------- */
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/growplants",
  facebook: "https://facebook.com/growplants",
  youtube: "https://youtube.com/@growplants",
  whatsapp: "https://wa.me/919999999999",
} as const;

/* ---------- Storage Paths (Firebase Storage) ---------- */
export const STORAGE_PATHS = {
  profileImages: "profile-images",
  productImages: "product-images",
  providerCertificates: "provider-certificates",
  reviewImages: "review-images",
  invoices: "invoices",
  returnEvidence: "return-evidence",
} as const;

/* ---------- API Response ---------- */
export const API_SUCCESS_CODE = 200;
export const API_CREATED_CODE = 201;
export const API_NO_CONTENT_CODE = 204;
export const API_BAD_REQUEST_CODE = 400;
export const API_UNAUTHORIZED_CODE = 401;
export const API_FORBIDDEN_CODE = 403;
export const API_NOT_FOUND_CODE = 404;
export const API_CONFLICT_CODE = 409;
export const API_UNPROCESSABLE_CODE = 422;
export const API_RATE_LIMIT_CODE = 429;
export const API_SERVER_ERROR_CODE = 500;
