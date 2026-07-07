"use client";

/**
 * GrowPlants — App Providers
 * Source: 05_recreation_prompts.md Prompt 4
 *
 * Phase 1 (Foundation): wires ThemeProvider + Toaster only.
 * Phase 3 (Layout System) will extend this with:
 *   - AuthContext
 *   - UserContext
 *   - CartContext
 *   - WishlistContext
 *   - AddressContext
 *   - OrdersContext
 *   - SettingsContext
 *   - TanStack React Query QueryClientProvider
 *
 * Kept minimal in Phase 1 so the dev server boots cleanly without
 * requiring Firebase env vars to be present.
 */
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>{children}</ThemeProvider>;
}
