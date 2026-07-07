"use client";

import { cn } from "@/lib/utils";
import { AnnouncementBar } from "@/components/global/AnnouncementBar";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { CartDrawer } from "@/components/global/CartDrawer";
import { MobileBottomNav } from "@/components/global/MobileBottomNav";
import { OfflineBanner } from "@/components/feedback/OfflineBanner";

/**
 * MainLayout — composition wrapper for customer-facing pages.
 * Source: Frontend Development Plan Part D (Layout Architecture)
 *
 * Wraps children with:
 *   - OfflineBanner (sticky top, auto-shows on network loss)
 *   - AnnouncementBar (dismissable promo strip)
 *   - Header (logo, search, mega menu, cart/wishlist/notification icons)
 *   - main content (with id="main-content" for skip-to-content link)
 *   - Footer (multi-column with trust badges, links, newsletter, social)
 *   - CartDrawer (slide-out, controlled by CartContext)
 *   - MobileBottomNav (fixed bottom, mobile only)
 *
 * Bottom padding on main ensures content isn't hidden behind MobileBottomNav.
 *
 * NOTE: Language toggle intentionally omitted per user request (Phase 3).
 * The bilingual Zustand store remains active internally for all UI labels.
 */
export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Hide footer (useful for checkout flow) */
  hideFooter?: boolean;
}

export function MainLayout({ children, className, hideFooter = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OfflineBanner />
      <AnnouncementBar />
      <Header />

      <main
        id="main-content"
        className={cn(
          "flex-1 w-full pb-16 md:pb-0", // pb-16 for mobile bottom nav
          className
        )}
        tabIndex={-1}
      >
        {children}
      </main>

      {!hideFooter && <Footer />}

      {/* Overlays */}
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
