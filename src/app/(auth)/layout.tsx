"use client";

import { AnnouncementBar } from "@/components/global/AnnouncementBar";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { CartDrawer } from "@/components/global/CartDrawer";
import { MobileBottomNav } from "@/components/global/MobileBottomNav";
import { OfflineBanner } from "@/components/feedback/OfflineBanner";

/**
 * GrowPlants — (auth) Route Group Layout
 *
 * Auth pages now use the full MainLayout shell (Header + Footer + CartDrawer)
 * so users can navigate the site while on the login/register page.
 */
export default function AuthRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OfflineBanner />
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1 w-full pb-16 md:pb-0" tabIndex={-1}>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
          <div className="w-full max-w-5xl">{children}</div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
