"use client";

/**
 * GrowPlants — App Providers
 * RootLayout → AppProviders → ThemeProvider → FirebaseProviders
 *
 * FirebaseProviders contains the full hierarchy:
 *   AuthProvider → UserProvider → AddressProvider → SettingsProvider
 *               → CartProvider → WishlistProvider → OrdersProvider → BookingsProvider
 */
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FirebaseProviders } from "@/components/providers/FirebaseProviders";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <FirebaseProviders>
        {children}
      </FirebaseProviders>
    </ThemeProvider>
  );
}
