"use client";

/**
 * GrowPlants — Firebase Providers
 * Wraps all Firebase-backed contexts in the correct hierarchy:
 *
 * AuthProvider → UserProvider → AddressProvider → SettingsProvider
 *             → CartProvider → WishlistProvider → OrdersProvider
 */
import { type ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { AddressProvider } from "@/contexts/AddressContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { BookingsProvider } from "@/contexts/BookingsContext";

export function FirebaseProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <AddressProvider>
          <SettingsProvider>
            <CartProvider>
              <WishlistProvider>
                <OrdersProvider>
                  <BookingsProvider>
                    {children}
                  </BookingsProvider>
                </OrdersProvider>
              </WishlistProvider>
            </CartProvider>
          </SettingsProvider>
        </AddressProvider>
      </UserProvider>
    </AuthProvider>
  );
}
