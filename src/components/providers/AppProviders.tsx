"use client";

/**
 * GrowPlants — App Providers
 * Source: 05_recreation_prompts.md Prompt 4
 *
 * Phase 1: ThemeProvider only.
 * Phase 3: + CartProvider (for CartDrawer and Cart page).
 * Future phases will add: AuthContext, UserContext, WishlistContext,
 * AddressContext, OrdersContext, SettingsContext, TanStack QueryClientProvider.
 */
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CartProvider } from "@/contexts/CartContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
