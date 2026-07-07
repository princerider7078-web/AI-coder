"use client";

/**
 * GrowPlants — App Providers
 * Source: 05_recreation_prompts.md Prompt 4
 *
 * Phase 1: ThemeProvider only.
 * Phase 3: + CartProvider (for CartDrawer and Cart page).
 * Phase 4: + WishlistProvider (for ProductCard wishlist toggle on homepage).
 * Future phases will add: AuthContext, UserContext, AddressContext,
 * OrdersContext, SettingsContext, TanStack QueryClientProvider.
 */
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}
