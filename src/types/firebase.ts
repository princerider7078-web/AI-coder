/**
 * GrowPlants — Firebase Firestore Types
 * Source: 03_database_design.md §2 Firestore Database Schema
 *
 * These match the documents stored under users/{uid} and orders/{orderId}.
 */
import type { PreferredLanguage } from "@/lib/enums";

export interface FirestoreUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  memberSince: import("firebase/firestore").Timestamp | Date | string | import("firebase/firestore").FieldValue;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    darkMode: boolean;
    language: PreferredLanguage;
  };
  addresses: FirestoreAddress[];
  wishlist: FirestoreWishlistItem[];
  cart: FirestoreCartItem[];
}

export interface FirestoreAddress {
  id: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

export interface FirestoreCartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  price: number;
  image: string;
  quantity: number;
  inStock: boolean;
  addedAt: import("firebase/firestore").Timestamp | Date | string;
}

export interface FirestoreWishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  addedAt: import("firebase/firestore").Timestamp | Date | string;
}

export interface FirestoreOrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type?: string;            // "plant" | "pot" | "gardening"
  size?: string;
  status?: string;          // item-level status (e.g. "shipped" if split shipment)
  slug?: string;
  variantId?: string | null;
}

export interface FirestoreOrderAddressDetails {
  house: string;
  street?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
  instructions?: string;
}

export interface FirestoreOrderStatusEvent {
  status: string;
  date: import("firebase/firestore").Timestamp | Date | string;
  note?: string;
  createdBy?: string;
}

export interface FirestoreOrder {
  orderId: string;
  orderNumber?: string;
  userId: string;
  orderPlacedAt: import("firebase/firestore").Timestamp | Date | string;
  status: string;                                   // pending|confirmed|processing|packed|shipped|out_for_delivery|delivered|cancelled
  paymentMethod: string;                            // cod | razorpay
  paymentStatus: string;                            // pending|paid|failed|refunded|partial_refund
  name: string;                                     // recipient fullName
  phone: string;
  address: string;                                  // single-line formatted address (legacy)
  addressDetails: FirestoreOrderAddressDetails;
  products: FirestoreOrderProduct[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  discount?: number;
  tax?: number;
  notes?: string;
  statusHistory?: FirestoreOrderStatusEvent[];
}
