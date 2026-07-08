/**
 * GrowPlants — (auth) Route Group Layout
 * Source: Frontend Development Plan Part D (Layout Architecture)
 *
 * Minimal centered layout for authentication pages — NO Header, Footer,
 * CartDrawer, or MobileBottomNav. Just a centered card on a branded
 * background with the logo.
 *
 * Route groups don't create URL segments, so (auth)/login/page.tsx
 * serves the /login path.
 */
export default function AuthRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-container-low">
      {/* Subtle botanical pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 C 20 20, 20 40, 30 50 C 40 40, 40 20, 30 10 Z' fill='%230d631b'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-5xl">{children}</div>
    </div>
  );
}
