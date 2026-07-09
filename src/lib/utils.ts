import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CURRENCY_SYMBOL,
  DEFAULT_CITY,
  DEFAULT_STATE,
} from "@/lib/constants";

/**
 * Tailwind class merge — de-duplicates conflicting utility classes.
 * Used by every component across the app.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ============================================================================
 * Currency Formatting (INR)
 * ============================================================================ */

/**
 * Format a number as Indian Rupees with Indian digit grouping (lakh/crore).
 * @example formatINR(499) → "₹499"
 * @example formatINR(1299.5) → "₹1,299.50"
 * @example formatINR(499, { decimals: 0 }) → "₹499"
 */
export function formatINR(
  amount: number | null | undefined,
  options: { decimals?: number; symbol?: boolean } = {}
): string {
  const { decimals = 0, symbol = true } = options;
  if (amount === null || amount === undefined || isNaN(amount)) {
    return symbol ? `${CURRENCY_SYMBOL}0` : "0";
  }
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  // Intl produces "₹1,299" — return as-is (already includes symbol)
  return symbol ? formatted : formatted.replace(CURRENCY_SYMBOL, "").trim();
}

/**
 * Format a number with Indian digit grouping, no currency symbol.
 * @example formatNumberIN(125000) → "1,25,000"
 */
export function formatNumberIN(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
}

/* ============================================================================
 * Discount Calculation
 * ============================================================================ */

/**
 * Calculate discount percentage from base (MRP) and selling price.
 * @example discountPercent(999, 699) → 30
 */
export function discountPercent(
  basePrice: number,
  sellingPrice: number
): number {
  if (basePrice <= 0 || sellingPrice >= basePrice) return 0;
  return Math.round(((basePrice - sellingPrice) / basePrice) * 100);
}

/* ============================================================================
 * Date & Time Formatting (PRD §29.7 NFR-I18N-004/005)
 * Format: DD MMM YYYY (15 Jan 2024), 12-hour with AM/PM (9:30 AM)
 * ============================================================================ */

/**
 * Format a date as "15 Jan 2024".
 */
export function formatDate(
  date: Date | string | null | undefined,
  locale: "en" | "hi" = "en"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  const localeTag = locale === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(localeTag, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Format a date with time as "15 Jan 2024, 9:30 AM".
 */
export function formatDateTime(
  date: Date | string | null | undefined,
  locale: "en" | "hi" = "en"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  const localeTag = locale === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(localeTag, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Format a Date or ISO string as a time only ("10:30 AM").
 */
export function formatTime(
  date: Date | string | null | undefined,
  locale: "en" | "hi" = "en"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  const localeTag = locale === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(localeTag, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Format a time slot label as "9:00 AM – 11:00 AM".
 * Accepts "09:00-11:00" → "9:00 AM – 11:00 AM".
 */
export function formatTimeSlot(slot: string): string {
  if (!slot || !slot.includes("-")) return slot ?? "";
  const [start, end] = slot.split("-");
  return `${format24hTime(start)} – ${format24hTime(end)}`;
}

function format24hTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.trim().split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const display12h = h % 12 === 0 ? 12 : h % 12;
  return `${display12h}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Relative time: "2 hours ago", "3 days ago".
 */
export function formatRelativeTime(
  date: Date | string | null | undefined,
  locale: "en" | "hi" = "en"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  const rtf = new Intl.RelativeTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    numeric: "auto",
  });
  const now = Date.now();
  const diff = d.getTime() - now;
  const absDiff = Math.abs(diff);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (absDiff < hour) return rtf.format(Math.round(diff / minute), "minute");
  if (absDiff < day) return rtf.format(Math.round(diff / hour), "hour");
  if (absDiff < week) return rtf.format(Math.round(diff / day), "day");
  if (absDiff < month) return rtf.format(Math.round(diff / week), "week");
  return rtf.format(Math.round(diff / day), "day");
}

/* ============================================================================
 * Phone Number Formatting (PRD §29.7 NFR-I18N-006)
 * Stored as +91XXXXXXXXXX, displayed as +91 98765 43210
 * ============================================================================ */

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  // Indian format: +91XXXXXXXXXX (12 digits with country code)
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/* ============================================================================
 * Slug & String Helpers
 * ============================================================================ */

/**
 * Convert a product/category name to a URL-safe slug.
 * @example slugify("Snake Plant - Sansevieria") → "snake-plant-sansevieria"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

/**
 * Title-case a string (for display).
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ============================================================================
 * Validation Helpers
 * ============================================================================ */

/**
 * Validate Indian pincode (6 digits).
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/**
 * Validate Indian phone (10 digits, optional +91 prefix).
 */
export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Normalize Indian phone to +91XXXXXXXXXX format.
 */
export function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return phone;
}

/* ============================================================================
 * Geography Defaults
 * ============================================================================ */

export const DEFAULT_LOCATION = {
  city: DEFAULT_CITY,
  state: DEFAULT_STATE,
  country: "India",
};

/* ============================================================================
 * Array / Object Helpers
 * ============================================================================ */

/**
 * Group an array of objects by a key.
 */
export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}

/**
 * Deduplicate an array by a key function.
 */
export function uniqueBy<T, K>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Sleep helper (for graceful async fallbacks).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
