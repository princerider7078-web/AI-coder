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
  memberSince: import("firebase/firestore").Timestamp | Date | string;
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

export interface FirestoreOrder {
  orderId: string;
  userId: string;
  orderPlacedAt: import("firebase/firestore").Timestamp | Date | string;
  paymentMethod: string;
  paymentStatus: string;
  name: string;
  phone: string;
  addressDetails: {
    house: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: string;
}
