"use client";

/**
 * ============================================================================
 * GrowPlants — Phase 1 Foundation Verification Scratch Page
 * ============================================================================
 *
 * This page is TEMPORARY — it will be replaced in Phase 4 (Homepage).
 *
 * Its sole purpose is to visually verify that:
 *   1. Design tokens render correctly (olive bg, pine text, forest green
 *      primary, amber accent, sage secondary).
 *   2. Typography stack works (Plus Jakarta Sans headings, Inter body,
 *      Noto Sans Devanagari for Hindi, JetBrains Mono for codes).
 *   3. shadcn/ui Button component is operational.
 *   4. Zustand bilingual store toggles EN ↔ HI instantly.
 *   5. Lucide icons render.
 *   6. Formatters (INR, date, phone, time slot) produce expected output.
 *   7. Folder structure is intact (paths resolve without errors).
 *
 * Once Phase 4 (Homepage) is approved, this page is replaced with the real
 * GrowPlants landing page composed from sections.
 * ============================================================================
 */
import { useState } from "react";
import {
  Sprout,
  ShoppingCart,
  Heart,
  Sun,
  Droplets,
  Leaf,
  Star,
  CheckCircle2,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBilingual } from "@/store/useBilingual";
import {
  formatINR,
  formatDate,
  formatDateTime,
  formatPhone,
  formatTimeSlot,
  discountPercent,
  slugify,
  formatNumberIN,
} from "@/lib/utils";
import {
  FREE_SHIPPING_THRESHOLD,
  COD_MAX_AMOUNT,
  BOOKING_SLOTS,
  DEFAULT_CITY,
  DEFAULT_PROVIDER_COMMISSION,
  APP_NAME,
  APP_TAGLINE_EN,
  APP_TAGLINE_HI,
} from "@/lib/constants";

