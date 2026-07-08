# GrowPlants — Complete Frontend Development Plan

**Document Type:** Frontend Architecture & Development Roadmap
**Prepared By:** Senior Product Designer / UI-UX Engineer / Frontend Architect
**Status:** DRAFT — Awaiting Approval Before Development
**Source of Truth:** growplants_BRD.txt, growplants_prd.txt, 01_project_specification.md, 02_directory_map.md, 03_database_design.md, 04_environment_and_configs.md, 05_recreation_prompts.md, Complete Database Design.txt

---

# PART A — PHASE 0: PROJECT ANALYSIS

## A.1 What Is GrowPlants

GrowPlants is a **location-based botanical e-commerce + gardening service marketplace** built for the Indian gardening ecosystem, launching first in **Sonipat, Haryana** with parameters designed for state-wide (Haryana) and national expansion.

The platform rests on **three commercial pillars**:

1. **Product Store (Owner-Managed E-Commerce)** — Plants (indoor, outdoor, flowering, succulents, bonsai, medicinal, air-purifying), Planters (ceramic, plastic, metal, hanging, decorative, terracotta, fiber), and Gardening Products (pots, seeds, fertilizers, soil, tools, accessories, pest control, plant food). Inventory is owner-managed (NOT a multi-vendor marketplace).

2. **Service Marketplace** — Customers book verified, admin-approved service providers (gardeners) for gardening maintenance, balcony/terrace setup, landscaping, lawn care, and plant health checkups. Revenue is commission-based (default 20%).

3. **Admin Control Center** — Full operational management of catalog, inventory, orders, bookings, providers, customers, returns, coupons, banners, cities/pincodes, and analytics.

## A.2 Three User Roles

| Role | Purpose | Key Surfaces |
|---|---|---|
| **Customer** | Browse shop, book services, manage orders/bookings/profile | Home, Shop, PDP, Cart, Checkout, Account dashboard, Services, Bookings |
| **Service Provider** | Apply to onboard, list services, manage bookings & payouts | Become-Provider application, Provider portal dashboard |
| **Admin** | Manage catalog, approve gardeners, oversee orders/bookings/returns | Admin panel (separate desktop-first workspace) |

## A.3 Technology Foundation (Frontend-Relevant)

| Layer | Technology | Frontend Implication |
|---|---|---|
| Framework | Next.js 16.2.7 (App Router, RSC) | Server components for SEO pages, client components for interactivity |
| Language | TypeScript 5.x (strict) | All API payloads, contexts, DB rows typed |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) | CSS-variable-based theming, design tokens |
| Icons | Lucide React + Material Symbols CDN | Two icon systems available |
| Client State | Zustand (bilingual dictionary) + 7 React Contexts | Auth, Cart, Wishlist, Address, Orders, User, Settings contexts |
| Forms | React Hook Form + Zod | Type-safe validation on all forms |
| Data Fetching | TanStack React Query v5 | Client-side caching of API responses |
| Auth | Firebase Client SDK + JWT HTTP-only cookies | Dual-layer auth: Firebase for real-time sync, JWT for server verification |
| Real-time | Firebase Firestore | Live cart/wishlist/orders sync across devices |
| File Storage | Firebase Storage | Avatars, provider certificates, invoices |
| Primary DB | PostgreSQL via Prisma 7.8 | Source of truth for catalog, orders, bookings, inventory |
| Maps | Google Maps API (PRD requirement) | Location picker, delivery area validation |
| Payments | Razorpay Web SDK | UPI, cards, net banking, wallets; COD for orders ≤ ₹5000 |

**Two color anchors (from spec):** Background olive `#f7fbf0`, Text pine `#181d17`.

## A.4 Core Business Rules (Must Be Respected in UI)

1. **No guest checkout** — Account required for all purchases (BRD §13, PRD §1.3).
2. **Free shipping threshold: ₹499** — Cart drawer must show progress indicator (spec §A).
3. **Bilingual EN/HI** — Instant client-side toggle via Zustand, persisted per user (spec §1, PRD §29.7).
4. **Real-time inventory** — Out-of-stock products remain visible with "Notify Me" (BRD §13, PRD §15.1).
5. **Reviews restricted to verified purchasers only** — One review per purchase/booking, 30-day window (PRD §17.1).
6. **Returns:** Plants 24h damage window (photo mandatory); Planters/Accessories 7 days for defects; Services cancellable before start (BRD §14, PRD §21).
7. **COD limit:** ₹5000 max, configurable per pincode (PRD §14.2).
8. **Booking slots:** 9–11AM, 11AM–1PM, 2–4PM, 4–6PM; min 1 day advance booking (PRD §13.1, §32.2).
9. **Default city:** Sonipat; default state: Haryana (PRD §32.2).
10. **Cart limits:** Max 20 unique items, max 10 units per product, cart expires after 7 days (PRD §10.1, §32.2).
11. **GST:** 18% default, tax-inclusive pricing by default (PRD §9.3, §32.2).
12. **Commission:** Default 20% provider commission (PRD §32.2).

## A.5 Complete Page Inventory (38 Customer Screens + Admin + Provider)

### Customer-Facing Web Pages
Home `/` · About `/about` · Contact `/contact` · FAQ `/faq` · Terms `/terms` · Privacy `/privacy-policy` · Refund Policy `/refund-policy` · Login `/login` · Shop `/shop` · Product Detail `/product/[slug]` · Cart `/cart` · Checkout `/checkout` · Order Confirmation `/order-confirmation/[orderId]` · Services `/services` · Service Detail (modal/route) · Providers Directory `/providers` · Become Provider `/become-provider` · Provider Portal `/provider` · Account Dashboard `/account/dashboard` · Orders `/account/orders` · Order Detail · Wishlist `/account/wishlist` · Addresses `/account/addresses` · Profile `/account/profile` · Settings `/account/settings` · Security `/account/security` · Bookings (account) · Booking Detail · Search Results · Category Browse · 404 Error

### Admin Panel Pages (Desktop-First)
Admin Login · Dashboard Home · Orders Management · Order Detail · Bookings Management · Booking Detail · Products Management · Product Add/Edit · Inventory Management · Services Management · Providers Management · Provider Application Review · Customers Management · Returns Management · Coupons Management · Banners Management · Cities & Pincodes · Settings · Analytics & Reports

### Provider Portal Pages
Provider Dashboard · Bookings Management · Calendar View · Profile Management · Availability Settings · Earnings & Payouts

**Total scope: ~70+ unique screens** across the three role-based workspaces.

---

# PART B — FRONTEND DEVELOPMENT ROADMAP

The roadmap is organized into **14 progressive phases**. Each phase groups only related pages and must be completed (with self-review) before the next phase begins. No two unrelated pages are built together.

## Phase Overview

| # | Phase Name | Scope | Pages | Depends On |
|---|---|---|---|---|
| 1 | Project Foundation | Tooling, configs, env, types, folder structure | 0 (foundation) | — |
| 2 | Design System & Component Library | Tokens, primitives, base UI kit | 0 (library) | Phase 1 |
| 3 | Layout System | Header, Footer, MobileNav, CartDrawer, AppProviders | 0 (shell) | Phase 2 |
| 4 | Homepage | Landing page with all sections | 1 | Phase 3 |
| 5 | Authentication | Login, Register, Forgot Password, OTP | 4 | Phase 3 |
| 6 | CMS / Static Pages | About, Contact, FAQ, Terms, Privacy, Refund, 404 | 7 | Phase 3 |
| 7 | Shop & Catalog | Shop PLP, Category Browse, Search Results | 3 | Phase 3, 5 |
| 8 | Product Details | PDP with gallery, reviews, related | 1 | Phase 7 |
| 9 | Cart & Drawer | Cart page + slide-out CartDrawer | 1 | Phase 8 |
| 10 | Checkout & Orders | Checkout, Order Confirmation, Order History, Order Detail | 4 | Phase 9 |
| 11 | Service Marketplace | Services listing, Service detail, Booking flow, Booking Confirmation, Booking History, Booking Detail, Providers directory, Become-Provider | 8 | Phase 10 |
| 12 | Customer Dashboard | Account layout, Dashboard, Profile, Addresses, Wishlist, Settings, Security, My Reviews, Returns | 9 | Phase 10 |
| 13 | Provider Portal | Provider dashboard, Bookings, Calendar, Profile, Earnings | 6 | Phase 11 |
| 14 | Admin Panel | Full admin workspace (15+ screens) | 15+ | Phase 12 |

> Phases 1–3 are infrastructure. Phases 4–14 are page-building. Each page follows the 9-step workflow (Understand → Explain structure → List components → Build → Responsive → A11y → Optimize → Self-review → Report).

---

# PART C — COMPONENT ARCHITECTURE

A strict reusable component strategy. Everything below lives under `src/components/` and is composed — never duplicated — across pages.

## C.1 Component Folder Structure

```
src/components/
├── global/          # Layout-level: Header, Footer, Nav, CartDrawer
├── ui/              # Primitives: Button, Input, Badge, Modal, etc.
├── sections/        # Page sections: HeroBanner, ProductGrid, Testimonials
├── products/        # Product-specific: ProductCard, ProductGallery, ReviewCard
├── services/        # Service-specific: ServiceCard, BookingScheduler
├── account/         # Account-specific: SidebarNav, OrderCard, AddressCard
├── admin/           # Admin-specific: AdminSidebar, DataTable, StatCard
├── feedback/        # EmptyState, LoadingSkeleton, ErrorState, Toast
└── common/          # Breadcrumb, Pagination, Rating, Price, Avatar
```

## C.2 Reusable Component Inventory

### Primitives (`ui/`)
| Component | Variants / Props |
|---|---|
| `Button` | variants: primary, secondary, ghost, outline, danger; sizes: sm, md, lg; loading state |
| `IconButton` | icon + aria-label, hover/active states |
| `Input` | text, email, tel, password, search; error/helper text; left-icon support |
| `Textarea` | label, char counter, error |
| `Select` | native + custom dropdown; searchable variant |
| `Checkbox` | checked, indeterminate, error |
| `RadioGroup` | horizontal/vertical layout |
| `Switch` | on/off toggle with label |
| `Slider` (range) | min/max/step, dual-handle for price |
| `Badge` | variants: sale, new, bestseller, out-of-stock, verified, pending, approved |
| `Chip` (filter) | removable, selected states |
| `Avatar` | image, fallback initials, sizes |
| `Rating` (stars) | display + interactive; half-star support; review count |
| `Price` | original strikethrough + selling + discount %; INR formatting |
| `Spinner` | sizes; overlay variant |
| `Skeleton` | text, card, image, circle shapes |
| `Tooltip` | hover/focus trigger |
| `Divider` | horizontal/vertical |
| `Tabs` | underline/pill variants; controlled/uncontrolled |
| `Accordion` | single/multi expand; FAQ variant |
| `Modal` | sizes: sm/md/lg/xl; close on overlay/ESC; focus trap |
| `Drawer` | slide directions: right/left/bottom; sizes |
| `Toast` | success/error/warning/info; auto-dismiss; stacked |
| `Alert` (inline) | info/warning/error/success |
| `ProgressBar` | free-shipping indicator; upload progress |
| `Pagination` | numbered + prev/next; compact mobile variant |
| `Breadcrumb` | schema-aware (JSON-LD) |
| `Calendar` (date picker) | single date; disabled dates; min/max |
| `TimeSlotPicker` | slot grid; unavailable states |
| `FileUpload` | drag-drop; preview; multi-file; size/type validation |
| `Table` | sortable columns; row actions; empty state |
| `DataTable` | Table + pagination + filters + bulk actions (admin) |
| `StatCard` | label, value, delta, icon (admin dashboard) |
| `Chart` wrappers | line, bar, donut (admin analytics) |

### Layout & Navigation (`global/`)
| Component | Purpose |
|---|---|
| `AnnouncementBar` | Top promo strip, bilingual |
| `Header` | Logo + Pincode checker + Search + Lang toggle + Wishlist/Cart/Account |
| `MegaMenu` | Desktop category dropdown (2-level hierarchy) |
| `MobileHeader` | Compact header with hamburger |
| `MobileBottomNav` | Home / Shop / Services / Cart / Account |
| `MobileDrawerNav` | Categories, Orders, Bookings, Wishlist, Notifications, Settings, Help |
| `Footer` | Multi-column: shop, services, support, trust badges, payment badges, social |
| `CartDrawer` | Slide-out cart with free-shipping progress |
| `LanguageToggle` | EN/HI switch |
| `PincodeChecker` | Inline delivery-validation widget |
| `SearchBar` (header) | Autocomplete suggestions dropdown |
| `NotificationBell` | In-app notification center with unread badge |

### Section Blocks (`sections/`)
| Component | Used On |
|---|---|
| `HeroCarousel` | Home |
| `CategoryShortcuts` | Home |
| `ProductCarousel` / `ProductGrid` | Home, Shop, PDP (related), Account (wishlist) |
| `ServicesHighlight` | Home |
| `TrustBadges` | Home, Footer |
| `TestimonialsCarousel` | Home |
| `NewsletterCTA` | Home, Footer |
| `SectionHeader` | Reusable heading + subtitle + action link |
| `PromoBanner` | Home (seasonal) |
| `RecentlyViewed` | Home, PDP |

### Product-Specific (`products/`)
| Component | Purpose |
|---|---|
| `ProductCard` | Image, name, price, rating, badges, wishlist heart, add-to-cart |
| `ProductCardSkeleton` | Loading state |
| `ProductGallery` | Thumbnail rail + main image + zoom |
| `VariantSelector` | Size/pot type selectors |
| `QuantitySelector` | 1–10 with stock cap |
| `CareSpecs` | Sunlight / water / difficulty / pet-safe icons |
| `RatingHistogram` | 5→1 star breakdown bars |
| `ReviewCard` | Avatar, rating, body, images, verified badge |
| `ReviewForm` | Star input + text + image upload (RHF + Zod) |
| `ReviewFilter` | Filter by star rating |
| `SimilarProducts` | Horizontal carousel |
| `StockStatus` | In stock / Only X left / Out of stock / Notify Me |

