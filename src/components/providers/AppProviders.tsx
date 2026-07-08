"use client";

/**
 * GrowPlants — App Providers
 * Source: 05_recreation_prompts.md Prompt 4
 *
 * Phase 1: ThemeProvider only.
 * Phase 3: + CartProvider (for CartDrawer and Cart page).
 * Phase 4: + WishlistProvider (for ProductCard wishlist toggle on homepage).
 * Phase 5: + AuthProvider (for Login/Register/Forgot Password).
 * Future phases will add: UserContext, AddressContext, OrdersContext,
 * SettingsContext, TanStack QueryClientProvider.
 */
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