export default function FoundationVerificationPage() {
  const { language, toggleLanguage, t } = useBilingual();
  const [count, setCount] = useState(0);

  return (
    <main
      id="main-content"
      className="min-h-screen w-full container-mw container-px section-py"
    >
      {/* ---------- Header ---------- */}
      <header className="flex flex-col gap-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Sprout className="size-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-overline text-muted-foreground">
              Phase 1 — Project Foundation
            </p>
            <h1 className="text-h2 md:text-h1">{APP_NAME}</h1>
          </div>
        </div>
        <p className="text-body-lg text-muted-foreground max-w-2xl">
          {language === "en" ? APP_TAGLINE_EN : APP_TAGLINE_HI}
        </p>
        <p className="text-body-sm text-muted-foreground max-w-2xl">
          This is a temporary foundation verification page. It confirms the
          design tokens, typography, component library, bilingual store, and
          utility helpers are all wired correctly before Phase 2 (Design
          System) begins. It will be replaced by the real homepage in Phase 4.
        </p>
      </header>

      {/* ---------- Status Banner ---------- */}
      <Card className="mb-12 border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-body-sm">
            <p className="font-semibold text-foreground">
              Foundation ready for Phase 2
            </p>
            <p className="text-muted-foreground mt-1">
              All configs, types, lib utilities, Firebase modules (graceful
              env handling), Zod validations, and the Zustand bilingual store
              are in place. <code className="font-mono text-foreground">bun run dev</code> boots
              without errors.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---------- Color Tokens ---------- */}
      <Section
        title="Color Tokens"
        subtitle="Brand palette from the approved Design System (Part E.2)"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <ColorSwatch name="brand-bg (olive)" value="#f7fbf0" className="bg-background border" textClass="text-foreground" />
          <ColorSwatch name="brand-fg (pine)" value="#181d17" className="bg-foreground text-background" />
          <ColorSwatch name="primary (forest green)" value="#2e7d32" className="bg-primary text-primary-foreground" />
          <ColorSwatch name="accent (amber)" value="#f59e0b" className="bg-accent text-accent-foreground" />
          <ColorSwatch name="secondary (sage)" value="#6b8e4e" className="bg-secondary text-secondary-foreground" />
          <ColorSwatch name="success" value="#16a34a" className="bg-[#16a34a] text-white" />
          <ColorSwatch name="warning" value="#d97706" className="bg-[#d97706] text-white" />
          <ColorSwatch name="danger" value="#dc2626" className="bg-[#dc2626] text-white" />
          <ColorSwatch name="surface (white)" value="#ffffff" className="bg-card text-card-foreground border" />
          <ColorSwatch name="surface-alt" value="#f1f5e8" className="bg-muted text-muted-foreground" />
          <ColorSwatch name="border" value="#e3e8d8" className="bg-border text-foreground" />
          <ColorSwatch name="muted-fg" value="#6b7561" className="bg-muted-foreground text-background" />
        </div>
      </Section>

      <Separator className="my-12" />

      {/* ---------- Typography ---------- */}
      <Section
        title="Typography"
        subtitle="Plus Jakarta Sans (headings) + Inter (body) + Noto Sans Devanagari (Hindi) + JetBrains Mono (code)"
      >
        <div className="space-y-6">
          <div>
            <p className="text-overline text-muted-foreground mb-2">Display</p>
            <p className="text-display">Bring home a little green</p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground mb-2">H1 / H2 / H3 / H4</p>
            <p className="text-h1 mb-1">Healthy plants, delivered with care</p>
            <p className="text-h2 mb-1">Best sellers this week</p>
            <p className="text-h3 mb-1">Snake Plant — Sansevieria</p>
            <p className="text-h4">Featured categories</p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground mb-2">Body (Inter)</p>
            <p className="text-body-lg mb-2">
              GrowPlants is Sonipat&apos;s trusted botanical marketplace — shop
              healthy plants, premium planters, and gardening supplies, or book
              verified local gardeners for balcony setup, landscaping, and
              plant care.
            </p>
            <p className="text-body mb-1">
              Body text uses Inter at 16px with 1.5 line-height for
              readability across all breakpoints.
            </p>
            <p className="text-body-sm text-muted-foreground">
              Secondary text uses the muted-foreground token at 14px.
            </p>
            <p className="text-caption text-muted-foreground mt-1">
              Captions are 12px for badges and metadata.
            </p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground mb-2">Devanagari (Noto Sans)</p>
            <p className="text-body" style={{ fontFamily: "var(--font-noto-devanagari)" }}>
              ग्रोप्लांट्स सोनीपत का भरोसेमंद वनस्पति बाज़ार है — स्वस्थ पौधे, प्रीमियम
              प्लांटर और बागवानी सामग्री खरीदें, या सत्यापित माली बुक करें।
            </p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground mb-2">Mono (JetBrains Mono)</p>
            <p className="text-body-sm">
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                ORDER_NUMBER_PREFIX = &quot;GP&quot;
              </code>{" "}
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                BOOKING_SLOTS = [&quot;09:00-11:00&quot;, ...]
              </code>
            </p>
          </div>
        </div>
      </Section>

      <Separator className="my-12" />

      {/* ---------- Bilingual Toggle ---------- */}
      <Section
        title="Bilingual Store (Zustand)"
        subtitle="Instant EN ↔ HI toggle, persisted to localStorage"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-h3">Live language toggle</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Languages className="size-4" aria-hidden="true" />
              {language === "en" ? "हिन्दी" : "English"}
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-overline text-muted-foreground">Common labels</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{t("common.btn.addToCart")}</Badge>
                <Badge variant="secondary">{t("common.btn.buyNow")}</Badge>
                <Badge variant="secondary">{t("common.btn.viewAll")}</Badge>
                <Badge variant="secondary">{t("common.btn.saveChanges")}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-overline text-muted-foreground">Hero copy</p>
              <p className="text-h4">{t("hero.title")}</p>
              <p className="text-body-sm text-muted-foreground">{t("hero.subtitle")}</p>
              <div className="flex gap-2">
                <Button size="sm">{t("hero.ctaPrimary")}</Button>
                <Button size="sm" variant="outline">{t("hero.ctaSecondary")}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Separator className="my-12" />

      {/* ---------- shadcn/ui Button + Icon ---------- */}
      <Section
        title="shadcn/ui Components"
        subtitle="All primitives are installed and operational"
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-overline text-muted-foreground mb-3">Button variants</p>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            <div>
              <p className="text-overline text-muted-foreground mb-3">Button sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Cart">
                  <ShoppingCart className="size-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-overline text-muted-foreground mb-3">Interactive (state check)</p>
              <div className="flex items-center gap-3">
                <Button onClick={() => setCount((c) => c + 1)}>
                  Clicked {count} times
                </Button>
                <Button variant="outline" onClick={() => setCount(0)} disabled={count === 0}>
                  Reset
                </Button>
              </div>
            </div>
            <div>
              <p className="text-overline text-muted-foreground mb-3">Lucide icons (used across the app)</p>
              <div className="flex flex-wrap gap-4 text-foreground">
                <Sprout className="size-5" aria-label="Plant" />
                <ShoppingCart className="size-5" aria-label="Cart" />
                <Heart className="size-5" aria-label="Wishlist" />
                <Sun className="size-5" aria-label="Sunlight" />
                <Droplets className="size-5" aria-label="Water" />
                <Leaf className="size-5" aria-label="Leaf" />
                <Star className="size-5" aria-label="Rating" />
                <CheckCircle2 className="size-5" aria-label="Verified" />
                <Languages className="size-5" aria-label="Language" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Separator className="my-12" />

      {/* ---------- Utility Formatters ---------- */}
      <Section
        title="Utility Formatters"
        subtitle="INR currency, dates, phone, time slots — all PRD §29.7 compliant"
      >
        <Card>
          <CardContent className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-sm">
              <FormatRow
                label="formatINR(499)"
                value={formatINR(499)}
              />
              <FormatRow
                label="formatINR(1299.5, { decimals: 2 })"
                value={formatINR(1299.5, { decimals: 2 })}
              />
              <FormatRow
                label="formatINR(999, { symbol: false })"
                value={formatINR(999, { symbol: false })}
              />
              <FormatRow
                label="formatNumberIN(125000)"
                value={formatNumberIN(125000)}
              />
              <FormatRow
                label="discountPercent(999, 699)"
                value={`${discountPercent(999, 699)}%`}
              />
              <FormatRow
                label="formatDate('2024-07-15')"
                value={formatDate("2024-07-15")}
              />
              <FormatRow
                label="formatDateTime(now)"
                value={formatDateTime(new Date())}
              />
              <FormatRow
                label="formatPhone('919876543210')"
                value={formatPhone("919876543210")}
              />
              <FormatRow
                label="formatPhone('9876543210')"
                value={formatPhone("9876543210")}
              />
              <FormatRow
                label="formatTimeSlot('09:00-11:00')"
                value={formatTimeSlot("09:00-11:00")}
              />
              <FormatRow
                label="slugify('Snake Plant - Sansevieria')"
                value={slugify("Snake Plant - Sansevieria")}
              />
            </dl>
          </CardContent>
        </Card>
      </Section>

      <Separator className="my-12" />

      {/* ---------- Constants Sanity ---------- */}
      <Section
        title="Constants Sanity Check"
        subtitle="All PRD §32.2 defaults imported successfully"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <ConstantCard label="FREE_SHIPPING_THRESHOLD" value={`₹${FREE_SHIPPING_THRESHOLD}`} />
          <ConstantCard label="COD_MAX_AMOUNT" value={`₹${COD_MAX_AMOUNT}`} />
          <ConstantCard label="DEFAULT_CITY" value={DEFAULT_CITY} />
          <ConstantCard label="DEFAULT_PROVIDER_COMMISSION" value={`${DEFAULT_PROVIDER_COMMISSION}%`} />
          <ConstantCard label="BOOKING_SLOTS" value={`${BOOKING_SLOTS.length} slots`} />
          <ConstantCard label="APP_NAME" value={APP_NAME} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {BOOKING_SLOTS.map((slot) => (
            <Badge key={slot} variant="outline" className="font-mono">
              {formatTimeSlot(slot)}
            </Badge>
          ))}
        </div>
      </Section>

      <Separator className="my-12" />

      {/* ---------- Folder Structure ---------- */}
      <Section
        title="Folder Structure"
        subtitle="All planned directories exist and are ready for Phase 2 components"
      >
        <Card>
          <CardContent className="p-6">
            <pre className="text-body-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto scrollbar-pretty">
{`src/
├── app/                     # Next.js App Router (pages, layouts, API routes)
│   ├── globals.css          # GrowPlants design tokens (Part E)
│   ├── layout.tsx           # Root layout (fonts, providers, metadata)
│   └── page.tsx             # This scratch page (replaced in Phase 4)
├── components/
│   ├── ui/                  # shadcn/ui primitives (already installed)
│   ├── providers/           # ThemeProvider, AppProviders
│   ├── global/              # Header, Footer, CartDrawer (Phase 3)
│   ├── sections/            # HeroCarousel, ProductGrid (Phase 4+)
│   ├── products/            # ProductCard, Gallery, Reviews (Phase 7-8)
│   ├── services/            # ServiceCard, BookingScheduler (Phase 11)
│   ├── account/             # AccountSidebar, OrderCard (Phase 12)
│   ├── admin/               # AdminSidebar, DataTable (Phase 14)
│   ├── feedback/            # EmptyState, Skeleton, ErrorState
│   └── common/              # Breadcrumb, Pagination, Rating, Price
├── contexts/                # Auth, Cart, Wishlist, Address, Orders, User, Settings (Phase 3)
├── data/                    # Static catalog JSON (Phase 7)
├── hooks/                   # Custom hooks (use-toast, use-mobile already present)
├── lib/
│   ├── constants.ts         # PRD §32.2 config values
│   ├── enums.ts             # PRD §32.1 enum unions + ERROR_CODES
│   ├── utils.ts             # cn() + INR/date/phone formatters
│   ├── auth.ts              # JWT + HTTP-only cookie helpers
│   ├── toast.ts             # Sonner wrapper
│   ├── db.ts                # Prisma singleton (existing)
│   ├── firebase/            # client, auth, firestore, admin, storage
│   └── validations/         # auth, address, review, contact (Zod)
├── store/
│   └── useBilingual.ts      # Zustand EN/HI store (200+ keys)
└── types/                   # database, api, firebase, forms, index`}
            </pre>
          </CardContent>
        </Card>
      </Section>

      {/* ---------- Footer ---------- */}
      <footer className="mt-16 pt-8 border-t border-border text-body-sm text-muted-foreground">
        <p>
          Phase 1 — Project Foundation complete. Awaiting approval before
          starting Phase 2 (Design System & Component Library).
        </p>
      </footer>
    </main>
  );
}

/* ---------- Sub-components (local to scratch page only) ---------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4">
      <div className="mb-6">
        <h2 className="text-h3 mb-1">{title}</h2>
        {subtitle && (
          <p className="text-body-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ColorSwatch({
  name,
  value,
  className,
  textClass = "text-foreground",
}: {
  name: string;
  value: string;
  className: string;
  textClass?: string;
}) {
  return (
    <div
      className={`rounded-lg p-4 ${className} flex flex-col gap-2 aspect-[4/3] justify-end`}
    >
      <p className={`text-caption font-medium ${textClass}`}>{name}</p>
      <p className={`text-overline font-mono ${textClass} opacity-70`}>{value}</p>
    </div>
  );
}

function FormatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-2 border-b border-border last:border-0">
      <dt className="text-caption text-muted-foreground font-mono">{label}</dt>
      <dd className="text-body font-medium text-foreground">{value}</dd>
    </div>
  );
}

function ConstantCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-caption text-muted-foreground font-mono">{label}</p>
      <p className="text-body font-semibold mt-1">{value}</p>
    </div>
  );
}