### Service-Specific (`services/`)
| Component | Purpose |
|---|---|
| `ServiceCard` | Image, name, price (or "Get Quote"), rating, Book Now |
| `ServiceDetail` | Description, whats included/excluded, gallery, slots |
| `ProviderCard` | Photo, name, rating, specializations, verification badge |
| `ProviderProfile` | Public profile (bio, services, reviews) |
| `BookingScheduler` | Calendar + slot picker + address + notes |
| `BookingSummaryCard` | Service, provider, date, time, price breakdown |
| `BookingStatusBadge` | 9 booking statuses |
| `ProviderOnboardingForm` | Multi-step wizard |

### Account-Specific (`account/`)
| Component | Purpose |
|---|---|
| `AccountSidebar` | Dashboard / Orders / Bookings / Wishlist / Addresses / Profile / Settings / Security |
| `AccountHeader` | Page title + breadcrumb |
| `OrderCard` | Order number, date, status, items thumbnails, total |
| `OrderTimeline` | Pending → Confirmed → Processing → Out for Delivery → Delivered |
| `OrderItemRow` | Image, name, variant, qty, price, actions (review/return) |
| `AddressCard` | Label, recipient, full address, default badge, edit/delete |
| `AddressForm` | RHF + Zod; map pin picker |
| `WishlistGrid` | Reuses ProductCard with remove action |
| `ProfileForm` | Name, email, phone, avatar, gender, DOB, language |
| `SecurityPanel` | Change password, active sessions, logout all |
| `SettingsPanel` | Dark mode, notifications, language |
| `ReturnRequestForm` | Reason, description, photo upload |
| `EmptyState` variants | No orders, no bookings, no wishlist, no addresses, no reviews |

### Admin-Specific (`admin/`)
| Component | Purpose |
|---|---|
| `AdminSidebar` | Dashboard / Orders / Bookings / Products / Inventory / Services / Providers / Customers / Returns / Coupons / Banners / Cities / Settings / Reports |
| `AdminTopbar` | Search, notifications, profile |
| `KpiCard` | Metric + trend + icon |
| `AdminDataTable` | Sort, filter, bulk select, CSV export, row actions |
| `StatusPill` | All enum statuses (order, booking, payment, verification) |
| `ProductForm` (admin) | Full DB-006 fields, image gallery, variants, SEO |
| `StockAdjustForm` | Quantity + reason + ref type |
| `ProviderReviewPanel` | Application details + approve/reject |
| `BannerUploader` | Image + order + link target |
| `CouponForm` | Code, type, value, min order, validity |
| `CityPincodeManager` | CRUD cities + pincodes + charges |
| `ChartPanel` | Revenue, orders, registrations, top products |

### Feedback States (`feedback/`)
| Component | Purpose |
|---|---|
| `EmptyState` | Icon + title + description + CTA; composable for any context |
| `LoadingSkeleton` | Page-level + card-level + list-level variants |
| `ErrorState` | Retry CTA, error code, contact support link |
| `OfflineBanner` | Network status indicator |
| `ToastContainer` | Stacked toasts, top-right or bottom |

---

# PART D — LAYOUT ARCHITECTURE

## D.1 Layout Shells

Next.js App Router layouts under `src/app/`:

```
src/app/
├── layout.tsx                    # Root layout: <html>, fonts, AppProviders, body bg
├── (main)/layout.tsx             # Customer site: Header + Footer + CartDrawer + MobileNav
│   ├── page.tsx                  # Home
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── terms|privacy-policy|refund-policy/page.tsx
│   ├── shop/page.tsx
│   ├── product/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── order-confirmation/[orderId]/page.tsx
│   ├── services/page.tsx
│   ├── providers/page.tsx
│   ├── become-provider/page.tsx
│   └── search/page.tsx
├── (auth)/layout.tsx             # Minimal centered layout (no header/footer)
│   └── login/page.tsx
├── account/layout.tsx            # Sidebar + content area (auth-guarded)
│   ├── dashboard/page.tsx
│   ├── orders/page.tsx
│   ├── orders/[id]/page.tsx
│   ├── bookings/page.tsx
│   ├── bookings/[id]/page.tsx
│   ├── wishlist/page.tsx
│   ├── addresses/page.tsx
│   ├── profile/page.tsx
│   ├── settings/page.tsx
│   └── security/page.tsx
├── provider/layout.tsx           # Provider portal shell (role-guarded)
│   ├── page.tsx                  # dashboard
│   ├── bookings/page.tsx
│   ├── calendar/page.tsx
│   ├── profile/page.tsx
│   └── earnings/page.tsx
├── admin/layout.tsx              # Admin shell (admin-guarded, desktop-first)
│   ├── page.tsx                  # dashboard
│   ├── orders/page.tsx
│   ├── orders/[id]/page.tsx
│   ├── bookings/...
│   ├── products/...
│   ├── inventory/...
│   ├── services/...
│   ├── providers/...
│   ├── customers/...
│   ├── returns/...
│   ├── coupons/...
│   ├── banners/...
│   ├── cities/...
│   ├── settings/page.tsx
│   └── reports/page.tsx
├── not-found.tsx                 # 404
└── error.tsx                     # Global error boundary
```

## D.2 Layout Responsibilities

| Layout | Header | Footer | MobileNav | CartDrawer | Sidebar | Auth Guard |
|---|---|---|---|---|---|---|
| Root | — | — | — | — | — | — |
| `(main)` | ✅ | ✅ | ✅ | ✅ | — | Public |
| `(auth)` | Minimal logo | — | — | — | — | Redirect-if-logged-in |
| `account` | ✅ (compact) | ✅ | ✅ | ✅ | ✅ AccountSidebar | Customer-only |
| `provider` | ✅ (provider variant) | — | — | — | ✅ ProviderSidebar | Provider-only |
| `admin` | ✅ (admin variant) | — | — | — | ✅ AdminSidebar | Admin-only |

## D.3 Responsive Breakpoints (Tailwind v4)

| Breakpoint | Width | Target |
|---|---|---|
| `xs` | < 640px | Mobile portrait |
| `sm` | ≥ 640px | Mobile landscape / small tablet |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Laptop |
| `xl` | ≥ 1280px | Desktop |
| `2xl` | ≥ 1536px | Large desktop |

Mobile-first: base styles target mobile, progressive enhancement upward.

---

# PART E — DESIGN SYSTEM PLAN

## E.1 Brand Identity: "GrowPlants — Botanical Premium"

**Identity position:** A modern, trustworthy botanical commerce brand that feels closer to **a premium local nursery gone digital** than to a generic marketplace. Warm, natural, expert, and inherently Indian. The visual language should evoke healthy foliage, handcrafted ceramics, and the calm of a well-tended garden — not the sterile feel of a tech product.

## E.2 Color System (Design Tokens)

### Core Brand Colors
| Token | Light | Dark (future) | Usage |
|---|---|---|---|
| `--color-bg` | `#f7fbf0` (light olive) | `#0f140d` | Page background |
| `--color-fg` | `#181d17` (dark pine) | `#eef3e6` | Body text |
| `--color-primary` | `#2e7d32` (forest green) | `#4caf50` | Primary CTAs, links |
| `--color-primary-hover` | `#256628` | `#5dc362` | Hover states |
| `--color-accent` | `#f59e0b` (warm amber) | `#fbbf24` | Sale badges, highlights, "New" tags |
| `--color-secondary` | `#6b8e4e` (sage) | `#9bb87a` | Secondary buttons, dividers |

### Semantic Colors
| Token | Light | Usage |
|---|---|---|
| `--color-success` | `#16a34a` | In-stock, confirmed, approved |
| `--color-warning` | `#d97706` | Low stock, pending |
| `--color-danger` | `#dc2626` | Out-of-stock, error, cancelled |
| `--color-info` | `#0284c7` | Info toasts, links |

### Surface & Border Tokens
| Token | Light | Usage |
|---|---|---|
| `--color-surface` | `#ffffff` | Cards, modals, drawers |
| `--color-surface-alt` | `#f1f5e8` | Section backgrounds, table stripes |
| `--color-border` | `#e3e8d8` | Borders, dividers |
| `--color-border-strong` | `#c7d0b3` | Inputs focus, emphasized borders |
| `--color-muted` | `#6b7561` | Secondary text, captions |

### Full Token Scale
Each color above exposes a 50→900 scale (e.g., `primary-50` through `primary-900`) for fine-grained usage in charts, badges, and gradients.

## E.3 Typography System

| Role | Font Family | Why |
|---|---|---|
| Headings (Display) | **Plus Jakarta Sans** (700/800) | Modern geometric, premium, distinctive vs. Inter |
| Body | **Inter** (400/500/600) | Industry-standard readability, excellent CJK fallback |
| Numeric / Prices | **Inter** with tabular-nums | Aligned pricing columns |
| Hindi (Devanagari) | **Noto Sans Devanagari** | Crisp Hindi rendering |
| Mono (codes, SKUs) | **JetBrains Mono** | SKU/ID display in admin |

### Type Scale (Tailwind v4 fluid via clamp)
| Token | Size (mobile → desktop) | Usage |
|---|---|---|
| `text-display` | 36px → 56px | Hero H1 |
| `text-h1` | 30px → 40px | Page titles |
| `text-h2` | 24px → 32px | Section titles |
| `text-h3` | 20px → 24px | Card titles |
| `text-h4` | 18px → 20px | Subsections |
| `text-body-lg` | 18px | Lead paragraphs |
| `text-body` | 16px | Default body |
| `text-body-sm` | 14px | Secondary text, captions |
| `text-caption` | 12px | Badges, metadata |
| `text-overline` | 12px uppercase tracking | Section labels |

Line-height: 1.5 for body, 1.2 for headings. Letter-spacing: -0.02em for display/headings, 0 for body.

## E.4 Spacing System

Base unit: **4px**. Scale follows Tailwind defaults (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96).

Section vertical rhythm: `py-16 md:py-24` for major sections; `gap-6 md:gap-8` for card grids.

## E.5 Radius System

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Badges, chips |
| `--radius-md` | 10px | Buttons, inputs |
| `--radius-lg` | 16px | Cards |
| `--radius-xl` | 24px | Modals, large cards |
| `--radius-full` | 9999px | Avatars, pills |

