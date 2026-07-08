"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface BookingItem {
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  providerId: string | null;
  providerName: string | null;
  priceFrom: number;
  pricingType: string;
  priceUnit: string;
  image: string;
}

export type BookingStatus =
  | "pending" | "confirmed" | "in_progress"
  | "completed" | "cancelled" | "no_show_customer";

export type PaymentMethod = "razorpay" | "cod";

export interface Booking {
  id: string;
  bookingNumber: string;
  service: BookingItem;
  address: { fullName: string; phone: string; addressLine1: string; city: string; state: string; pincode: string; };
  date: string;
  timeSlot: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid";
  status: BookingStatus;
  createdAt: string;
  statusHistory: { status: BookingStatus; date: string; note?: string }[];
}

interface BookingsContextValue {
  bookings: Booking[];
  createBooking: (data: Omit<Booking, "id" | "bookingNumber" | "status" | "paymentStatus" | "createdAt" | "statusHistory">) => Booking;
  getBooking: (id: string) => Booking | null;
  cancelBooking: (id: string, reason?: string) => void;
}

const BookingsContext = createContext<BookingsContextValue | null>(null);
const STORAGE_KEY = "growplants-bookings";
const PREFIX = "GB";

function load(): Booking[] {
  if (typeof window === "undefined") return [];
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function save(b: Booking[]) { if (typeof window !== "undefined") try { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch {} }

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setBookings(load()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) save(bookings); }, [bookings, hydrated]);

  const createBooking = useCallback((data: Omit<Booking, "id" | "bookingNumber" | "status" | "paymentStatus" | "createdAt" | "statusHistory">): Booking => {
    const now = new Date().toISOString();
    const ts = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const booking: Booking = {
      ...data,
      id: `booking-${Date.now()}`,
      bookingNumber: `${PREFIX}-${ts}${rand}`,
      status: "pending",
      paymentStatus: data.paymentMethod === "cod" ? "pending" : "paid",
      createdAt: now,
      statusHistory: [{ status: "pending", date: now, note: "Booking placed" }],
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const getBooking = useCallback((id: string) => bookings.find((b) => b.id === id) ?? null, [bookings]);

  const cancelBooking = useCallback((id: string, reason?: string) => {
    setBookings((prev) => prev.map((b) => {
      if (b.id !== id || (b.status !== "pending" && b.status !== "confirmed")) return b;
      const now = new Date().toISOString();
      return { ...b, status: "cancelled", statusHistory: [...b.statusHistory, { status: "cancelled", date: now, note: reason ?? "Cancelled by customer" }] };
    }));
  }, []);

  return <BookingsContext.Provider value={{ bookings, createBooking, getBooking, cancelBooking }}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingsProvider");
  return ctx;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", in_progress: "In Progress",
  completed: "Completed", cancelled: "Cancelled", no_show_customer: "No-Show",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700", completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700", no_show_customer: "bg-red-100 text-red-700",
};

export const TIME_SLOTS = ["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"] as const;
