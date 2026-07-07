/**
 * GrowPlants — (main) Route Group Layout
 * Source: Frontend Development Plan Part D (Layout Architecture)
 *
 * Wraps all customer-facing pages with the MainLayout shell:
 *   AnnouncementBar → Header → main → Footer + CartDrawer + MobileBottomNav
 *
 * Route groups in Next.js App Router don't create URL segments, so
 * (main)/page.tsx still serves the root path "/".
 */
import { MainLayout } from "@/components/global/MainLayout";

export default function MainRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