## E.6 Shadow System

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(24,29,23,0.06)` | Inputs, subtle elevation |
| `--shadow-sm` | `0 2px 4px rgba(24,29,23,0.08)` | Cards resting |
| `--shadow-md` | `0 8px 16px rgba(24,29,23,0.10)` | Cards hover, dropdowns |
| `--shadow-lg` | `0 16px 32px rgba(24,29,23,0.12)` | Modals, drawers |
| `--shadow-focus` | `0 0 0 3px rgba(46,125,50,0.35)` | Focus rings (a11y) |

## E.7 Motion & Animations

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `--ease-fast` | 150ms | cubic-bezier(0.4, 0, 0.2, 1) | Hover, tap |
| `--ease-base` | 250ms | cubic-bezier(0.4, 0, 0.2, 1) | Modals, drawers |
| `--ease-slow` | 400ms | cubic-bezier(0.16, 1, 0.3, 1) | Page transitions |

Micro-interactions: button press scale (0.97), card lift on hover (translateY -2px + shadow-md), image zoom on gallery hover (1.05), skeleton shimmer (1.5s loop), toast slide-in (250ms).

Reduce-motion: respect `prefers-reduced-motion` — disable non-essential animations.

## E.8 Iconography

- **Primary set:** Lucide React (line-style, consistent stroke, 24px grid).
- **Secondary:** Material Symbols (loaded via CDN in root layout) for category icons and specialized glyphs.
- Icon size scale: 16, 20, 24, 32px. Stroke width: 1.5 for UI, 2 for emphasis.
- Every icon button MUST have `aria-label`.

## E.9 Form & Input Standards

- All inputs: 44px min height (touch target), `--radius-md`, 1px border `--color-border`, focus ring `--shadow-focus`.
- Labels above inputs, helper text below.
- Error states: red border + red helper text + aria-invalid.
- Required fields marked with `*` and `aria-required`.
- All forms use React Hook Form + Zod schemas co-located in `src/lib/validations/`.

## E.10 Dark Mode Readiness

The design system defines dark tokens from day one (see E.2). Implementation: `class="dark"` strategy on `<html>`, toggled via SettingsContext. **Phase 1 ships light mode only**; dark mode is a future toggle that requires zero refactor because tokens are already defined.

## E.11 Accessibility Baseline (WCAG 2.1 AA)

- Color contrast: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components.
- All interactive elements reachable via keyboard (Tab order), visible focus rings.
- Modals/Drawers: focus trap, ESC to close, return focus to trigger.
- All images: meaningful `alt` (decorative → `alt=""`).
- Forms: associated `<label>`, error messages linked via `aria-describedby`.
- Skip-to-content link on every page.
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.

---

# PART F — PAGE-BY-PAGE TASK BREAKDOWN

> Each page below follows the standardized task template. Pages are grouped by phase. The 9-step per-page workflow applies: Understand → Structure → Components → Build → Responsive → A11y → Optimize → Self-review → Report. **Only one page is built at a time.**

---

## PHASE 1 — PROJECT FOUNDATION (No Pages)

### Page: N/A (Infrastructure)

**Purpose:** Establish the project skeleton, configurations, environment, type system, and folder structure so all subsequent phases build on a stable base.

**Business Goal:** De-risk the project by locking tooling, env, and conventions before any UI is written.

**Target User:** Development team.

**Entry Points:** Repository clone.

**Tasks (checklist):**
- [ ] `package.json` with all dependencies from `05_recreation_prompts.md` Prompt 1 (Next 16.2.7, React 19.2.4, Prisma 7.8, TanStack Query 5, Firebase 12.14, firebase-admin 14, jsonwebtoken 9.0.3, bcryptjs 3.0.3, zod 4.4.3, zustand 5.0.14, lucide-react 1.17, react-hook-form 7.77, class-variance-authority, tailwind-merge).
- [ ] `tsconfig.json` with `@/*` → `./src/*` path mapping, strict mode.
- [ ] `next.config.ts` with all 22 remote image domains from `04_environment_and_configs.md`.
- [ ] `postcss.config.mjs` using `@tailwindcss/postcss`.
- [ ] `src/app/globals.css` with Tailwind v4 imports + CSS variables for the full design system (Part E).
- [ ] `.env` and `.env.local` templates per `04_environment_and_configs.md` §1.
- [ ] `src/types/` — TypeScript interfaces for every DB model, API payload, context state, and form input (derived from `03_database_design.md` and PRD §05).
- [ ] `src/lib/` — `prisma.ts` (singleton), `auth.ts` (JWT helpers), `utils.ts` (`cn`, formatters), `firebase/` (client, admin, firestore, storage), `validations/` (Zod schemas).
- [ ] `src/lib/constants.ts` — all config values from PRD §32.2 (FREE_SHIPPING_THRESHOLD=499, COD_MAX=5000, BOOKING_SLOTS, etc.).
- [ ] `src/lib/enums.ts` — all enum unions from PRD §32.1.
- [ ] Folder structure: `app/`, `components/{global,ui,sections,products,services,account,admin,feedback,common}`, `contexts/`, `data/`, `hooks/`, `lib/`, `store/`, `types/`.
- [ ] ESLint + Prettier + Husky pre-commit hooks.

**Completion Checklist:** `npm run dev` boots without error; design tokens render in a scratch page; TypeScript compiles with zero errors; env templates exist.

---

## PHASE 2 — DESIGN SYSTEM & COMPONENT LIBRARY (No Pages)

### Page: N/A (Component Library)

**Purpose:** Build every primitive in Part C.2 so page construction in later phases is pure composition.

**Business Goal:** Eliminate duplication, enforce visual consistency, accelerate page delivery.

**Target User:** Development team.

**Tasks:**
- [ ] Build all `ui/` primitives (Button, Input, Select, Checkbox, RadioGroup, Switch, Slider, Badge, Chip, Avatar, Rating, Price, Spinner, Skeleton, Tooltip, Divider, Tabs, Accordion, Modal, Drawer, Toast, Alert, ProgressBar, Pagination, Breadcrumb, Calendar, TimeSlotPicker, FileUpload, Table, DataTable, StatCard, Chart wrappers).
- [ ] Build all `feedback/` components (EmptyState variants, LoadingSkeleton variants, ErrorState, OfflineBanner, ToastContainer).
- [ ] Build `common/` components (Breadcrumb with JSON-LD, Pagination, Rating, Price, Avatar, StatusPill for every enum).
- [ ] Storybook-style scratch page at `/dev` (not in production nav) showcasing every component in every variant/state.
- [ ] Document props and usage in JSDoc comments.

**Completion Checklist:** Every primitive renders in light mode; all variants accessible via keyboard; focus rings visible; TypeScript strict; no console errors.

---

## PHASE 3 — LAYOUT SYSTEM (Shell Pages)

### Page: Root Layout + AppProviders + Global Shell

**Purpose:** Establish the visual frame (Header, Footer, MobileNav, CartDrawer, AnnouncementBar) and wire all 7 React Contexts + Zustand bilingual store.

**Business Goal:** Every subsequent page inherits a consistent, premium navigation frame with working cart/wishlist/auth/language state.

**Target User:** All users (customer-facing shell).

**Entry Points:** Every customer page.

**Navigation Flow:** AnnouncementBar (top) → Header (logo, pincode, search, lang, wishlist, cart, account) → MegaMenu (categories, hover) → [Page Content] → Footer. Mobile: MobileHeader → [Content] → MobileBottomNav; hamburger opens MobileDrawerNav.

**Required Components:** AnnouncementBar, Header, MegaMenu, MobileHeader, MobileBottomNav, MobileDrawerNav, Footer, CartDrawer, LanguageToggle, PincodeChecker, SearchBar (with autocomplete), NotificationBell.

**Required Sections:** Top promo strip, primary nav row, mega-menu overlay, footer columns (Shop, Services, Support, Company, Trust badges, Payment badges, Social, Newsletter signup, Sitemap links).

**Required Buttons:** Logo (home), Nav links, Wishlist icon, Cart icon (with bubble count), Account icon, Language toggle, Search submit, Footer links, Social icons.

**Required Forms:** Header search (with autocomplete dropdown showing product thumbnails + categories).

**Required Modals:** None at shell level.

**Required Drawers:** CartDrawer (slide-out right), MobileDrawerNav (slide-out left).

**Required Tables:** None.

**Required Empty States:** CartDrawer empty state ("Your cart is empty" + Shop CTA), Search no-results state.

**Required Loading States:** Search autocomplete loading, CartDrawer fetching state.

**Required Error States:** CartDrawer sync error toast.

**Responsive Behaviour:** Desktop (≥1024): full Header + MegaMenu + multi-column Footer. Tablet (768–1023): Header collapses nav into hamburger, Footer to 2 columns. Mobile (<768): MobileHeader + MobileBottomNav + MobileDrawerNav, Footer to 1 column stacked.

**SEO Requirements:** Root `<html lang>`, Inter + Plus Jakarta Sans + Noto Sans Devanagari fonts preloaded, Material Symbols CDN, JSON-LD LocalBusiness schema in Footer, canonical URL handling.

**Accessibility:** Skip-to-content link first focusable; all nav items keyboard-reachable; MegaMenu opens on focus + hover; CartDrawer traps focus; ESC closes any drawer; mobile nav has aria-expanded state.

**Animations:** Header sticky shrink on scroll (translateY 0 → -8px shadow fade), CartDrawer slide 250ms ease-base, MobileDrawerNav slide 250ms, AnnouncementBar marquee (optional, reduced-motion safe).

**Micro Interactions:** Cart icon bounces on add; wishlist heart fills with scale animation; language toggle instant swap; search input expands on focus.

**Future Integrations:** Dark mode toggle (token-ready), city selector (Phase 2 multi-city), FCM push notification bell wiring.

**Dependencies:** Phase 1 (configs, types, contexts), Phase 2 (primitives).

**Completion Checklist:** Shell renders on `/`; cart drawer opens/closes; language toggle switches EN↔HI instantly; search shows autocomplete; mobile bottom nav works; footer displays all columns; all contexts initialized; no hydration mismatches.

---

## PHASE 4 — HOMEPAGE

### Page: Home (`/`)

**Purpose:** Convert visitors into shoppers and service-bookers by showcasing the full value proposition: products, services, trust, and locality.

**Business Goal:** Maximize add-to-cart and service-booking conversions; communicate "trusted local botanical ecosystem in Sonipat".

**Target User:** All visitors (homeowners 25–55, apartment residents, plant enthusiasts, small businesses).

**Entry Points:** Direct navigation, logo click, footer "Home", mobile bottom nav.

**Navigation Flow:** Hero → Category shortcuts → Featured Products → Best Sellers → New Arrivals → Services highlight → Why GrowPlants (trust) → Testimonials → Newsletter CTA → Footer.

**Required Components:** HeroCarousel, CategoryShortcuts, ProductCarousel (×3 — featured, bestsellers, new arrivals), ServicesHighlight, TrustBadges, TestimonialsCarousel, NewsletterCTA, PromoBanner (seasonal), SectionHeader, ProductCard, ServiceCard, RecentlyViewed (if logged in).

**Required Sections:**
1. Hero carousel (max 5 admin-managed banners, FR-HOME-001)
2. Quick category shortcuts (Plants, Planters, Products, Services — FR-HOME-002)
3. Featured products (max 8, FR-HOME-003)
4. Best sellers (FR-HOME-004)
5. New arrivals (FR-HOME-005)
6. Services highlight (top 4 services, FR-HOME-006)
7. Why GrowPlants trust section (FR-HOME-007)
8. Testimonials/reviews (FR-HOME-008)
9. Seasonal promo banner (FR-HOME-009, optional)
10. Location indicator (Sonipat default, FR-HOME-010)
11. Search prominently placed (FR-HOME-011)
12. Recently viewed (FR-HOME-012, optional, logged-in only)

**Required Buttons:** Hero CTA ("Shop Now" / "Book Service"), Category shortcut tiles, "Add to Cart" on each product card, "View All" links per product section, "Book Now" on service cards, Newsletter subscribe, "Shop Plants" / "Book Service" hero CTAs.

**Required Forms:** Newsletter email signup (RHF + Zod, email validation).

**Required Modals:** None (cart opens drawer).

**Required Drawers:** CartDrawer (inherited from shell).

**Required Tables:** None.

**Required Empty States:** Recently-viewed empty (hidden if none).

**Required Loading States:** Skeleton carousels for each product section (ProductCardSkeleton ×8), HeroCarousel skeleton, TestimonialsSkeleton.

**Required Error States:** If a section fails to load, show that section's error state without breaking the rest of the page (partial render with retry).

**Responsive Behaviour:** Hero full-bleed mobile, contained desktop. Category shortcuts: 4-col mobile, 6-col tablet, 8-col desktop. Product carousels: 2 cards visible mobile, 3 tablet, 4 desktop (horizontal scroll on mobile, snap). Trust badges: 2-col mobile, 4-col desktop. Testimonials: 1-col mobile carousel, 3-col desktop grid.

**SEO Requirements:** Unique title "GrowPlants — Plants, Planters & Gardening Services in Sonipat", meta description, JSON-LD LocalBusiness (name, address Sonipat, geo, openingHours, priceRange), JSON-LD ItemList of featured products, Open Graph image, canonical.

**Accessibility:** Carousel: aria-roledescription="carousel", prev/next buttons labelled, autoplay pausable on focus. Product cards: semantic article, wishlist button aria-pressed, add-to-cart announces via aria-live. Newsletter: label associated, error announced.

**Animations:** Hero carousel auto-advance 5s (pause on hover/focus), fade+slide transition; product carousels snap-scroll; section reveal on scroll (IntersectionObserver, fade-up 400ms, staggered 80ms); testimonial carousel autoplay.

**Micro Interactions:** Product card hover: image zoom 1.05, shadow lift, "Add to Cart" reveals; category shortcut hover: icon scale + bg tint; trust badge hover: tooltip with detail.

**Future Integrations:** AI plant recommendation carousel (Phase 3), personalized recently-viewed, geo-personalized hero (city-specific banners).

**Dependencies:** Phase 3 (shell + ProductCard + ServiceCard), React Query for product/service fetching.

**Completion Checklist:** All 12 sections render; bilingual EN/HI on every label; carousels responsive; add-to-cart works and updates drawer count; newsletter validates; SEO tags present; Lighthouse > 90; CLS < 0.1.

---

## PHASE 5 — AUTHENTICATION

### Page: Login / Register (`/login`)

**Purpose:** Single toggleable panel handling login, registration, and password reset entry. Account is required for purchase (BRD §13).

**Business Goal:** Convert visitors to registered users with minimum friction; collect phone (unique), email (unique), name, password.

**Target User:** Unauthenticated visitors.

**Entry Points:** Header "Account" icon, checkout auth-gate redirect, route guard redirects, "Login" links.

**Navigation Flow:** Toggle Login ↔ Register ↔ Forgot Password. On success → redirect to intended page (or home). Link to "Become a Provider" application.

**Required Components:** AuthCard (centered card), Tabs (Login/Register), Input (email, phone, password, name, confirm), Button (submit, social?), LanguageToggle, Logo, Alert (error), PasswordStrengthMeter (register).

**Required Sections:** Left brand panel (botanical imagery + value props) | Right form panel. Mobile: stacked, brand panel collapses to logo + tagline.

**Required Buttons:** Submit Login, Submit Register, "Forgot Password?" link, "Don't have an account? Register" toggle, "Become a Provider" link, Language toggle.

**Required Forms:** LoginForm (email/phone + password), RegisterForm (name, email, phone, password, confirm, terms-accept checkbox), ForgotPasswordForm (email/phone).

**Required Modals:** Terms acceptance modal (read full terms before checkbox).

**Required Drawers:** None.

**Required Tables:** None.

**Required Empty States:** None.

**Required Loading States:** Submit button spinner, form disabled during submit.

**Required Error States:** Invalid credentials (AUTH_005), account suspended (AUTH_006), email already in use (AUTH_007), phone already registered (AUTH_001), network error generic.

**Responsive Behaviour:** Desktop 2-col (brand | form). Mobile 1-col stacked. Form max-width 440px.

**SEO Requirements:** `noindex` (auth pages shouldn't be indexed). Title "Login | GrowPlants".

**Accessibility:** Tab order: email → password → submit → toggle. Error announced via aria-live. Password show/hide toggle. Phone input with +91 prefix and aria-label.

**Animations:** Form panel fade-in 250ms, tab switch slide, error shake on invalid submit.

**Micro Interactions:** Password strength meter animates as user types, show/hide password eye toggle, submit button loading state.

**Future Integrations:** Google login (Phase 2), OTP login (PRD API-004), biometric login on mobile app.

**Dependencies:** Phase 3 (shell, but auth uses minimal layout), Firebase Auth, JWT cookie helpers, RHF + Zod.

**Completion Checklist:** Login works (Firebase + JWT cookie set); Register creates user in PostgreSQL + Firebase; Forgot Password triggers reset; errors display correctly; redirect-after-login works; bilingual labels; accessible.

### Page: OTP Verification (modal/route within `/login` flow)

**Purpose:** Verify phone/email during registration and password reset (PRD §07, API-002).

**Business Goal:** Ensure contactability for order/booking notifications.

**Target User:** Registering/resetting users.

**Entry Points:** After Register submit, after Forgot Password submit.

**Navigation Flow:** 6-digit OTP input → Verify → Success (proceed) / Resend (cooldown 60s) / Back.

**Required Components:** OTPInput (6 separate boxes, auto-advance), CountdownTimer (resend cooldown), Button (Verify, Resend), Alert.

**Required Forms:** OTP form (6 digits).

**Required Modals:** Inline (part of auth card).

**Required Empty States:** None.

**Required Loading States:** Verify spinner.

**Required Error States:** Invalid OTP (AUTH_002), OTP expired (AUTH_003), too many attempts (AUTH_004 — show lockout 30min).

**Responsive Behaviour:** Centered card, 6 OTP boxes wrap on narrow screens.

**SEO:** noindex.

**Accessibility:** OTP boxes aria-label="Digit N of 6", auto-focus first box, paste-distribute support, keyboard nav.

**Animations:** Box focus ring pulse, success checkmark animation.

**Dependencies:** Phase 5 (login page context).

**Completion Checklist:** OTP send/verify works; resend cooldown enforces; lockout after 3 attempts; accessible.

### Page: Forgot Password (`/login` sub-view)

**Purpose:** Initiate password reset via email/phone OTP (PRD API-007, API-008).

**Business Goal:** Recover access for locked-out users.

**Tasks:** Covered in Login page above (toggle view). Includes: email/phone input → OTP → new password → confirm → success redirect to login.

**Completion Checklist:** Reset email/SMS sent; OTP verified; password updated; user redirected to login.

---

## PHASE 6 — CMS / STATIC PAGES

### Page: About Us (`/about`)

**Purpose:** Tell the Sonipat-focused botanical store brand story and mission (directory map §2).

**Business Goal:** Build trust and emotional connection; communicate local roots.

**Target User:** All visitors evaluating brand credibility.

**Entry Points:** Footer "About", header nav (optional), home link.

**Navigation Flow:** Hero (founder story image) → Mission → Values → Team (optional) → Stats (years, plants sold, customers) → CTA (Shop / Book Service).

**Required Components:** SectionHeader, ImageWithCaption, StatBlock, ValueCard, CTASection, Breadcrumb.

**Required Sections:** Brand story hero, mission statement, values grid (3–6 cards), stats counter, founder/team section, CTA.

**Required Buttons:** "Shop Plants", "Book a Service", "Contact Us".

**Required Forms:** None.

**Responsive Behaviour:** Hero full-bleed; values 1-col mobile / 3-col desktop; stats 2-col mobile / 4-col desktop.

**SEO:** Unique title, meta description, JSON-LD AboutPage + Organization, canonical, OG image.

**Accessibility:** Semantic headings hierarchy, images alt text, stats aria-live on count-up.

**Animations:** Stat counters animate on scroll, values fade-up staggered.

**Dependencies:** Phase 3.

**Completion Checklist:** Story renders; stats animate; bilingual; CTA works; SEO tags present.

### Page: Contact Us (`/contact`)

**Purpose:** Interactive form submitting to `/api/contact` (directory map §2, §3).

**Business Goal:** Capture customer queries, support requests, partnership inquiries.

**Target User:** All visitors.

**Entry Points:** Footer "Contact", header nav, order/booking error fallbacks.

**Navigation Flow:** Contact info panel (address Sonipat, phone, email, hours) | Contact form. On submit → success toast + reset.

**Required Components:** ContactForm (RHF + Zod: name, email, phone, subject, message), ContactInfoCard, MapEmbed (Google Maps Sonipat location), Alert, Toast, Breadcrumb.

**Required Sections:** Two-column: left = form, right = contact info + map + social.

**Required Buttons:** Submit, "Call Now" (tel: link), "Email Us" (mailto:), social icons.

**Required Forms:** Contact form with validation: name (min 2), email (valid), phone (Indian format +91), subject (required), message (min 10 chars).

**Required Modals:** None.

**Required Empty States:** None.

**Required Loading States:** Submit spinner, button disabled.

**Required Error States:** Field validation errors, API error (generic retry), rate-limit error (429).

**Responsive Behaviour:** 2-col desktop → 1-col mobile (form first, info below).

**SEO:** noindex or index with unique title; JSON-LD ContactPage.

**Accessibility:** All inputs labelled, error announced, map has alt text and title.

**Animations:** Form focus rings, success checkmark animation on submit.

**Dependencies:** Phase 3, `/api/contact` route.

**Completion Checklist:** Form validates; submits to API; success toast; map renders; bilingual; accessible.

### Page: FAQ (`/faq`)

**Purpose:** Collapsible accordion addressing common order/delivery/return/booking queries (directory map §2).

**Business Goal:** Reduce support load; answer pre-purchase questions.

**Target User:** All visitors.

**Entry Points:** Footer "FAQ", header "Help", checkout/before-purchase links.

**Navigation Flow:** Category tabs (Orders, Delivery, Returns, Bookings, Account, Payments) → Accordion items per category → CTA to contact if unanswered.

**Required Components:** Accordion (FAQ variant), Tabs (category filter), SearchInput (filter FAQ), ContactCTA, Breadcrumb.

**Required Sections:** Page hero (title + search), category tabs, accordion list, "Still have questions?" CTA.

**Required Buttons:** Tab switches, accordion expand/collapse, "Contact Us" CTA.

**Required Forms:** FAQ search input (client-side filter).

**Responsive Behaviour:** Tabs horizontal scroll on mobile; accordion full-width.

**SEO:** Indexable; JSON-LD FAQPage schema (rich result eligible); unique title.

**Accessibility:** Accordion uses button + aria-expanded + aria-controls; keyboard navigable; search updates results live.

**Animations:** Accordion expand 250ms ease, search filter fade.

**Dependencies:** Phase 3.

**Completion Checklist:** All categories render; search filters; accordion accessible; FAQ JSON-LD present; bilingual.

### Page: Terms & Conditions (`/terms`)

**Purpose:** Public legal guidelines (directory map §2, BRD §16).

**Business Goal:** Compliance; define user rights/obligations.

**Target User:** All users (linked from registration terms checkbox, footer).

**Entry Points:** Footer "Terms", registration terms modal.

**Navigation Flow:** Sidebar TOC (sticky) | Long-form legal content | "Last updated" date.

**Required Components:** TableOfContents (sticky sidebar), LegalContent (typography-rich), Breadcrumb, LastUpdated badge.

**Required Sections:** Introduction, Accounts, Orders, Payments, Shipping, Returns, Services, Bookings, Privacy, Liability, Changes to Terms, Contact.

**Responsive Behaviour:** TOC sidebar desktop → collapsible dropdown mobile; content max-width 768px for readability.

**SEO:** Indexable; unique title; canonical; JSON-LD Article.

**Accessibility:** Semantic headings, TOC skip links, readable line length (max 70 chars).

**Dependencies:** Phase 3.

**Completion Checklist:** All sections render; TOC scroll-spy works; bilingual; printable (print stylesheet).

### Page: Privacy Policy (`/privacy-policy`)

**Purpose:** Public legal guidelines (BRD §16).

**Tasks:** Same structure as Terms. Sections: Data We Collect, How We Use Data, Cookies, Data Sharing, Data Security, User Rights, Children's Privacy, Changes, Contact.

**Completion Checklist:** Renders; TOC works; bilingual; printable.

### Page: Refund Policy (`/refund-policy`)

**Purpose:** Public refund/return policy (BRD §14, PRD §21).

**Tasks:** Same structure as Terms. Sections: Plant Returns (24h damage window, photo required), Planter/Accessory Returns (7-day defect window), Service Cancellations, Refund Timelines (Razorpay 3–5 days, Net Banking 5–7 days, COD 7 days manual), Refund Methods.

**Completion Checklist:** Renders; TOC works; bilingual; printable; links to return flow for logged-in users.

### Page: 404 / Error (`not-found.tsx` + `error.tsx`)

**Purpose:** Graceful handling of unknown routes and unhandled errors (PRD UI-038).

**Business Goal:** Retain users who hit dead ends; guide back to shopping.

**Target User:** All users who hit errors.

**Entry Points:** Invalid URL, unhandled exception.

**Navigation Flow:** Large illustration + "Page not found" message + suggested links (Home, Shop, Services, Contact) + search bar.

**Required Components:** ErrorIllustration, Button (primary, ghost), SearchBar, SuggestedLinks.

**Required Sections:** Illustration, message, search, suggested destinations.

**Required Buttons:** "Back to Home", "Browse Shop", "Book a Service", "Contact Support".

**Responsive Behaviour:** Centered card, max-width 600px, illustration scales.

**SEO:** noindex; proper 404 status code.

**Accessibility:** Illustration alt or aria-hidden, keyboard-focusable CTA.

**Animations:** Illustration gentle float, CTA hover.

**Dependencies:** Phase 3.

**Completion Checklist:** 404 returns correct status; error boundary catches runtime errors; recovery CTA works; bilingual.

---

## PHASE 7 — SHOP & CATALOG

### Page: Shop / Product Listing (`/shop`)

**Purpose:** Catalog search workspace with active filter panels (directory map §2). The primary product discovery surface.

**Business Goal:** Help customers find the right plant/planter/product fast; maximize filter→add-to-cart conversion.

**Target User:** Shopping customers (homeowners, apartment residents, enthusiasts).

**Entry Points:** Header "Shop", mega-menu category links, home category shortcuts, footer, mobile bottom nav.

**Navigation Flow:** Breadcrumb → Title + result count → Filter sidebar (desktop) / Filter bottom-sheet (mobile) → Sort dropdown → Product grid → Pagination / Load more.

**Required Components:** Breadcrumb, FilterSidebar (CategoryFilter, PriceRangeSlider, RatingFilter, SuitableForFilter, SunlightFilter, DifficultyFilter, InStockToggle, PetSafeToggle), SortDropdown, ProductGrid, ProductCard (×N), ProductCardSkeleton, Pagination, FilterChipBar (active filters), EmptyState (no results), MobileFilterSheet (Drawer bottom), ResultCount, Breadcrumb.

**Required Sections:** Top bar (breadcrumb + title + count + sort + mobile filter button), sidebar filters (desktop left), product grid (main), pagination footer.

**Required Buttons:** Filter apply/clear, sort option buttons, product card "Add to Cart" + wishlist heart, pagination prev/next + numbers, mobile "Show Filters" button, "Clear All" filters.

**Required Forms:** Filter form (URL-encoded state per PRD §18.2 — `?category=plants&min_price=100&max_price=500&rating=4`).

**Required Modals:** None.

**Required Drawers:** MobileFilterSheet (bottom drawer with all filters, apply/clear buttons).

**Required Tables:** None.

**Required Empty States:** No results — "No products match your filters" + suggested categories + clear filters CTA.

**Required Loading States:** ProductCardSkeleton grid (×8–12), FilterSidebar skeleton, pagination skeleton.

**Required Error States:** API error — ErrorState with retry; partial filter error.

**Responsive Behaviour:** Desktop (≥1024): sidebar 280px left + grid 3–4 col right. Tablet (768–1023): sidebar collapses to top filter bar + grid 3 col. Mobile (<768): grid 2 col + floating "Filters" button → bottom sheet.

**Filter options (per PRD §8.4):**
- Category (multi-select checkboxes, 2-level hierarchy)
- Price range (dual-handle slider, ₹0–₹10000)
- Rating (min 1–5 stars radio)
- Suitable for (indoor/outdoor/balcony/office — multi-select)
- Sunlight (full_sun/partial_shade/shade/indirect — multi-select)
- Difficulty (easy/moderate/expert — multi-select)
- In stock only (toggle)
- Pet safe (toggle)

**Sort options:** Featured, Price Low→High, Price High→Low, Newest, Best Rated, Best Sellers (PRD §8.4 FR-PLP-006).

**Pagination:** 20 products per page OR infinite scroll (PRD FR-PLP-007) — recommend infinite scroll with "Load More" fallback.

**Product card shows (FR-PLP-002, §8.4):** image, name, price (original + selling + discount %), rating + review count, badges (Sale/New/Best Seller/Out of Stock), wishlist heart, add-to-cart button, "Notify Me" if out of stock.

**SEO Requirements:** Indexable; unique title per filter state; canonical to base `/shop` (filter URLs are variations); JSON-LD BreadcrumbList + ItemList; clean URLs (slugs); pagination rel=prev/next; image alt tags.

**Accessibility:** Filter checkboxes keyboard-operable; price slider keyboard-adjustable; product cards semantic article; add-to-cart announces via aria-live; filter changes announced; mobile filter sheet traps focus.

**Animations:** Grid items fade-in staggered on load; filter change → smooth grid re-flow; card hover lift; "Load More" button spinner.

**Micro Interactions:** Filter chip remove (×), price slider live value tooltip, wishlist heart fill animation, add-to-cart button → cart icon bounce.

**Future Integrations:** AI-powered "Find your perfect plant" quiz filter, recently viewed rail, personalized sort.

**Dependencies:** Phase 3 (shell, ProductCard, Pagination), Phase 5 (wishlist requires auth), React Query for `/api/products`.

**Completion Checklist:** Filters URL-encoded and shareable; sort works; pagination/infinite scroll; out-of-stock shows Notify Me; badges render; mobile filter sheet works; bilingual; Lighthouse > 90; CLS < 0.1.

### Page: Category Browse (`/shop?category=[slug]` or `/category/[slug]`)

**Purpose:** Browse a specific category (e.g., Indoor Plants) with the same Shop experience pre-filtered.

**Business Goal:** SEO landing pages per category; deeper product discovery.

**Tasks:** Reuses Shop page with pre-applied category filter. Adds: category hero banner (from `categories.banner_url`), category description, subcategory navigation chips.

**Required Components:** All Shop components + CategoryHero (banner + title + description), SubcategoryChips.

**SEO:** Unique title/meta per category (from `categories.seo_title`, `seo_description`), JSON-LD CollectionPage + BreadcrumbList, canonical per category.

**Completion Checklist:** Category hero renders; subcategory chips filter; SEO unique per category; breadcrumb correct; bilingual.

### Page: Search Results (`/search?q=[query]`)

**Purpose:** Search results page with filter and sort capabilities (PRD §18.1 FR-SEARCH-005).

**Business Goal:** Convert search intent into product views/cart additions.

**Entry Points:** Header search bar submit, "no results" suggestions.

**Navigation Flow:** Search bar (pre-filled query) → Result count → Tabs (Products / Services / Categories) → Filter + sort → Results grid → "No results" state with suggestions.

**Required Components:** SearchBar (header, pre-filled), ResultTabs (Products/Services/Categories), ProductGrid, ServiceCard grid, CategoryResultList, FilterSidebar (subset), SortDropdown, Pagination, EmptyState (no results), RecentSearchesChipBar (if logged in), PopularSearches suggestions.

**Required Sections:** Search header (query echo + count), tab switcher, results area, "no results" fallback.

**Required Buttons:** Tab switches, sort, filter, result cards, "Clear search", "Popular searches" chips.

**Required Forms:** Search input (refine query).

**Required Empty States:** "No results for '{query}'" + popular searches + popular products + category suggestions (FR-SEARCH-006).

**Required Loading States:** Skeleton grid.

**Responsive Behaviour:** Same as Shop.

**SEO:** noindex on search results (avoid index bloat); canonical to base.

**Accessibility:** Search input aria-label, results announced, tabs keyboard-operable.

**Future Integrations:** Fuzzy search (FR-SEARCH-009), Hindi Devanagari search (FR-SEARCH-010), search analytics (FR-SEARCH-007).

**Dependencies:** Phase 7 (Shop components), Phase 11 (ServiceCard for services tab).

**Completion Checklist:** Search returns products + services + categories; tabs switch; filters work; no-results state helpful; recent searches persist; bilingual.

---

## PHASE 8 — PRODUCT DETAILS

### Page: Product Detail (`/product/[slug]`)

**Purpose:** SSR-optimized detail layout showing comprehensive product specs, ratings, reviews, and similar products (directory map §2, PRD §8.5).

**Business Goal:** Convert product interest into add-to-cart / buy-now; build confidence via care info, reviews, and trust signals.

**Target User:** Evaluating shoppers.

**Entry Points:** Product card click (Shop, Home, Search, Category), direct URL, related product click.

**Navigation Flow:** Breadcrumb → Gallery (left) + Info (right) → Care tabs → Delivery info → Return policy summary → Reviews section → Customers also bought → Recently viewed.

**Required Components:** Breadcrumb (JSON-LD), ProductGallery (thumbnail rail + main image + zoom), VariantSelector, QuantitySelector (1–10), StockStatus, Price (with discount %), Rating (display + count), CareSpecs (sunlight/water/difficulty/pet-safe icons), Tabs (Description / Care / Delivery / Returns), AddToCartButton, BuyNowButton, WishlistButton, ShareButton (WhatsApp, copy link), NotifyMeButton (out of stock), RatingHistogram, ReviewFilter, ReviewCard, ReviewForm, ReviewList, SimilarProductsCarousel, RecentlyViewed, DeliveryInfo (pincode-based estimate), TrustBadges, Toast.

**Required Sections:**
1. Breadcrumb + category
2. Gallery (left, sticky on desktop)
3. Product info (right): name, price, rating, stock, variant, quantity, CTAs, share, wishlist
4. Care specs quick-glance row (sun/water/difficulty/pet-safe icons)
5. Tabs: Description (rich text) | Care Instructions | Delivery & Returns | FAQs
6. Delivery info (pincode check inline)
7. Reviews summary (rating histogram + filter + list + write review CTA)
8. Customers also bought (related products carousel)
9. Recently viewed (if logged in)

**Required Buttons:** Add to Cart, Buy Now, Add to Wishlist, Share (WhatsApp + Copy Link), Notify Me, "Write a Review", review filter buttons, quantity +/-, variant select, tab switches.

**Required Forms:** Review form (RHF + Zod: rating 1–5 required, title optional, body min 10 chars, image upload max 5 × 5MB), Pincode check input.

**Required Modals:** Review submission modal (or inline form section), Share modal (or popover), Image zoom lightbox.

**Required Drawers:** CartDrawer (on Add to Cart).

**Required Tables:** None.

**Required Empty States:** No reviews yet ("Be the first to review"), Recently viewed empty (hidden).

**Required Loading States:** Gallery skeleton, review list skeleton, related products skeleton, pincode check spinner.

**Required Error States:** Product not found (404), reviews load error, pincode check error, review submit error.

**Product info displayed (PRD §8.5):**
- FR-PDP-001: Image gallery with thumbnail + full view + zoom
- FR-PDP-002: Name, price (original + discounted), discount %
- FR-PDP-003: Stock status (In Stock / Only X left / Out of Stock)
- FR-PDP-004: Variant selector (size, pot type)
- FR-PDP-005: Quantity selector (1 to stock, max 10)
- FR-PDP-006: Add to Cart + Buy Now
- FR-PDP-007: Add to Wishlist
- FR-PDP-008: Description (rich text, expandable)
- FR-PDP-009: Care info tab (sunlight, water, difficulty, pet-safe)
- FR-PDP-010: Delivery info (pincode-based estimate)
- FR-PDP-011: Return policy summary
- FR-PDP-012: Reviews (summary, individual, filter by stars)
- FR-PDP-013: Customers also bought (related — same category)
- FR-PDP-014: Share (WhatsApp, copy link)
- FR-PDP-015: Notify Me (out of stock)
- FR-PDP-016: Recently viewed

**Responsive Behaviour:** Desktop: 2-col (gallery left sticky | info right). Tablet: 2-col (gallery smaller). Mobile: stacked (gallery → info → tabs → reviews → related). Gallery: horizontal thumbnail scroll on mobile, vertical rail on desktop.

**SEO Requirements:** SSR/SSG (FR-SEO-001); unique title/meta per product (from `products.seo_title`); JSON-LD Product schema (name, image, price, availability, rating, reviews); JSON-LD BreadcrumbList; JSON-LD Review/AggregateRating; canonical; OG image; image alt tags; 301 redirect for deleted products (FR-SEO-010).

**Accessibility:** Gallery keyboard-navigable (arrow keys for thumbnails), zoom on focus, all CTAs labelled, review form fields labelled, rating input aria-label, tabs use tablist/tab/tabpanel pattern.

**Animations:** Gallery image crossfade on thumbnail select, zoom on hover (desktop) / pinch (mobile), tab content fade, reviews load staggered, related carousel snap.

**Micro Interactions:** Quantity +/- with bounds, variant select highlight, wishlist heart fill, add-to-cart bounce + drawer slide, share link copy toast, rating stars hover preview.

**Future Integrations:** AR plant preview (BRD §17), AI care recommendations, bundle suggestions.

**Dependencies:** Phase 7 (ProductCard, ProductGrid for related), Phase 5 (wishlist, review requires auth + verified purchase), React Query for `/api/products/[slug]`, `/api/products/[slug]/reviews`, `/api/products/[slug]/similar`.

**Completion Checklist:** SSR renders product; gallery zoom works; variant + quantity + add-to-cart + buy-now functional; pincode check shows delivery estimate; reviews load + filter + submit (verified purchaser only); related products carousel; recently viewed persists; share works; notify-me works for OOS; all SEO JSON-LD present; Lighthouse > 90; bilingual.

---

## PHASE 9 — CART & DRAWER

### Page: Cart (`/cart`)

**Purpose:** Detailed shopping cart overview with product list, quantity adjusters, and checkout summary (directory map §2, PRD §10.1).

**Business Goal:** Maximize checkout progression; surface free-shipping progress; apply coupons; resolve stock issues before checkout.

**Target User:** Authenticated customers with items in cart.

**Entry Points:** Header cart icon, CartDrawer "View Cart" link, checkout "Edit cart" link, mobile bottom nav.

**Navigation Flow:** Breadcrumb → Title + item count → Cart items list (left) + Order summary (right) → Free-shipping progress bar → Coupon input → "Proceed to Checkout".

**Required Components:** Breadcrumb, CartItemRow (image, name, variant, price, quantity selector, line total, remove), OrderSummary (subtotal, shipping, discount, tax, grand total), FreeShippingProgressBar, CouponInput + ApplyButton, AppliedCouponChip (removable), ProceedToCheckoutButton, ContinueShoppingLink, EmptyCartState, StockWarningAlert, CartSkeleton, Toast.

**Required Sections:**
1. Breadcrumb + title + item count
2. Cart items list (left main): each item row with image, name, variant, unit price, quantity selector, line total, remove button
3. Order summary (right sidebar, sticky): subtotal, shipping (calculated), discount (if coupon), tax (GST 18% included), grand total, coupon input, "Proceed to Checkout" CTA, trust badges, payment method icons
4. Free-shipping progress: "Add ₹X more for free shipping!" with progress bar (FR-CART-012)
5. Out-of-stock flagging (FR-CART-009)

**Required Buttons:** Quantity +/- (per item), Remove item, "Proceed to Checkout", "Continue Shopping", Apply Coupon, Remove Coupon, "Clear Cart".

**Required Forms:** Coupon code input (apply/remove).

**Required Modals:** None.

**Required Drawers:** None (this IS the cart page; drawer is separate in shell).

**Required Tables:** None.

**Required Empty States:** Empty cart — friendly illustration + "Your cart is empty" + "Shop Plants" CTA + "Browse Services" CTA + popular products carousel.

**Required Loading States:** CartItemRowSkeleton ×N, summary skeleton.

**Required Error States:** Stock validation error (item now OOS — highlighted, user can remove or save for later), coupon invalid (CART_004/005/006), sync error toast.

**Cart rules enforced (PRD §10.1):**
- FR-CART-001: Cart persists across sessions (DB-backed via Firestore + Prisma)
- FR-CART-003: Real-time stock validation on add
- FR-CART-004: Max 10 units per product
- FR-CART-005: Max 20 unique items
- FR-CART-006: Cart shows image, name, variant, price, quantity, line total
- FR-CART-007: Cart shows subtotal, shipping, discount, tax, GRAND TOTAL
- FR-CART-008: Stock re-validate before checkout
- FR-CART-009: OOS items flagged (highlighted, not blocking)
- FR-CART-011: Coupon code field
- FR-CART-012: Free-shipping threshold message (₹499)

**Responsive Behaviour:** Desktop: 2-col (items left 2/3 | summary right 1/3 sticky). Tablet: 2-col narrower. Mobile: stacked (items → summary → sticky bottom "Proceed to Checkout" bar).

**SEO:** noindex (cart is user-specific).

**Accessibility:** Quantity selectors labelled, remove buttons aria-label, coupon input labelled, summary semantic list, sticky CTA keyboard-reachable.

**Animations:** Item remove slide-out, quantity change line-total animate, free-shipping bar grow on add, coupon apply success toast.

**Micro Interactions:** Quantity +/- bounds (1–10), remove with undo toast (5s), coupon apply spinner, free-shipping progress confetti on threshold reached.

**Future Integrations:** Save for later, gift wrap option, delivery slot selection at cart.

**Dependencies:** Phase 8 (product context), CartContext, React Query, `/api/cart` sync, coupon validation endpoint.

**Completion Checklist:** Cart loads from context/Firestore; quantity adjust works; remove works; coupon apply/remove works; free-shipping progress accurate; OOS items flagged; stock re-validates; empty state shows; mobile sticky CTA; bilingual; accessible.

> **CartDrawer** (slide-out, in shell) is built in Phase 3 but finalized here with full cart item rendering, quantity controls, free-shipping progress, and "View Cart" / "Checkout" CTAs. It mirrors CartContext state.

---

## PHASE 10 — CHECKOUT & ORDERS

### Page: Checkout (`/checkout`)

**Purpose:** Multi-step checkout: address selection → order review → payment → confirmation redirect (directory map §2, PRD §10.2).

**Business Goal:** Convert cart to paid order with minimum friction; validate delivery availability; capture payment via Razorpay or COD.

**Target User:** Authenticated customers with cart items.

**Entry Points:** Cart "Proceed to Checkout", CartDrawer "Checkout", Buy Now from PDP.

**Navigation Flow:** Step indicator (Address → Review → Payment) → Address selection (saved or add new) → Pincode validation → Order review (items + totals) → Payment method selection → Razorpay modal or COD confirmation → Place Order → redirect to confirmation.

**Required Components:** CheckoutStepper (3 steps), AddressSelector (radio list of saved addresses), AddressForm (modal: RHF + Zod), AddNewAddressButton, PincodeValidator (inline check with delivery estimate + charge), OrderReviewTable (items, qty, price, totals), PriceBreakdown (subtotal, shipping, discount, tax, grand total), PaymentMethodSelector (Razorpay / COD), CODConfirmationNotice, PlaceOrderButton, SpecialInstructionsInput, RazorpayCheckoutButton (opens Razorpay modal), CheckoutSkeleton, Toast, Alert.

**Required Sections:**
1. Stepper (Address → Review → Payment)
2. Address section: saved address radio cards + "Add New Address" + pincode validation result + delivery estimate + charge + COD availability indicator
3. Order review section: itemized list, price breakdown, special instructions field
4. Payment section: Razorpay (UPI/Card/NetBanking/Wallet) radio + COD radio (with COD limit notice ≤ ₹5000) + terms checkbox + Place Order CTA
5. Order summary sticky sidebar (subtotal, shipping, discount, tax, total)

**Required Buttons:** Add New Address, Edit Address, Set Default Address, Place Order (Razorpay), Place Order (COD), Back to Cart, Step navigation.

**Required Forms:** AddressForm (RHF + Zod: fullName, phone, addressLine1, addressLine2, landmark, city, state, pincode, lat/lng via map pin), SpecialInstructionsInput (optional textarea).

**Required Modals:** Add/Edit Address modal (with Google Maps pin picker).

**Required Drawers:** None.

**Required Tables:** Order review itemized table.

**Required Empty States:** No saved addresses (prompt to add new), cart empty (redirect to shop).

**Required Loading States:** Pincode check spinner, place order spinner, Razorpay modal loading.

**Required Error States:** Pincode not serviceable (ORDER_001 — "Not deliverable to your area" + suggested pincodes), payment verification failed (ORDER_002), stock changed since cart add (re-validate, prompt update), COD not available for pincode/amount.

**Checkout flow (PRD §10.2):**
- STEP 1 — Address Selection: select saved or add new; pincode validation; delivery charge + estimate shown (FR-CHECKOUT-001 to 004)
- STEP 2 — Order Review: items + price breakdown + edit option + special instructions (FR-CHECKOUT-010 to 013)
- STEP 3 — Payment: Razorpay modal (no redirect, FR-CHECKOUT-023) OR COD confirmation; final stock check before capture (FR-CHECKOUT-024); payment fail = no order created (FR-CHECKOUT-025)
- STEP 4 — Order Confirmation: redirect to `/order-confirmation/[orderId]` (handled in next page)

**Responsive Behaviour:** Desktop: 2-col (steps left 2/3 | summary right 1/3 sticky). Mobile: stacked with sticky bottom "Place Order" bar; stepper becomes top progress.

**SEO:** noindex (user-specific).

**Accessibility:** Address radio cards keyboard-selectable, form fields labelled, stepper aria-current, payment method radio group, place order button disabled until valid + terms accepted, Razorpay modal keyboard-accessible.

**Animations:** Step transitions slide, pincode check spinner, address add modal slide-in, place order success → redirect with fade.

**Micro Interactions:** Address selection highlight, pincode check inline result, payment method selection card, terms checkbox enables CTA, Razorpay modal opens with overlay fade.

**Future Integrations:** Saved payment methods, UPI intent flow, gift cards, delivery slot picker (FR-DEL-007).

**Dependencies:** Phase 9 (cart), Phase 5 (auth), AddressContext, `/api/orders`, `/api/payments/create-order`, `/api/payments/verify`, Razorpay SDK.

**Completion Checklist:** Address selection works; pincode validates; delivery charge + estimate shows; COD availability per pincode + amount; order review accurate; Razorpay modal opens + payment verifies; COD order created with pending payment; stock re-validates; on success redirects to confirmation with order number; failures handled; bilingual; accessible.

### Page: Order Confirmation (`/order-confirmation/[orderId]`)

**Purpose:** Confirmed order details layout with receipt download and status timeline (directory map §2, PRD FR-CHECKOUT-030).

**Business Goal:** Reassure customer order is placed; provide next steps; encourage review after delivery.

**Target User:** Customers who just placed an order.

**Entry Points:** Checkout success redirect, order email link, order history link.

**Navigation Flow:** Success header (order number + thank you) → Order items + totals → Delivery address + estimate → Status timeline → Actions (Download invoice, View order, Continue shopping) → Recommended products.

**Required Components:** SuccessHeader (order number, date, thank you message), OrderItemsList, PriceBreakdown, DeliveryAddressCard, OrderTimeline (Pending → Confirmed → Processing → Out for Delivery → Delivered), DownloadInvoiceButton, ViewOrderButton, ContinueShoppingButton, RecommendedProductsCarousel, Toast, ConfettiAnimation (subtle, reduced-motion safe).

**Required Sections:** Success header, order summary (items + totals), delivery info, timeline, action buttons, recommendations.

**Required Buttons:** Download Invoice (PDF), View Order (→ order detail), Continue Shopping, Track Order (if dispatched), "Write a review" (after delivery).

**Required Forms:** None.

**Required Modals:** None.

**Required Drawers:** None.

**Required Tables:** Order items table.

**Required Empty States:** Order not found (404 friendly).

**Required Loading States:** Invoice download spinner, page skeleton.

**Required Error States:** Order not found, invoice download failed.

**Responsive Behaviour:** Centered max-width 800px; stacked sections; timeline horizontal desktop / vertical mobile.

**SEO:** noindex (user-specific).

**Accessibility:** Timeline semantic, buttons labelled, invoice download announces.

**Animations:** Success checkmark pop, subtle confetti (reduced-motion disabled), timeline node pulse for current status.

**Micro Interactions:** Download invoice button spinner, "Copy order number" toast.

**Future Integrations:** Live tracking map (when courier integration added), delivery person call button.

**Dependencies:** Phase 10 (checkout), OrdersContext (real-time update), `/api/orders/[id]`, `/api/orders/[id]/invoice`.

**Completion Checklist:** Order renders with correct items + totals + address; timeline shows current status; invoice downloads; real-time update if status changes; recommendations carousel; bilingual; accessible.

### Page: Order History (`/account/orders`)

**Purpose:** Historical orders list with invoice downloads and search/filter (PRD §11.2 FR-ORD-020).

**Business Goal:** Easy access to past orders for re-order, invoice retrieval, return initiation, review submission.

**Target User:** Authenticated customers.

**Entry Points:** Account sidebar "Orders", post-checkup redirect, mobile drawer nav.

**Navigation Flow:** Title + search + filter → Orders list (cards) → Click order → Order detail.

**Required Components:** AccountSidebar, AccountHeader, SearchInput (order number/product name), FilterDropdown (status, date range), OrderCard (order number, date, status badge, item thumbnails, total, actions), Pagination, EmptyState (no orders), OrderCardSkeleton.

**Required Sections:** Header with search + filter, orders list, pagination.

**Required Buttons:** Search, filter apply, "View Order" (per card), "Reorder", "Download Invoice", "Track Order" (if in transit), "Buy Again".

**Required Forms:** Search input.

**Required Modals:** None.

**Required Drawers:** Filter drawer (mobile).

**Required Tables:** None (card list).

**Required Empty States:** No orders — "You haven't placed any orders yet" + "Shop Plants" CTA.

**Required Loading States:** OrderCardSkeleton ×5.

**Required Error States:** Load error with retry.

**Responsive Behaviour:** Card list 1-col mobile / 2-col desktop; filter as dropdown desktop / bottom sheet mobile.

**SEO:** noindex (auth area).

**Accessibility:** Search input labelled, filter operable, cards semantic article, status badges aria-label.

**Animations:** Card fade-in staggered, filter change re-flow.

**Micro Interactions:** Card hover lift, "Reorder" adds items to cart with toast.

**Dependencies:** Phase 12 (account layout), OrdersContext, React Query.

**Completion Checklist:** Orders load; search works; filter works; pagination; reorder; invoice download; empty state; bilingual; accessible.

### Page: Order Detail (`/account/orders/[id]`)

**Purpose:** Detailed view of a single order: items, status, delivery info, actions (PRD §11.2 FR-ORD-021).

**Business Goal:** Self-service order tracking; enable returns/reviews/invoice retrieval.

**Required Components:** AccountSidebar, Breadcrumb, OrderHeader (number, date, status), OrderTimeline, OrderItemsList (with per-item actions: review, return, reorder), DeliveryAddressCard, DeliveryPersonCard (if dispatched), PriceBreakdown, InvoiceDownload, CancelOrderButton (only if pending/confirmed), ReturnRequestButton (within policy window), WriteReviewButton (post-delivery, 30-day window), ChatSupportLink.

**Required Sections:** Header, timeline, items, delivery info, price breakdown, actions.

**Required Buttons:** Cancel Order, Request Return, Write Review, Download Invoice, Reorder Items, Contact Support, Track Order.

**Required Forms:** Cancel reason form (modal: reason required, FR-ORD-023).

**Required Modals:** Cancel Order modal (reason textarea), Return Request modal (reason select + description + photo upload for plants).

**Required Empty States:** Order not found.

**Required Loading States:** Page skeleton.

**Required Error States:** Not found, cancel failed, return failed.

**Responsive Behaviour:** Stacked sections; timeline horizontal desktop / vertical mobile.

**SEO:** noindex.

**Accessibility:** Timeline semantic, modal focus trap, forms labelled.

**Dependencies:** Phase 12 (account layout), OrdersContext, `/api/orders/[id]`, return + review endpoints.

**Completion Checklist:** Order renders; timeline accurate; cancel works (pending/confirmed only); return request works (within window); review works (post-delivery, 30-day); invoice downloads; bilingual; accessible.

---

## PHASE 11 — SERVICE MARKETPLACE

### Page: Services Listing (`/services`)

**Purpose:** Catalog of gardening services with descriptions, pricing, and booking action (directory map §2, PRD §12.1).

**Business Goal:** Drive service bookings; communicate service variety; filter by city (Sonipat default).

**Target User:** Customers seeking gardening help.

**Entry Points:** Header "Services", home services highlight, mobile bottom nav, footer.

**Navigation Flow:** Breadcrumb → Title + count → Filters (category, price, rating, city) → Service cards grid → "Book Now" → Booking scheduler modal.

**Required Components:** Breadcrumb, ServiceFilterSidebar (category, price range, rating, city), SortDropdown, ServiceCard (image, name, short description, price or "Get Quote", rating, "Book Now" button), ServiceGrid, Pagination, EmptyState, MobileFilterSheet, ServiceCardSkeleton.

**Required Sections:** Header with filters + sort, services grid, pagination.

**Required Buttons:** Filter apply/clear, sort options, "Book Now" (per card), "Get Quote" (quote-based services), "View Details" (per card).

**Required Forms:** Filter form (URL-encoded).

**Required Modals:** None (booking is separate flow).

**Required Drawers:** MobileFilterSheet.

**Required Tables:** None.

**Required Empty States:** No services in city — "No services available in {city} yet" + notify-when-available signup.

**Required Loading States:** ServiceCardSkeleton ×6.

**Required Error States:** Load error retry.

**Service cards show (PRD §12.1):** image, name, price (or "Get Quote" for quote_based), rating, "Book Now" button, category badge, city availability badge.

**Filters (PRD §12.1, §18.2):** category, min_price, max_price, min_rating, city.

**Sort:** Featured, Price Low→High, Price High→Low, Best Rated.

**Responsive Behaviour:** Grid 1-col mobile / 2-col tablet / 3-col desktop; filters sidebar desktop / bottom sheet mobile.

**SEO:** Indexable; unique title; JSON-LD ItemList of services; canonical; breadcrumb JSON-LD.

**Accessibility:** Filters operable, cards semantic, "Book Now" labelled.

**Animations:** Card fade-in staggered, hover lift, filter re-flow.

**Micro Interactions:** Card hover image zoom, "Book Now" button highlight.

**Dependencies:** Phase 3 (shell), React Query, `/api/services`.

**Completion Checklist:** Services load; filters work; sort works; city filter (Sonipat default); quote-based shows "Get Quote"; booking scheduler opens; bilingual; accessible.

### Page: Service Detail (`/services/[slug]` or modal)

**Purpose:** Full service description, what's included/excluded, gallery, pricing, slots, providers, reviews (PRD §12.2).

**Business Goal:** Answer all pre-booking questions; convert to booking.

**Required Components:** Breadcrumb, ServiceGallery, ServiceHeader (name, category, rating, price), WhatIsIncludedList, WhatIsExcludedList, PricingDetails (fixed/hourly/quote), TimeSlotAvailability, AvailableProvidersList (with ProviderCard), ReviewSection (rating histogram + reviews), FAQ (service-specific), BookNowCTA (sticky), TrustBadges, ShareButton.

**Required Sections:** Gallery, header, description, included/excluded, pricing, providers, reviews, FAQ, sticky CTA.

**Required Buttons:** Book Now (sticky), "View Provider" (per provider), "Get Quote" (quote-based), Share.

**Required Forms:** None (booking handled in scheduler).

**Required Modals:** BookingSchedulerModal (opens on Book Now).

**Required Drawers:** None.

**Required Empty States:** No providers available, no reviews yet.

**Required Loading States:** Section skeletons.

**Required Error States:** Service not found, load error.

**Responsive Behaviour:** 2-col desktop (gallery+info left | booking sidebar right sticky); stacked mobile with sticky bottom "Book Now".

**SEO:** Indexable; JSON-LD Service schema; canonical.

**Dependencies:** Phase 11 (ServiceCard), ProviderCard, `/api/services/[slug]`, `/api/services/[id]/providers`.

**Completion Checklist:** Service renders; gallery works; included/excluded clear; pricing transparent; providers listed with ratings; reviews load; FAQ; booking modal opens; bilingual; accessible.

### Page: Providers Directory (`/providers`)

**Purpose:** Registry of verified local gardeners (directory map §2, PRD §12.3).

**Business Goal:** Allow customers to browse and select specific providers.

**Required Components:** Breadcrumb, ProviderFilterSidebar (specialization, rating, city), ProviderCard (photo, name, rating, specializations, verification badge, "Book This Provider"), ProviderGrid, Pagination, EmptyState.

**Required Sections:** Header with filters, providers grid.

**Required Buttons:** Filter, "Book This Provider" (per card), "View Profile".

**Required Forms:** Filter form.

**Required Modals:** None (booking from provider profile).

**Required Drawers:** Mobile filter sheet.

**Responsive Behaviour:** Grid 1-col mobile / 2-col tablet / 3-col desktop.

**SEO:** Indexable; JSON-LD ItemList; canonical.

**Dependencies:** Phase 11, `/api/services/providers`.

**Completion Checklist:** Providers load; filters work; verification badges; "Book This Provider" opens booking with provider pre-selected; bilingual; accessible.

### Page: Provider Profile (modal or `/providers/[id]`)

**Purpose:** Public provider profile: name, photo, bio, specializations, rating, services offered, reviews (PRD §12.3 FR-PROV-001 to 005).

**Required Components:** ProviderHeader (photo, name, verification badge, rating, experience years), BioSection, SpecializationsList, ServicesOfferedList (with prices), ReviewsSection, BookThisProviderCTA.

**Required Buttons:** Book This Provider, "View Service" (per service offered).

**Responsive Behaviour:** 2-col desktop (info left | booking sticky right); stacked mobile.

**SEO:** Indexable; JSON-LD Person/ProfessionalService; canonical.

**Completion Checklist:** Profile renders; services listed with prices; reviews load; book CTA pre-fills provider in scheduler; bilingual; accessible.

### Page: Booking Scheduler (modal, opens from Service Detail / Provider Profile)

**Purpose:** Multi-step booking: service + provider → location + schedule → summary → payment (PRD §13.1).

**Business Goal:** Capture booking with minimum friction; validate slot availability; capture advance payment if required.

**Required Components:** BookingStepper (Service → Schedule → Summary → Payment), ServiceSummaryCard, ProviderSelector (optional), AddressSelector + AddressForm + MapPinPicker, Calendar (date picker, min 1 day advance), TimeSlotPicker (9–11AM, 11AM–1PM, 2–4PM, 4–6PM — unavailable slots disabled), NotesTextarea, PriceBreakdown (advance vs total), PaymentMethodSelector, ConfirmBookingButton, Toast.

**Required Sections:** Stepper, service+provider, location+schedule, summary, payment.

**Required Buttons:** Step navigation, Confirm Booking, Add New Address, Set Default.

**Required Forms:** AddressForm (if new), NotesForm.

**Required Modals:** This IS a modal (or full-screen on mobile).

**Booking flow (PRD §13.1):**
- STEP 1 — Service Selection (pre-filled if from service detail)
- STEP 2 — Location & Schedule: address + map pin (lat/lng captured), date (min 1 day advance), time slot (4 slots, unavailable if provider booked)
- STEP 3 — Summary: service, provider, date, time, location, price breakdown (advance vs total), notes
- STEP 4 — Payment: advance via Razorpay (if required) or COD (per service setting)
- STEP 5 — Confirmation: redirect to booking confirmation

**Responsive Behaviour:** Modal centered desktop / full-screen mobile; stepper top.

**SEO:** noindex (modal).

**Accessibility:** Stepper aria-current, calendar keyboard-navigable, slot picker radio group, forms labelled, focus trap.

**Animations:** Step transitions slide, slot select highlight, map pin drop.

**Micro Interactions:** Calendar date hover, slot availability visual, advance vs total toggle.

**Dependencies:** Phase 11, AddressContext, Google Maps, `/api/bookings`, `/api/payments`.

**Completion Checklist:** Service pre-fills; provider selection optional; address picker works with map; calendar enforces min 1 day; slots show availability; notes captured; advance payment works; COD option per service; booking created + redirect; bilingual; accessible.

### Page: Booking Confirmation (`/bookings/[id]/confirmation` or modal)

**Purpose:** Booking confirmation screen with booking number, details, next steps (PRD §13.1 FR-BOOK-040).

**Required Components:** SuccessHeader (booking number GB-prefix), BookingSummaryCard (service, provider, date, time, location, price), NextStepsList (provider will confirm, SMS/email sent), AddToCalendarButton, ViewBookingButton, ContinueBrowsingButton.

**Required Sections:** Success header, booking summary, next steps, actions.

**Required Buttons:** View Booking, Add to Calendar, Continue Browsing, Contact Provider (after confirmation).

**Responsive Behaviour:** Centered max-width 600px.

**SEO:** noindex.

**Completion Checklist:** Booking renders; number displayed; next steps clear; add-to-calendar works; bilingual; accessible.

### Page: Booking History (`/account/bookings`)

**Purpose:** View all bookings with status (PRD §13.2 FR-BOOK-050).

**Required Components:** AccountSidebar, FilterDropdown (status, date), BookingCard (booking number, service, provider, date, time, status badge, actions), Pagination, EmptyState.

**Required Sections:** Header with filter, bookings list.

**Required Buttons:** View Booking, Cancel (if pending/confirmed), Reschedule (if pending/confirmed), Write Review (after completion).

**Required Empty States:** No bookings — "You haven't booked any services yet" + "Browse Services" CTA.

**Responsive Behaviour:** Card list 1-col mobile / 2-col desktop.

**SEO:** noindex.

**Dependencies:** Phase 12 (account layout), `/api/bookings`.

**Completion Checklist:** Bookings load; filter works; cancel/reschedule per status rules; review post-completion; bilingual; accessible.

### Page: Booking Detail (`/account/bookings/[id]`)

**Purpose:** Booking detail: service, provider, date, time, location, status (PRD §13.2 FR-BOOK-051).

**Required Components:** AccountSidebar, Breadcrumb, BookingHeader (number, status badge), BookingTimeline (pending → confirmed → in_progress → completed), ServiceInfoCard, ProviderInfoCard (phone shown after confirmation), DateTimeCard, LocationCard (with map), PriceBreakdown, NotesDisplay, ActionButtons (Cancel, Reschedule, Write Review, Contact Provider, Raise Dispute).

**Required Buttons:** Cancel Booking (pending/confirmed only), Reschedule, Write Review (post-completion, 30-day), Contact Provider (after confirmation), Raise Dispute, Download Receipt.

**Required Forms:** Cancel reason form (modal), Reschedule form (modal: new date + slot).

**Required Modals:** Cancel modal, Reschedule modal, Dispute form modal.

**Cancellation rules (PRD §13.2):**
- FR-BOOK-052: Cancel only if pending or confirmed
- FR-BOOK-053: >24h before: full refund
- FR-BOOK-054: <24h before: partial/no refund per policy
- FR-BOOK-055: Reschedule if pending or confirmed

**Responsive Behaviour:** Stacked sections; timeline horizontal desktop / vertical mobile.

**SEO:** noindex.

**Completion Checklist:** Booking renders; timeline accurate; cancel per rules; reschedule works; review post-completion; dispute form; provider contact after confirmation; bilingual; accessible.

### Page: Become a Provider (`/become-provider`)

**Purpose:** Multi-step onboarding application form for local gardeners (directory map §2, PRD §20).

**Business Goal:** Recruit verified service providers; collect KYC (Aadhar/PAN), experience, service radius.

**Target User:** Aspiring service providers.

**Entry Points:** Footer "Become a Provider", home CTA, provider login redirect.

**Navigation Flow:** Multi-step wizard: Personal Info → Business Details → Experience & Specializations → Service Area → Document Upload (Aadhar, PAN) → Review → Submit → Success page.

**Required Components:** WizardStepper (6 steps), PersonalInfoForm, BusinessDetailsForm, ExperienceForm (years + specializations multi-select), ServiceAreaForm (city + radius + map), DocumentUploader (Aadhar + PAN file upload with preview), ReviewScreen, SubmitButton, SuccessPage, Toast.

**Required Sections:** Stepper, current step form, navigation buttons.

**Required Buttons:** Next, Back, Save Draft, Submit, "Upload Document".

**Required Forms:** 6 step forms with RHF + Zod validation per step.

**Required Modals:** None (multi-step replaces modals).

**Required Drawers:** None.

**Document upload:** Aadhar (front + back), PAN card; max 5MB each; image/PDF; preview before submit.

**Responsive Behaviour:** Stepper top, form centered max-width 600px; mobile-friendly inputs.

**SEO:** Indexable (recruitment page); unique title; canonical.

**Accessibility:** Stepper aria-current, forms labelled, file upload accessible, keyboard nav.

**Animations:** Step transitions slide, file upload progress, success checkmark.

**Micro Interactions:** Step validation before next, draft auto-save, file upload preview.

**Dependencies:** Phase 5 (auth — must be logged in to apply), FileUpload component, `/api/providers/apply`.

**Completion Checklist:** All 6 steps validate; file upload works with preview; draft auto-saves; submit creates provider application (status: pending); success page shows next steps; bilingual; accessible.

---

## PHASE 12 — CUSTOMER DASHBOARD

### Page: Account Layout (`/account/layout.tsx`)

**Purpose:** Side panel menu framework for all account pages (directory map §2).

**Required Components:** AccountSidebar (Dashboard, Orders, Bookings, Wishlist, Addresses, Profile, Settings, Security), AccountHeader (page title + breadcrumb), UserCard (avatar, name, email in sidebar), LogoutButton.

**Responsive Behaviour:** Sidebar fixed left desktop (240px); hidden on mobile, opens as Drawer via header menu button.

**Auth Guard:** Redirect to `/login` if not authenticated; redirect to `/provider` if role=provider; redirect to `/admin` if role=admin.

**Completion Checklist:** Sidebar renders all items; active state highlights; mobile drawer works; auth guard works; bilingual; accessible.

### Page: Account Dashboard (`/account/dashboard`)

**Purpose:** Snapshot of active orders, latest reviews, profile summary, recent bookings (directory map §2).

**Required Components:** AccountSidebar, WelcomeHeader (name + member since), StatsGrid (total orders, active orders, total bookings, wishlist count), ActiveOrdersList (last 3), RecentBookingsList (last 3), RecentReviewsList, QuickActions (Edit Profile, Add Address, Browse Wishlist), RecommendedProducts.

**Required Sections:** Welcome, stats, active orders, recent bookings, recent reviews, quick actions, recommendations.

**Responsive Behaviour:** Stats 2-col mobile / 4-col desktop; lists stack.

**SEO:** noindex.

**Completion Checklist:** Stats accurate; lists load; quick actions work; recommendations; bilingual; accessible.

### Page: Profile (`/account/profile`)

**Purpose:** Form for updating contact and profile details (directory map §2).

**Required Components:** AccountSidebar, ProfileForm (RHF + Zod: firstName, lastName, email, phone, gender, dateOfBirth, preferredLanguage), AvatarUploader (Firebase Storage), SaveButton, Toast.

**Required Forms:** ProfileForm with validation.

**Required Modals:** Avatar crop modal (optional).

**Responsive Behaviour:** Form max-width 600px.

**Completion Checklist:** Profile loads; avatar uploads; form validates; save updates PostgreSQL + Firestore; bilingual; accessible.

### Page: Addresses (`/account/addresses`)

**Purpose:** Location management workspace (directory map §2).

**Required Components:** AccountSidebar, AddressGrid (AddressCard per saved address), AddNewAddressButton, AddressForm (modal), SetDefaultButton, EditButton, DeleteButton, MapPinPicker, EmptyState.

**Required Sections:** Header with "Add New", address grid.

**Required Buttons:** Add New, Edit, Delete, Set Default.

**Required Forms:** AddressForm (RHF + Zod + Google Maps).

**Required Modals:** Add/Edit Address modal.

**Required Empty States:** No addresses — "Add your first address" CTA.

**Responsive Behaviour:** Grid 1-col mobile / 2-col desktop.

**Completion Checklist:** Addresses load from context; add/edit/delete works; set default works; map pin captures lat/lng; bilingual; accessible.

### Page: Wishlist (`/account/wishlist`)

**Purpose:** Grid list of favorited products (directory map §2).

**Required Components:** AccountSidebar, WishlistGrid (ProductCard with remove button), MoveToCartButton, EmptyState, Pagination.

**Required Sections:** Header with count, wishlist grid.

**Required Buttons:** Remove from Wishlist, Move to Cart, "Shop Plants" (empty state).

**Required Empty States:** No wishlist items — "Your wishlist is empty" + Shop CTA.

**Responsive Behaviour:** Grid 2-col mobile / 3-col tablet / 4-col desktop.

**Completion Checklist:** Wishlist loads; remove works; move to cart works; empty state; bilingual; accessible.

### Page: Settings (`/account/settings`)

**Purpose:** Light/Dark mode toggles, notifications configurations, language selection (directory map §2).

**Required Components:** AccountSidebar, SettingsPanel (sections: Appearance, Notifications, Language, Marketing Consents), ThemeToggle (light/dark — Phase 1 ships light only, toggle disabled with "Coming soon"), NotificationToggles (email, sms, push per type), LanguageSelector (en/hi), MarketingConsentCheckboxes, SaveButton.

**Required Forms:** Settings form.

**Responsive Behaviour:** Stacked sections max-width 600px.

**Completion Checklist:** Settings load; toggles work (persist to Firestore preferences); language switch instant; dark mode toggle saved (future); bilingual; accessible.

### Page: Security (`/account/security`)

**Purpose:** Password reset tool, session management (directory map §2).

**Required Components:** AccountSidebar, ChangePasswordForm (current, new, confirm), PasswordStrengthMeter, ActiveSessionsList (device, OS, IP, last active), LogoutAllButton, TwoFactorToggle (future, disabled).

**Required Forms:** ChangePasswordForm (RHF + Zod).

**Required Modals:** Confirm logout all sessions.

**Responsive Behaviour:** Stacked sections max-width 600px.

**Completion Checklist:** Password change works (validates current); sessions list loads; logout all revokes tokens; bilingual; accessible.

### Page: My Reviews (`/account/reviews` or within orders)

**Purpose:** List of reviews submitted by user (PRD UI-026).

**Required Components:** AccountSidebar, ReviewCard list (with edit/delete within 7 days), Pagination, EmptyState.

**Required Empty States:** No reviews — "You haven't written any reviews yet" + link to orders.

**Completion Checklist:** Reviews load; edit within 7 days; delete works; empty state; bilingual; accessible.

### Page: Return Request (modal within Order Detail)

**Purpose:** Submit return request with reason, description, photos (PRD §21.2).

**Required Components:** ReturnRequestForm (reason select: damaged/wrong_item/quality_issue/other, description textarea, photo uploader — mandatory for plants), SubmitButton, PolicyNotice (24h plants / 7-day others).

**Required Modals:** This IS a modal opened from Order Detail.

**Completion Checklist:** Form validates; photos upload (mandatory for plants); window validated; submit creates return (status: requested); admin notified; bilingual; accessible.

---

## PHASE 13 — PROVIDER PORTAL

### Page: Provider Layout (`/provider/layout.tsx`)

**Purpose:** Provider portal shell with sidebar (PRD §20).

**Required Components:** ProviderSidebar (Dashboard, Bookings, Calendar, Profile, Earnings), ProviderHeader, ProviderCard (status: pending/approved/suspended).

**Auth Guard:** Redirect to `/login` if not auth; redirect to `/become-provider` if not yet approved; redirect to `/account` if role=customer.

**Completion Checklist:** Sidebar renders; auth + role guard works; bilingual; accessible.

### Page: Provider Dashboard (`/provider`)

**Purpose:** Summary: upcoming bookings, today's bookings, earnings (PRD §20.1).

**Required Components:** ProviderSidebar, StatsGrid (today's bookings, upcoming 7 days, this week earnings, this month earnings, pending payout), UpcomingBookingsList (next 7 days), TodaysBookingsList, EarningsChart (weekly/monthly), QuickActions.

**Completion Checklist:** Stats accurate; lists load; chart renders; bilingual; accessible.

### Page: Provider Bookings (`/provider/bookings`)

**Purpose:** View all assigned bookings, filter by date/status (PRD §20.2).

**Required Components:** ProviderSidebar, FilterDropdown (date, status), BookingCard list, BookingDetailModal, ActionButtons (Confirm, Start, Complete, No-Show), PhotoUploader (on complete).

**Booking management actions (PRD §20.2):**
- FR-PROV-023: Confirm (pending → confirmed)
- FR-PROV-024: Start (confirmed → in_progress)
- FR-PROV-025: Complete (in_progress → completed) + upload photos
- FR-PROV-026: No-show (customer absent)

**Completion Checklist:** Bookings load; filters work; actions per status; photo upload on complete; customer phone shown after confirmation; bilingual; accessible.

### Page: Provider Calendar (`/provider/calendar`)

**Purpose:** Calendar view of bookings (PRD §20.2 FR-PROV-027).

**Required Components:** ProviderSidebar, CalendarGrid (month view), BookingChip per day, DayDetailPanel, WeekViewToggle, NavigationButtons.

**Completion Checklist:** Calendar renders; bookings appear as chips; day detail shows; navigation works; bilingual; accessible.

### Page: Provider Profile (`/provider/profile`)

**Purpose:** Edit bio, photo, specializations, experience, availability, bank details (PRD §20.3).

**Required Components:** ProviderSidebar, ProfileForm (bio, photo, specializations, experience), AvailabilityForm (hours per day, blocked dates), BankDetailsForm (account number, IFSC, UPI — encrypted), SaveButton.

**Completion Checklist:** Profile loads; edits save; availability set; bank details encrypted; bilingual; accessible.

### Page: Provider Earnings (`/provider/earnings`)

**Purpose:** Earnings breakdown per booking, commission deducted, payout history (PRD §20.4).

**Required Components:** ProviderSidebar, EarningsSummary (this week, this month, pending payout, lifetime), EarningsTable (per booking: date, service, amount, commission %, net), PayoutHistoryTable, RequestPayoutButton.

**Completion Checklist:** Earnings load; commission shown clearly; payout history; request payout triggers admin notification; bilingual; accessible.

---

## PHASE 14 — ADMIN PANEL

> The admin panel is **desktop-first**, separate workspace at `/admin/*`. Accessible only to role=admin. Phase 1 ships light mode. All tables support CSV export.

### Page: Admin Layout (`/admin/layout.tsx`)

**Required Components:** AdminSidebar (Dashboard, Orders, Bookings, Products, Inventory, Services, Providers, Customers, Returns, Coupons, Banners, Cities, Settings, Reports), AdminTopbar (search, notifications, profile, "View Store" link), AuthGuard (admin only).

**Responsive Behaviour:** Desktop-first; sidebar fixed; min-width 1024px recommended (mobile not supported — admin uses desktop).

**Completion Checklist:** Sidebar renders; auth guard works; topbar functional.

### Page: Admin Dashboard (`/admin`)

**Purpose:** Key metrics + recent activity (PRD §19.1).

**Required Components:** KpiCard grid (Total Orders Today/Week/Month, Revenue Today/Week/Month, Bookings Today, New Customers This Week, Pending Orders badge, Low Stock Products badge), RevenueChart (line, daily/weekly/monthly toggle), TopProductsChart, TopServicesChart, NewRegistrationsChart, RecentOrdersList (last 10), RecentBookingsList (last 10).

**Completion Checklist:** All KPIs accurate; charts render; lists load; toggles work; CSV export.

### Page: Admin Orders (`/admin/orders`)

**Purpose:** List all orders with filters, bulk actions (PRD §19.2).

**Required Components:** AdminDataTable (columns: Order#, Customer, Amount, Status, Payment, Date, Actions), FilterBar (status, payment status, date range, search by order/customer), BulkActions (confirm selected, export selected), ExportCSVButton.

**Completion Checklist:** Orders load; filters work; bulk actions; CSV export; pagination.

### Page: Admin Order Detail (`/admin/orders/[id]`)

**Purpose:** Full order detail with timeline + status updates (PRD §19.2).

**Required Components:** OrderHeader, OrderTimeline, OrderItemsTable, CustomerInfoCard, DeliveryAddressCard, DeliveryPersonForm (name + phone + tracking URL), InternalNotesInput, StatusUpdateButtons, PrintPackingSlipButton, ExportInvoiceButton.

**Status actions (PRD §19.2):** Confirm (pending → confirmed), Processing (packing), Out for Delivery (+ delivery person info), Delivered, Cancel (with reason, before dispatch only).

**Completion Checklist:** Order renders; status updates logged to history; delivery person added; internal notes; packing slip prints; invoice exports.

### Page: Admin Bookings (`/admin/bookings`)

**Purpose:** List all bookings, assign provider, override status (PRD §19.3).

**Required Components:** AdminDataTable (Booking#, Customer, Service, Provider, Date, Status, Actions), AssignProviderModal, OverrideStatusDropdown, CustomerLocationMap, DisputeResolutionForm, ProcessRefundButton.

**Completion Checklist:** Bookings load; provider assign; status override; map view; dispute handling; refund.

### Page: Admin Products (`/admin/products`)

**Purpose:** Product list with full CRUD (PRD §19.4).

**Required Components:** AdminDataTable (image, name, category, price, stock, status, actions), AddProductButton, ProductForm (all DB-006 fields), ImageGalleryManager (upload, reorder, set primary, delete — max 10 images), VariantManager, DuplicateButton, BulkActivateButton, CSVImportButton, CSVExportButton.

**Completion Checklist:** Products load; add/edit works; image gallery; variants; duplicate; bulk activate; CSV import/export.

### Page: Admin Inventory (`/admin/inventory`)

**Purpose:** Stock management (PRD §19.5).

**Required Components:** AdminDataTable (product, variant, current stock, reserved, sold, status), InlineStockEdit, RestockForm (quantity + notes), StockAdjustmentForm (positive/negative + reason), TransactionHistoryModal, LowStockFilter, BulkRestockCSV.

**Completion Checklist:** Inventory loads; inline edit; restock; adjustment with reason; transaction history; low stock filter; bulk restock.

### Page: Admin Services (`/admin/services`)

**Purpose:** Service CRUD (PRD §19.6).

**Required Components:** AdminDataTable, ServiceForm (name, description, category, pricing type, price, city availability, featured toggle), CityAvailabilityMultiSelect.

**Completion Checklist:** Services load; CRUD; city availability; featured toggle.

### Page: Admin Providers (`/admin/providers`)

**Purpose:** Provider management + application review (PRD §19.7).

**Required Components:** AdminDataTable (name, business, city, status, actions), ProviderApplicationDetailPanel (KYC docs view — Aadhar, PAN), ApproveButton, RejectButton (with reason), SuspendButton, BookingHistoryLink, ReviewsLink, CommissionOverrideInput, EarningsReportLink, MarkPayoutProcessedButton.

**Completion Checklist:** Providers load; application review; approve/reject/suspend; commission override; payout processing.

### Page: Admin Customers (`/admin/customers`)

**Purpose:** Customer management (PRD §19.8).

**Required Components:** AdminDataTable (name, phone, email, orders count, bookings count, status), CustomerDetailPanel (profile + order history + booking history + reviews), SuspendButton, ReactivateButton, ExportCSVButton.

**Completion Checklist:** Customers load; detail panel; suspend/reactivate; CSV export.

### Page: Admin Returns (`/admin/returns`)

**Purpose:** Return request management (PRD §19.9).

**Required Components:** AdminDataTable (return#, order#, customer, reason, status, actions), ReturnDetailPanel (evidence images), ApproveButton, RejectButton (with notes), ResolutionSelect (replacement/refund), InitiateRefundButton.

**Completion Checklist:** Returns load; evidence view; approve/reject; resolution select; refund initiate.

### Page: Admin Coupons (`/admin/coupons`)

**Purpose:** Coupon CRUD (PRD §19.10).

**Required Components:** AdminDataTable, CouponForm (code, discount type: percentage/flat, value, min order, validity dates, applicable_to: all/products/services), UsageStatsPanel, ActivateButton, DeactivateButton.

**Completion Checklist:** Coupons load; CRUD; usage stats; activate/deactivate.

### Page: Admin Banners (`/admin/banners`)

**Purpose:** Homepage banner management (PRD §19.11).

**Required Components:** BannerList (drag-reorder), BannerUploader (image, max 5 active), BannerForm (link target: category/product/URL, order, active toggle), PreviewPanel.

**Completion Checklist:** Banners load; upload; reorder; link target; max 5 enforced; preview.

### Page: Admin Cities & Pincodes (`/admin/cities`)

**Purpose:** City + pincode management (PRD §19.12).

**Required Components:** CityList, CityForm (name, state, active), PincodeList per city, PincodeForm (pincode, delivery charge, COD available toggle, min/max delivery days), ServiceableToggle.

**Completion Checklist:** Cities load; CRUD; pincodes per city; delivery charge; COD toggle; delivery days.

### Page: Admin Settings (`/admin/settings`)

**Purpose:** Global settings (PRD §19.13).

**Required Components:** SettingsForm (key-value from admin_settings), MaintenanceModeToggle, PaymentMethodsToggles (Razorpay/COD), NotificationTemplateEditor, ChangeAdminPasswordForm.

**Completion Checklist:** Settings load; maintenance mode; payment toggles; template editor; password change.

### Page: Admin Reports (`/admin/reports`)

**Purpose:** Analytics & reports (PRD §19.14).

**Required Components:** ReportTypeSelector (Revenue, Orders, Products, Customers, Bookings, Inventory), DateRangePicker, ReportChart, ReportTable, ExportCSVButton, ExportExcelButton.

**Reports (PRD §19.14):**
- Revenue report (daily/weekly/monthly/custom)
- Orders report (count by status, by city)
- Products report (top sellers, low performers)
- Customer report (new vs returning, city-wise)
- Bookings report (count by service, by provider)
- Inventory report (current levels, turnover)

**Completion Checklist:** All reports render; date range works; charts + tables; CSV/Excel export.

---

# PART G — PHASE GATING & APPROVAL WORKFLOW

## G.1 Strict Phase Order

```
Phase 1 (Foundation)
  └─→ Phase 2 (Design System)
        └─→ Phase 3 (Layout Shell)
              ├─→ Phase 4 (Homepage)
              ├─→ Phase 5 (Auth)
              └─→ Phase 6 (CMS Pages)
                    └─→ Phase 7 (Shop & Catalog)
                          └─→ Phase 8 (Product Detail)
                                └─→ Phase 9 (Cart)
                                      └─→ Phase 10 (Checkout & Orders)
                                            ├─→ Phase 11 (Service Marketplace)
                                            └─→ Phase 12 (Customer Dashboard)
                                                  └─→ Phase 13 (Provider Portal)
                                                        └─→ Phase 14 (Admin Panel)
```

## G.2 Per-Page Workflow (9 Steps — Mandatory)

For EVERY page, the following sequence is executed before moving to the next:

1. **Understand** — Re-read PRD requirements for this page; confirm business goal.
2. **Explain Structure** — Document the page's section/wireframe layout.
3. **List Components** — Identify which reusable components from Part C will be composed.
4. **Build UI** — Implement the page composing existing components; create new sub-components only if no reusable option exists.
5. **Make Responsive** — Test all breakpoints (xs/sm/md/lg/xl/2xl); mobile-first.
6. **Check Accessibility** — Keyboard nav, focus rings, ARIA, contrast, semantic HTML.
7. **Optimize** — Image lazy-loading, code-splitting, suspense boundaries, memoization.
8. **Self-Review** — Verify against completion checklist + PRD FR-IDs + bilingual EN/HI.
9. **Report** — Summarize what was built, decisions made, and any blockers; STOP and wait for next instruction.

## G.3 Definition of Done (Per Page)

A page is "done" when ALL of:
- [ ] All PRD FR-IDs for that page are implemented.
- [ ] Bilingual EN/HI labels render via Zustand store.
- [ ] Responsive at all 6 breakpoints.
- [ ] WCAG 2.1 AA passed (keyboard, contrast, ARIA).
- [ ] Loading + Empty + Error states implemented.
- [ ] SEO tags + JSON-LD present (for indexable pages).
- [ ] No console errors; Lighthouse > 90 (where applicable).
- [ ] Self-review checklist complete.
- [ ] Completion report posted; awaiting next instruction.

---

# PART H — APPROVAL REQUEST

This plan covers:
- ✅ Phase 0 Project Analysis (BRD + PRD + all specs synthesized)
- ✅ 14-phase Frontend Development Roadmap
- ✅ Component Architecture (90+ reusable components across 9 categories)
- ✅ Layout Architecture (6 layout shells, route groups, responsive breakpoints)
- ✅ Design System Plan (colors, typography, spacing, radius, shadows, motion, a11y, dark-mode-ready tokens)
- ✅ Page-by-page task breakdown for all ~70 screens (38 customer + 6 provider + 15+ admin + auth + CMS + error)

**No code has been written.** Per the master instruction, development will begin only after this plan is approved, and will proceed strictly phase-by-phase and page-by-page.

**Awaiting your approval to proceed with Phase 1 (Project Foundation).**

---

*End of Frontend Development Plan — GrowPlants*
