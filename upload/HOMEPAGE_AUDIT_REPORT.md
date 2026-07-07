# GROWPLANTS HOMEPAGE — PROFESSIONAL AUDIT REPORT

**Audited by:** Senior Frontend Architect / UI-UX Auditor / CRO Specialist / Performance Engineer  
**Date:** June 10, 2026  
**Project:** GrowPlants — Ecommerce + Gardening Services Marketplace  
**Framework:** Next.js 16.2.7 (App Router), React 19, Tailwind CSS v4, TypeScript

---

## 1. HOMEPAGE STRUCTURE ANALYSIS

### 1.1 Sections (in order)

| # | Section | File | Purpose |
|---|---------|------|---------|
| 1 | AnnouncementBar | `src/components/global/AnnouncementBar.tsx` | Top rotating trust/reassurance bar |
| 2 | Header | `src/components/global/Header.tsx` | Logo, search, navigation, cart, auth |
| 3 | HeroSection | `src/components/sections/HeroSection.tsx` | Auto-rotating carousel — primary CTA |
| 4 | QuickCategoryGrid | `src/components/sections/QuickCategoryGrid.tsx` | Category discovery / browse by category |
| 5 | BestSellersSection | `src/components/sections/BestSellersSection.tsx` | Featured products with filter tabs |
| 6 | ServicesSection | `src/components/sections/ServicesSection.tsx` | Gardening service offerings + booking flow |
| 7 | WhyChooseUsSection | `src/components/sections/WhyChooseUsSection.tsx` | Trust building / differentiation |
| 8 | ProvidersSection | `src/components/sections/ProvidersSection.tsx` | Expert gardener profiles |
| 9 | TestimonialsSection | `src/components/sections/TestimonialsSection.tsx` | Social proof / customer reviews |
| 10 | BlogPreviewSection | `src/components/sections/BlogPreviewSection.tsx` | Content marketing / blog preview |
| 11 | FAQSection | `src/components/sections/FAQSection.tsx` | FAQ accordion + WhatsApp support CTA |
| 12 | NewsletterSection | `src/components/sections/NewsletterSection.tsx` | Email capture / subscription |
| 13 | Footer | `src/components/global/Footer.tsx` | Site map, links, contact info, social |
| 14 | MobileBottomNav | `src/components/global/MobileBottomNav.tsx` | Fixed mobile bottom navigation |

### 1.2 User Journey Flow

**Top → Bottom:**

1. **Announcement Bar** (3.5s rotating) → Trust reinforcement (free delivery, damage guarantee, verified gardeners)
2. **Header** → Navigation, search, cart, auth
3. **Hero Carousel** → Primary CTA (shop plants, book gardener, seasonal offers). 5 slides, 5s autoplay.
4. **Category Grid** → 8 category tiles → browse by type. "Find Your Perfect Plant" heading.
5. **Best Sellers** → Product discovery with 5 filter tabs (All, Best Sellers, New, Trending, Air Purifying). 8 product cards max.
6. **Services** → 3 service cards + "How Booking Works" process strip + trust badges
7. **Why Choose Us** → 8 trust/benefit cards
8. **Providers** → 4 gardener profiles + "Become a Provider" CTA
9. **Testimonials** → Featured review carousel + stats row (1,200+ Happy Customers)
10. **Blog** → 1 featured + 2 side articles + newsletter mini-prompt
11. **FAQ** → 2-column layout (left: intro + WhatsApp, right: accordion)
12. **Newsletter** → Dark section with email form + decorative elements
13. **Footer** → Complete site map, contact, social, legal
14. **Mobile Bottom Nav** → Fixed bar: Home, Shop, Services, Wishlist, Account

### 1.3 Information Architecture Assessment

**Strengths:**
- Clear hierarchy: Hero → Browse → Products → Services → Trust → Social Proof → Content → FAQ → Subscribe
- Logical progression from awareness → consideration → conversion → retention
- Both product (e-commerce) and service (marketplace) tracks are well-represented

**Weaknesses:**
- No sticky/on-page cart button for desktop (available only as hover mini-cart or drawer)
- No pincode checker on homepage for delivery eligibility (mentioned in FAQ but not interactive)
- "Become a Provider" CTA (ProvidersSection line 121) links to `/become-provider` but this route does NOT exist in the project (`src/app/` has no such directory) — this is a broken link
- "View All Gardeners" link (ProvidersSection line 30) links to `/providers` which also does NOT exist in the codebase — broken link
- Individual provider links (`/providers/${provider.id}`) lead to non-existent routes
- "See Reviews" in Hero slide 5 links to `/#testimonials` — uses anchor hash but the TestimonialsSection does NOT have `id="testimonials"`, so scroll-to-section will not work

---

## 2. UI AUDIT

### 2.1 Typography System

**Specification:** Inter font family throughout. Font variables defined in `globals.css` lines 57-68 (headline-h1 through body-sm, caption).

**Issues:**

1. **Duplicate font loading** — `src/app/layout.tsx` line 37-39 loads Inter via both Google Fonts CDN `<link>` tags AND via `next/font/google` (lines 10-14). The `next/font` approach already loads and optimizes the font. The additional `<link>` tags in `<head>` are redundant, increase blocking CSS, and defeat Next.js font optimization. **Impact:** Performance penalty, unnecessary render-blocking request.

2. **Font CSS variables defined but unused** — `globals.css` defines `--font-headline-h1`, `--font-body-lg`, etc. (lines 57-68), but these CSS variables are never referenced anywhere in the code. Components use Tailwind classes like `font-display`, `font-bold`, `text-xs`, etc. instead. **Impact:** Dead CSS, maintenance confusion.

3. **Inconsistent heading sizing** — Some section titles use `font-display text-3xl md:text-4xl font-bold` (QuickCategoryGrid, BestSellersSection, FAQSection), while others use `text-3xl md:text-4xl` (WhyChooseUsSection, ProvidersSection). ServicesSection and BlogPreviewSection also follow the same pattern but with different semantic class usage. Not a critical issue, but the inconsistency in `font-display` vs `font-bold` class ordering shows lack of a typography style guide.

### 2.2 Color System

**Issues:**

1. **Duplicate color definitions** — `globals.css` defines two parallel color systems:
   - Lines 4-55: Tailwind `@theme` block with M3-style colors (`--color-surface-container`, `--color-primary-fixed-dim`, etc.)
   - Lines 86-131: More `@theme` block with brand colors (`--color-brand-50` through `--color-brand-950`, `--color-warm-*`, `--color-neutral-*`)
   - Lines 244-253: CSS custom properties in `:root` (`--primary`, `--accent`, `--surface`, `--border`, etc.)
   - Lines 255-264: Standalone utility classes (`.bg-surface`, `.text-primary`, `.shadow-card`)
   
   This creates confusion — some components reference `text-primary` (which maps to `color: var(--primary) = #0d631b`), while others use inline styles like `style={{ background: '#1A6B3C' }}` or Tailwind classes referencing the `@theme` tokens. **Impact:** Maintenance nightmare, inconsistent colors, potential for mismatched shades.

2. **Hardcoded hex values** — Throughout the codebase, the green `#1A6B3C` is hardcoded ~40+ times across components (HeroSection line 191, BestSellersSection line 58/77, ServicesSection line 71, ProvidersSection line 51/85, etc.). This is a major maintainability issue. If the brand color ever shifts, every file must be updated individually. **Impact:** Technical debt, refactoring friction.

3. **Green-on-green accessibility concern** — The primary green `#1A6B3C` on white background has a contrast ratio of approximately 4.8:1, which passes AA for large text (18px+) but may be borderline for smaller text (the many 10px, 11px, 12px uses). The accent orange `#E8930A` on white has ~3.2:1 contrast, **failing** the 4.5:1 AA standard for normal-size text.

4. **Inconsistent card shadows** — `WhyChooseUsSection` uses `hover:shadow-card` (custom shadow: `0 4px 24px rgba(13, 99, 27, 0.08)`), while `ServicesSection` uses `hover:shadow-lg`, and `BestSellersSection` uses `hover:shadow-md` on `ProductCard`. This inconsistency in shadow depth creates visual discordance across sections.

### 2.3 Spacing System

**Issues:**

1. **Section padding mismatch** — `section-padding` class (globals.css lines 214-223) uses `padding-top: 4rem / 5rem` and `padding-bottom: 4rem / 5rem`. However, the `container-width` class (lines 201-213) uses different padding (`1rem` / `1.5rem`). While these serve different purposes, the inconsistency between the horizontal padding system and vertical spacing system makes layout tuning difficult.

2. **Custom spacing tokens defined but unused** — `globals.css` lines 74-84 define `--spacing-gutter: 24px`, `--spacing-xs: 8px`, `--spacing-sm: 12px`, `--spacing-margin-mobile: 16px`, `--spacing-huge: 64px`, etc. None of these are referenced anywhere in the codebase. **Impact:** Dead code, 11 lines of unused CSS variables.

### 2.4 Card Designs

**Issues:**

1. **Three different card border-radius systems**:
   - `ProductCard.tsx`: `rounded-lg` (8px via `--radius-lg: 0.5rem`)
   - `ServiceCard.tsx`: `rounded-lg` (8px) with `border-l-4 border-l-primary` (left accent)
   - `ProviderCard.tsx`: `rounded-lg` (8px) — but inside `ProvidersSection.tsx` the wrapper uses `rounded-2xl` (16px)
   - WhyChooseUs cards: `rounded-xl` (12px)
   - ServiceCategory pills: `rounded-full`
   
   **Impact:** Visual inconsistency — different card border radii competing for user attention.

2. **No image placeholder / loading state** for cards. `ProductCard.tsx` uses `<img>` with no `onError` fallback, no blur placeholder, no skeleton. If an image fails to load, the user sees a broken image icon. **Impact:** Poor UX on slow networks or broken CDN links.

### 2.5 Button System

The `button.tsx` component is a well-structured CVA-based button with variants (primary, secondary, outline, ghost, danger, accent), sizes (xs-xl), and loading state. **But it is NEVER used on the homepage.**

All homepage CTAs use either:
- `<Link>` with inline style `style={{ background: '#1A6B3C' }}` (HeroSection, BestSellersSection, etc.)
- `<Link>` with hardcoded Tailwind classes (QuickCategoryGrid)
- `<button>` with custom styling directly (HeroSection carousel controls, filter buttons)

**Impact:** The button component (`src/components/ui/button.tsx`) costs ~73 lines of well-designed, tested code that is bypassed entirely on the homepage. All homepage buttons lack consistent hover states, focus rings, and loading states. This is a **code quality + UX consistency** issue.

### 2.6 Image Quality

**Issues:**

1. **No `next/image` usage on homepage sections** — All section images use native `<img>` tags (HeroSection line 176, QuickCategoryGrid line 43, ProductCard line 60, etc.). The only `next/image` usage is in the `Footer.tsx` (line 16). **Impact:** No automatic WebP/AVIF conversion, no lazy loading optimization from Next.js Image component, no responsive srcset generation, no width/height aspect ratio enforcement (causing layout shift — CLS).

2. **External images from AIDA (Google) and Unsplash** — HeroSection slides use `lh3.googleusercontent.com/aida-public/AB6AXuC...` URLs. These are likely temporary/protected URLs that may expire. **Impact:** High risk of broken hero images rendering the section useless.

3. **Flowering Plants category image** (mockData.ts line 370): `https://m.media-amazon.com/images/I/61toWc5U8rL.jpg` — This is an Amazon product image. Using Amazon-hosted images without permission poses legal/licensing risk and may break at any time.

4. **Bonsai category image** (mockData.ts line 373): `https://m.media-amazon.com/images/I/61IM4VsKe1L._SX569_.jpg` — Same issue.

5. **No lazy loading on desktop-visible images** — The `loading="lazy"` attribute is present on ProductCard images (line 64) and ServiceCard images (line 33), but the HeroSection uses conditional `loading={idx === 0 ? 'eager' : 'lazy'}` which is good. However, the QuickCategoryGrid images have NO loading attribute, meaning they all load eagerly. **Impact:** 8 category images load on initial page load even though they're below the fold.

---

## 3. UX AUDIT

### 3.1 Navigation & Discoverability

**Strengths:**
- Mega menu dropdown (MegaMenu.tsx) with 4 category columns
- Search bar with real-time suggestions overlay
- Sticky header with scroll detection
- Mobile bottom navigation is well-implemented

**Critical Issues:**

1. **No active link indication** — None of the nav links (Header.tsx lines 372-394) indicate the current page. On the homepage, "Shop" and "Home" links look identical to other pages. **Impact:** Users lack location awareness. Minor on homepage but poor pattern for rest of site.

2. **Search category dropdown misplaced** — The category dropdown in the search bar (Header.tsx line 189-203) has `top-full` but the parent container `relative` is inside the flex row. The dropdown renders relative to the button, which is correct visually, but the `z-50` may conflict with other elements. More concerning: the dropdown disappears immediately on desktop screens below ~1024px because the entire search bar is hidden via `hidden lg:flex`. **Impact:** No category filtering on tablet/mobile search.

3. **Mobile search requires two taps** — On mobile, user taps the search icon → mobile search bar appears → then types and submits. This is a two-step pattern vs the ideal inline pattern. Acceptable but suboptimal.

4. **No breadcrumbs** — The homepage has no breadcrumb navigation. While breadcrumbs on the homepage are atypical, their absence represents a missed navigation pattern for the broader site.

### 3.2 CTA Placement & Effectiveness

**Issues:**

1. **Hero CTAs are text-heavy** — Primary buttons use `text-xs md:text-sm` (HeroSection line 216). For the most important CTAs on the page, this is too small. Industry best practice for hero CTAs is at least `text-base md:text-lg`.

2. **"Become a Provider" CTA is poorly positioned** — This is placed within the ProvidersSection (line 121) after showing gardener profiles. However, its target audience (professional gardeners, not plant buyers) may never scroll this far. **Impact:** Low conversion rate for provider sign-ups.

3. **Newsletter CTA conflict** — The BlogPreviewSection has a mini newsletter prompt (line 87) that links to `#newsletter`, and the NewsletterSection is the final section. But the blog mini-prompt uses "Subscribe free →" as a link, while the NewsletterSection uses a full form. This creates two competing "subscribe" paths with different UX patterns. **Impact:** Confusing.

4. **WhatsApp chat CTA in FAQ is effective but buried** — FAQSection line 34-43 provides a WhatsApp button for questions. This is positioned late in the page (section 11 of 12). Moving it higher could increase engagement.

5. **No floating/sticky Add to Cart on homepage** — While ProductCard has inline "Add" buttons, there is no persistent mini-CTA for cart access on desktop (only on mobile via the floating cart button in MobileBottomNav.tsx).

### 3.3 Product Browsing Experience

**Issues:**

1. **Only 8 products shown** — BestSellersSection filters MOCK_PRODUCTS and slices to 8 (line 27). With mock data containing plants + planters, potentially dozens of products exist. Showing only 8 with no "Load More" or infinite scroll is a missed engagement opportunity.

2. **No product quick-view/lookup** — Clicking a product card navigates to the full product page. There is no quick-view modal or hover preview for faster browsing. **Impact:** Higher bounce rate as users must navigate away.

3. **Filter tabs reset on every section navigation** — The `activeFilter` state in BestSellersSection (line 18) is local `useState`. If a user clicks a filter, then navigates away and back, the filter resets to "All". Not a major issue on single-page, but worth noting.

### 3.4 Friction Points

1. **No pincode checker at the top** — For an e-commerce store with limited delivery zones (Sonipat, Haryana), not having a pincode checker near the hero/before product discovery creates uncertainty. Users may add products to cart only to discover delivery is unavailable. **Impact:** Cart abandonment, checkout friction.

2. **No visible return/refund policy on the first scroll** — The 24-hour damage guarantee is mentioned in the AnnouncementBar (rotates through), WhyChooseUs cards, and FAQ, but there is no persistent trust badge visible without scrolling. **Impact:** Reduced purchase confidence for new users.

3. **Hero carousel autoplay is aggressive** — 5-second interval (HeroSection line 111) with a progress bar. Users have only 5 seconds to read and act before the slide changes. For slides with complex text, this is too fast.

## 4. COMPONENT AUDIT

### 4.1 Homepage Sections

| Component | Props | State | Complexity | Reusability | Notes |
|-----------|-------|-------|------------|-------------|-------|
| HeroSection | none | active, paused, progress, touch coords | High | Low | 5 hardcoded slides, swipe, keyboard nav, autoplay |
| QuickCategoryGrid | none | none (reads `language` from store) | Low | High | Uses mockData, bilingual |
| BestSellersSection | none | activeFilter | Medium | High | Filter + product grid pattern |
| ServicesSection | none | none | Medium | Medium | Service cards + steps + trust badges |
| WhyChooseUsSection | none | none | Low | High | Pure presentational |
| ProvidersSection | none | none (reads `language` from store) | Medium | Medium | Provider cards + CTA banner |
| TestimonialsSection | none | active | Medium | High | Carousel + stats |
| BlogPreviewSection | none | none (date formatting) | Medium | Medium | Featured + side layout |
| FAQSection | none | openId | Low | High | Accordion pattern |
| NewsletterSection | none | email, status | Low | High | Form with states |

### 4.2 UI Components

| Component | Props | State | Complexity | Used on Homepage? |
|-----------|-------|-------|------------|-------------------|
| ProductCard | `product: Product` | isWishlisted, isAdded | Medium | Yes (BestSellersSection) |
| ServiceCard | `service: Service` | none | Medium | Yes (ServicesSection) |
| ProviderCard | `provider: Provider` | none | Medium | **No** (Not used anywhere! ProvidersSection builds cards inline) |
| Button | variant, size, fullWidth, isLoading | none | Medium | **No** (All CTAs use inline styles) |
| Card | shadow, hover | none | Low | **No** (All cards built inline) |
| Badge | variant, size | none | Low | **No** (Badges are inline in ProductCard) |
| Rating | rating, size, interactive | hoverRating | Medium | **No** (Star ratings are inline loops) |
| Icon | name, fill, size | none | Low | **No** (Uses lucide-react directly) |

### 4.3 Key Findings

1. **ProviderCard is unused** — `src/components/ui/ProviderCard.tsx` (77 lines) is a complete, well-designed component that is never imported or used. ProvidersSection.tsx builds provider cards manually with `<Link>` containing inline HTML. **Impact:** Dead code, wasted bundle size.

2. **Button component unused on homepage** — The CVA-based Button with variants, sizes, and loading state is not used anywhere on the homepage. All homepage buttons use raw `<button>` or `<Link>` with inline styling.

3. **Card component unused** — The Card component with its Header/Content/Footer sub-components is unused across the homepage. All sections build their own card containers.

4. **Rating component unused** — ProductCard.tsx renders stars manually (lines 118-127) rather than using the reusable `Rating` component. ServiceCard.tsx does the same.

5. **Badge component unused** — Product "New", "Bestseller", and discount badges are rendered inline (ProductCard.tsx lines 82-98) instead of using the Badge component.

6. **ServiceCard is used but the ProviderSection builds similar cards inline** — The pattern for listing entities is inconsistent: services use a reusable `ServiceCard`, but providers use inline card markup.

### 4.4 Global Components

7. **SearchSuggestionsOverlay is over-engineered for its current usage** — 238 lines with recent search history management (localStorage), trending searches, product/service filtering, keyboard navigation, and bilingual support. The core search functionality on the homepage is limited (desktop-only search bar with mobile fallback). The overlay works well but the complexity-to-usage ratio is high.

8. **MegaMenu is well-structured** but is the only component that properly uses the `language` from `useBilingual` store. Other sections (like WhyChooseUs) do not provide Hindi translations despite the bilingual infrastructure existing.

---

## 5. RESPONSIVE DESIGN AUDIT

### 5.1 Desktop (>1024px)

**Strengths:**
- Container width maxed at 1280px (`max-w-[1280px]`)
- Full mega menu visible
- Search bar with category filtering visible
- Horizontal nav bar present

**Issues:**
1. **Hero section height uses `clamp(420px, 55vw, 660px)`** (HeroSection line 157) — On ultrawide monitors (>1400px content area), 55vw would be excessive. The clamp caps at 660px which is adequate, but on very large screens the hero may feel short.

2. **BestSellersSection grid is `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`** — On desktop, 4 columns is reasonable but on 1400px+ screens, the cards may feel stretched. Consider `xl:grid-cols-5` for very large screens.

3. **FAQ accordion left column** — On desktop, the left column (FAQ intro + WhatsApp card) takes 2/5 width which is ~512px. The FAQ text content in this column is `text-sm` which may be too small for comfortable reading.

### 5.2 Tablet (768px - 1023px)

**Issues:**
1. **Search bar hidden at tablet** — The desktop search bar is hidden at `lg` breakpoint (line 171: `hidden lg:flex`), and the mobile search bar only appears when toggled. This means tablet users (iPad portrait at 768px) must tap the search icon to access search, adding friction.

2. **Navigation tier 3 hidden** — The category navigation row (line 354: `hidden lg:block`) disappears at <1024px. Tablet users lose access to "Shop", "Services", "Offers", "Blog" quick links and must rely on the hamburger menu.

3. **Hero content sizing** — Hero section uses `text-3xl sm:text-5xl md:text-6xl` for the headline. On tablet, the `md:` breakpoint applies, making headlines potentially too large for the viewport.

4. **Provider CTA banner switches to column** — The `flex-col md:flex-row` (ProvidersSection line 109) handles this well at tablet.

### 5.3 Mobile (<768px)

**Issues:**
1. **Mobile bottom nav overlaps content** — `MobileBottomNav.tsx` is fixed to bottom at `h-16` (64px). The `main` element has `mobile-nav-pad` class which adds `padding-bottom: 4rem` (globals.css line 275). However, `<body>` uses `flex flex-col` with `min-h-full`. The fixed nav layer should have `z-40` (line 27) but content scrolls under it. This is handled by the padding but any `env(safe-area-inset-bottom)` handling is minimal.

2. **Touch targets may be small** — The mobile bottom nav items have no explicit minimum touch target size. Industry standard is 44x44px. The nav items use `p-2` (8px padding) with icons at `h-5 w-5` (20px). The total touch area is ~36px — below the recommended 44px minimum.

3. **Hero carousel arrows are hidden on hover** — Carousel control arrows use `opacity-0 group-hover:opacity-100` (HeroSection line 238). On mobile, there is no hover state, so the arrows are **always invisible**, making manual slide navigation impossible without swiping. **Impact:** Critical accessibility and UX failure on touch devices.

4. **Product grid is 2 columns** — `grid-cols-2` for mobile (BestSellersSection line 66). On very small screens (<360px), this may cause product cards to be cramped. Consider `grid-cols-1` on the smallest breakpoints.

5. **No mobile-specific touch behavior for the hero** — Swipe gestures are handled (HeroSection lines 129-148), but there is no dot indicator that is touch-friendly. The dots at the bottom (line 253-262) are only 7px in their inactive state, which is below touch standards.

6. **Category grid 2 columns on mobile** — QuickCategoryGrid uses `grid-cols-2`. With 8 categories, this creates 4 rows of category pills. Each pill has a `w-14 h-14` image container, `text-xs` name, and `text-[10px]` item count — these are small but functional on mobile.

---

## 6. PERFORMANCE AUDIT

### 6.1 Images (Critical)

1. **No `next/image` optimization** — As noted in UI Audit, all homepage section images use native `<img>`. This means:
   - No automatic WebP/AVIF format conversion
   - No responsive srcset generation
   - No lazy loading via Intersection Observer (browser-native `loading="lazy"` is used inconsistently)
   - No width/height attributes causing **Cumulative Layout Shift (CLS)**
   - **Impact:** Poor Core Web Vitals scores, especially LCP and CLS.

2. **All hero images load at full resolution** — The hero carousel uses Unsplash/AIDA-served images at what appear to be multi-megabyte sizes. No thumbnails or progressive loading. **Impact:** Largest Contentful Paint (LCP) will be poor.

3. **No placeholder/blur-up for product images** — Product cards show images with no skeleton or placeholder. While the grey background `bg-[#F3F8F1]` helps, empty states show blank grey boxes.

### 6.2 Bundle Size Impact

1. **All sections are 'use client'** — Every single section component in `src/components/sections/` is marked `'use client'`. This means all of them are client-side JavaScript bundles, including purely presentational sections (WhyChooseUsSection, FAQSection). **Impact:** Significantly larger initial JavaScript bundle — pages that could be server components are all client-rendered.

2. **All global components are 'use client'** — Header, Footer, AnnouncementBar, MobileBottomNav, CartDrawer, MegaMenu, MiniCartPreview, SearchSuggestionsOverlay — each adds to the JS bundle.

3. **lucide-react is tree-shakeable but many icons are imported** — Individual icon imports are used throughout, which is good, but the total icon count across homepage components is ~30+ different icons.

4. **Material Symbols loaded from CDN** — `layout.tsx` line 40 loads Material Symbols from Google Fonts CDN. This is an **external blocking request** on every page load. The `Icon.tsx` component wraps Material Symbols. But the homepage primarily uses lucide-react icons, not Material Symbols. The CDN-loaded font + CSS may not even be used on the homepage. **Impact:** Unnecessary external resource loading.

### 6.3 Rendering Efficiency

1. **Hero carousel re-renders all slides on every transition** — The `transition-opacity` approach hides inactive slides with `opacity-0 pointer-events-none`, but all 5 `<div>` elements are always in the DOM. On every slide change, all slides potentially re-render. Using CSS `display: none` or conditional rendering for only visible slides could improve re-render performance.

2. **Progress bar causes rapid state updates** — The progress bar in HeroSection (lines 113-121) uses `setInterval` at 50ms intervals to update `progress` state. This triggers a React re-render every 50ms while autoplay is active. **Impact:** Unnecessary re-renders. Should use CSS animation or ref-based progress update.

3. **FAQ accordion uses inline styles for animation** — FAQSection (line 71) uses `style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}`. The hardcoded `300px` max-height will break if FAQ content grows longer. This is also a layout thrash trigger.

### 6.4 Dynamic Imports

**No dynamic imports used** — None of the section components use `next/dynamic` for lazy loading. Every section loads eagerly on initial page load. For example, FAQSection, NewsletterSection, and TestimonialsSection (below the fold) could be dynamically imported. **Impact:** Larger initial bundle, slower Time to Interactive (TTI).

### 6.5 Loading Strategy

1. **No loading.tsx** — The `/` route (homepage) does not have a `loading.tsx` file, nor do any sections implement Suspense boundaries.

2. **No streaming or progressive rendering** — The entire page is rendered as one block.

---

## 7. ACCESSIBILITY AUDIT

### 7.1 Semantic HTML

**Issues:**

1. **Missing `<main>` landmark role in layout** — `layout.tsx` line 45 uses `<main>` which is correct, but the `AppProviders` wraps `children` inside `<main>`, which is fine.

2. **Hero section uses `<div>` for content containers** — The hero headline uses `<h1>` (correct), but the badge uses `<div>` with no heading role, subtitle uses `<p>` (correct), and CTAs use `<Link>` (correct).

3. **Section headings are `<h2>` — Correct**. All sections use `<h2>` for their titles. However:
   - No sections use `<article>`, `<nav>` for their content regions
   - No use of `<aside>` for secondary content

4. **Blog section cards are `<Link>` elements** — Blog preview items use `<Link>` containing `<h3>` (BlogPreviewSection line 53) and `<h4>` (line 77). This is acceptable but ideally the heading should be a `<h3>` and the link should be the heading only, or `aria-labelledby` should be used.

5. **FAQ accordion** uses `<button>` (semantic) but the open/close state is only communicated visually, not to screen readers (no `aria-expanded` or `aria-controls`).

### 7.2 ARIA Usage

**Critical Issues:**

1. **Hero carousel has no ARIA landmarks** — The carousel is not marked with `role="region"`, `aria-roledescription="carousel"`, `aria-label`, or `aria-live`. Screen readers have no way to identify it as a carousel or track slide changes.

2. **FAQ accordion has no ARIA** — No `aria-expanded`, `aria-controls`, or `role="region"` on accordion items. Screen reader users cannot determine which FAQs are open/closed.

3. **No `aria-current` on nav links** — The header navigation has no indication of the current page for screen readers.

4. **Testimonials carousel has no ARIA** — Similar to the hero carousel, no `aria-live="polite"`, `role="region"`, or slide announcements.

5. **Mobile menu drawer** — The mobile menu overlay does not have `role="dialog"`, `aria-modal="true"`, or `aria-labelledby`. Focus is not trapped within the menu when open (no focus management).

### 7.3 Keyboard Navigation

**Issues:**

1. **Hero carousel keyboard nav is implemented** (lines 91-101) but only ArrowLeft/ArrowRight. There is no way to jump to a specific slide via keyboard (the dot indicators are `<button>` elements, so Tab can reach them, but there is no visual focus indicator on them).

2. **No skip-to-content link** — Users cannot skip the header and navigation to reach main content.

3. **FAQ accordion keyboard nav is incomplete** — `<button>` elements are keyboard accessible by default, but there is no visual focus indicator customization, and Enter/Space handlers are default but not enhanced.

4. **Filter tabs in BestSellersSection** — The filter buttons have no `role="tab"`, `aria-selected`, or `aria-controls`. They are simple `<button>` elements. The tab panel below has no `role="tabpanel"`.

### 7.4 Color Contrast

**See UI Audit section 2.2 for specific contrast ratios.**
- Orange accent (`#E8930A`) on white fails AA for normal text
- Several text-secondary and text-muted colors may fail at small sizes

### 7.5 Focus States

1. **All links with `hover:underline` work for visual users but focus styles are missing** — QuickCategoryGrid "View All" link uses `hover:underline` but has no visible `focus-visible` ring.

2. **BestSellers filter tabs have `outline` removal risk** — `globals.css` sets `* { -webkit-tap-highlight-color: transparent }` but does not set explicit `focus-visible:ring-*` classes on interactive elements. Not a violation but a missed opportunity.

3. **Hero carousel buttons have `aria-label` (good)** — Chevron buttons have `aria-label="Previous Slide"` / `"Next Slide"`. Dot indicators do NOT have `aria-label` other than their implicit text-free button role.

### 7.6 Screen Reader Support

1. **Alt text quality is good overall** — Most images have descriptive `alt` text. However:
   - Hero slide images have `alt={slide.headline}` which is descriptive but could better describe the actual image content
   - Provider images have `alt={provider.display_name}` (correct)
   - Product images have `alt={product.name}` (correct)
   - Category images have `alt={cat.name}` (correct)

2. **Social media icons in Footer** are SVGs with `aria-label` on their wrapper — Good practice.

3. **"Material Symbols" icons** use `aria-hidden="true"` when used via the `Icon.tsx` component — Good practice. But lucide-react icons used throughout homepage sections do NOT consistently have `aria-hidden="true"`.

---

## 8. CODE QUALITY AUDIT

### 8.1 Folder & Component Organization

**Strengths:**
- Logical folder structure: `sections/`, `ui/`, `global/`, `account/`
- Consistent naming: PascalCase components, camelCase utilities
- Good separation of concerns between data (`mockData.ts`, `types/`), state (`store/`), and UI

**Weaknesses:**

1. **`src/services/` is empty** — The directory exists but contains no files. Dead directory.

2. **Two separate Next.js projects exist inside the repo** — `firebase-account/` and `growplants-account/` are redundant Next.js projects alongside the main project. **Impact:** Developer confusion, maintenance burden.

3. **`account page UI/` folder** with HTML mockups and screenshots should be in project documentation, not in the source tree. These are design reference files that could be external.

4. **`documents/` folder** with BRD, PRD, sitemap documents — These could be in a `docs/` folder but are acceptable as-is.

### 8.2 Naming Conventions

**Issues:**
1. **Inconsistent file naming** — `firebase-config.js` uses kebab-case, `firebase-utils.js` uses kebab-case, but component files use PascalCase. Mixed conventions in root directory.

2. **`AppProviders.tsx` and `FirebaseProviders.tsx`** — Slightly inconsistent: `AppProviders` vs `FirebaseProviders` (one is not a component while the other is). Both are components in the `components/` folder.

3. **`layout.tsx` vs `page.tsx`** — Follows Next.js conventions, so this is fine.

### 8.3 Technical Debt

1. **Hardcoded green `#1A6B3C` in ~40+ locations** — As noted in UI Audit. This is the single largest source of technical debt.

2. **`'use client'` on every section** — All 10 section components and all global components are client components. Only ~3-4 need interactivity (Hero, BestSellers, Testimonials, FAQ, Newsletter). The rest could be server components.

3. **MockData and production data mixed** — `mockData.ts` is large (387 lines) and used directly by the homepage. There is no API integration layer; the homepage renders mock data directly. For a production e-commerce site, this means a significant rewrite when connecting to the backend.

4. **`page.tsx` imports data files and creates dummy references** (lines 11-12, 16-17):
   ```tsx
   import plantsData from '../data/plants-data.json';
   import potsData from '../data/pots-data.json';
   const _plantsCount = Object.keys(plantsData).length;
   const _potsCount = Object.keys(potsData).length;
   ```
   These variables are never used — they exist only to force Webpack/bundler to keep the imports. This is a code smell suggesting a misunderstanding of ES module import behavior or a workaround for a bundler issue.

5. **`SearchSuggestionsOverlay.tsx` has a fragile keyboard navigation hack** (lines 118-126):
   ```tsx
   const suggestionsBox = document.querySelectorAll('[onMouseDown]');
   if (suggestionsBox.length > 0) {
     const activeEl = suggestionsBox[activeSuggestionIndex] as HTMLElement;
     if (activeEl) { activeEl.click(); }
   }
   ```
   Querying by `[onMouseDown]` is extremely brittle and breaks if the component structure changes. This should use refs or a shared selection state instead.

6. **Performance progress bar uses setInterval at 50ms** — Drives 20 re-renders per second during autoplay. Should use `requestAnimationFrame` or CSS transitions.

7. **`AnnouncementBar.tsx` uses rotation** — The text rotates every 3.5 seconds but the transitions are CSS-based (`transition-all duration-500`). However, the content change is abrupt — the text just swaps without a proper crossfade or slide animation. Also, the announcement rotation is not accessible (no pause on hover/focus).

### 8.4 Code Smells

1. **Inlined object styles vs CSS classes** — Multiple sections frequently mix Tailwind classes with inline `style={{ background: ... }}` props. This makes it harder to theme, maintain, and override styles.

2. **`formatCurrency` exists in utils but is never used on homepage** — ProductCard.tsx and other components hardcode `₹{product.selling_price}` instead of using `formatCurrency()`.

3. **Zustand store with immutable `get()` inside `set()`** — In `useCart.ts` (lines 42-45), `updateQuantity` calls `get().removeItem(productId)` inside the `set()` reducer. This is technically a side effect within the state setter, which Zustand allows but is non-standard. Prefer side-effect-free reducers.

4. **No error boundaries** — None of the homepage sections have error boundaries. If one section throws, the entire page crashes.

5. **`homepage.html` at root** — A standalone HTML file at the project root that duplicates the homepage. This is confusing and could drift out of sync.

---

## 9. ECOMMERCE CONVERSION AUDIT

### 9.1 Trust Building

**Strengths:**
- AnnouncementBar: Free delivery, damage claim, verified gardeners (rotating)
- WhyChooseUsSection: 8 trust cards (handpicked plants, same-day delivery, damage guarantee, etc.)
- TestimonialsSection: Social proof with 4.8★ rating, 1,200+ reviews
- Trust badges in ServicesSection (Background Verified, 4.8★ Average Rating, etc.)
- Footer includes legal links (privacy, terms, refund)

**Weaknesses:**

1. **No visible security badges (payment logos, SSL)** — The SecurePay sections appears only in the Footer (line 141). Not visible during browsing or at checkout.

2. **No live social proof notifications** — No "X people are viewing this" or "Y people bought this today" micro-conversions.

3. **No "Hassle-Free Returns" badge visible above the fold** — The 24-hour damage guarantee is in the rotating AnnouncementBar (line 9), but visitors scanning quickly may miss it. A persistent trust bar below the header would build more confidence.

### 9.2 CTA Effectiveness

1. **Primary CTAs use "Shop" language which is adequate but not urgent** — "Shop Indoor Plants", "Explore Collection", "Shop Seasonal Plants" — all are informative but lack urgency/persuasion.

2. **No scarcity indicators** — No "Only 3 left", "Low stock", or "Selling fast" labels on any product cards.

3. **No time-limited offer CTAs** — The Monsoon Sale slide offers "40% off" but there's no countdown timer or urgency trigger.

4. **"Add to Cart" button disappears after adding** — ProductCard.tsx (line 176) changes the button text to "Added" for 1.5 seconds, then reverts to "Add". The brief state change may confuse users who expect a persistent confirmation.

5. **No direct "Buy Now" option** — Only "Add to Cart" (which adds to cart but does not navigate to checkout). This adds one more step to the purchase funnel.

### 9.3 Product Discovery

**Issues:**

1. **No sorting options on homepage** — The BestSellersSection has filter tabs but no price sort, popularity sort, or any other sorting mechanism.

2. **No search refinement on homepage** — Search is available only from the header, and results navigate away to `/shop?q=...`. No on-page filtering.

3. **No recently viewed products** — The `RecentlyViewed.tsx` component exists in `components/product/` but is not used on the homepage.

4. **No cross-sell or up-sell** — No "Complete the look" or "Frequently bought together" suggestions.

5. **No reviews on product cards** — ProductCard shows star rating and review count but only one line: `(review_count)`. No review snippets visible on the homepage.

### 9.4 Conversion-Reducing Issues

1. **No sticky "Add to Cart" on mobile** — Mobile users must scroll back up to add products, or navigate to the bottom product card. The floating cart button only appears when items are in the cart.

2. **No visible shipping estimate above the fold** — Users must scroll to WhyChooseUs or the FAQ to learn about shipping costs and thresholds.

3. **No estimated delivery date on product cards** — No "Arrives by Friday" or "Delivered in 2-3 days in Sonipat" messaging.

4. **No guest checkout indication** — The site uses Firebase Auth + JWT, but there's no indication that users can browse without signing in. The "Sign In" button is prominent but there's no "Continue as Guest" option.

5. **Wishlist is not functional** — The ProductCard wishlist button toggles a local `useState` but never persists to localStorage or API. Refreshing the page resets the wishlist state. The badge shows hardcoded `0`.

---

## 10. SEO AUDIT

### 10.1 Heading Structure

**Structure:**
- `<h1>`: HeroSection headline (changes per slide) — Good practice, one h1
- `<h2>`: Section titles (QuickCategoryGrid "Find Your Perfect Plant", BestSellers "Customer Favourites", etc.) — Good
- `<h3>`: Product names in ProductCard, service names in ServiceCard, provider names in ProvidersSection — Good
- `<h4>`: Process step titles, mini-blog items, footer column headers — Good

**Issues:**
- BlogPreviewSection uses both `<h3>` (featured post) and `<h4>` (side posts) — inconsistent but acceptable
- The heading hierarchy is well-maintained overall

### 10.2 Metadata

**Layout metadata** (layout.tsx lines 16-31):
- Title: `"GrowPlants - Premium Plants & Gardening Services in Sonipat"` — Good, includes brand + primary keywords + location
- Description: Good length and keyword-rich
- Keywords meta: Listed (plants, planters, gardening services, etc.)
- OpenGraph: Present with locale `en_IN`

**Issues:**
1. **No page-specific metadata** — The homepage uses layout defaults. There is no `generateMetadata` or `metadata` export in `src/app/page.tsx`. **Impact:** Every page shares the same title tag and description. Not ideal for SEO.

2. **No JSON-LD structured data** — No Schema.org markup for:
   - `LocalBusiness` (GrowPlants as a Sonipat business)
   - `Product` (individual product listings)
   - `Service` (gardening services)
   - `Review` (customer testimonials)
   - `FAQPage` (FAQSection content)
   - `BreadcrumbList`
   - **Impact:** Major missed opportunity for rich search results (star ratings, FAQ snippets, product carousels)

3. **No canonical URL** — The homepage should have `<link rel="canonical" href="https://growplants.in/" />`.

4. **No `hreflang` tags** — Despite having bilingual support (EN/HI), there are no `hreflang` tags for the Hindi version of the site.

### 10.3 Internal Linking

**Issues:**

1. **Broken links** — As noted in 1.3: `/become-provider`, `/providers`, `/providers/${provider.id}` all link to non-existent routes.

2. **Missing routes** — Some routes referenced don't exist in the codebase:
   - `/offers` (referenced in Header.tsx line 389, MobileBottomNav)
   - `/shop?category=planters&material=ceramic` (MegaMenu line 35)
   - `/shop?category=soil`, `/shop?category=fertilizers`, etc. (MegaMenu)

3. **`/#testimonials` anchor link** — The HeroSection references `/#testimonials` but no section has `id="testimonials"`.

### 10.4 Semantic Markup

**Issues:**
1. **No `<nav>` for the category navigation in Header** — The nav bar (lines 372-394) does not use `<nav>` semantic element.
2. **No `<nav>` for the mobile menu** — The mobile drawer (lines 419-501) does not use `<nav>`.
3. **No `<address>` for contact info in Footer** — Contact details use generic `<div>`.

---

## 11. MISSING FEATURES ANALYSIS

### 11.1 Features That Should Be Present

1. **Pincode/City Delivery Checker** — For a local-only delivery business (Sonipat), a pincode input near the hero or product grid would let users verify delivery availability immediately. This is a common expectation for local e-commerce. The `PincodeChecker.tsx` component exists in `src/components/ui/` but is not used on the homepage.

2. **Live Plant Care Tips / Quick Care Badges** — Since this is a plant store, showing care difficulty level (easy/moderate/expert), pet-friendliness, and air-purifying tags on product cards would help purchase decisions. The `Product` type has these fields but they aren't displayed prominently.

3. **Seasonal/Trending Banner** — A dynamic promotion banner (not the rotating hero) for seasonal offers, new arrivals, or clearance sales.

4. **Estimated Delivery Date Badge** — "Free delivery by this Friday" on product cards for the Sonipat area.

5. **Bundle / Combo Offers Section** — Plant + planter + care kit combos are common in plant e-commerce.

6. **WhatsApp Chat Floating Button** — A persistent floating WhatsApp button (common in Indian e-commerce) that follows the user across all pages. Currently, WhatsApp is only in the FAQ section and Footer.

### 11.2 Features That Should NOT Be Added (Skip)

- Full product catalog on homepage (would overwhelm)
- Auto-playing video backgrounds (performance + UX cost)
- Pop-up modals on entry (high bounce risk)
- Countdown timers with fake urgency (trust erosion)

---

## 12. FINAL AUDIT SCORECARD

| Category | Score | Justification |
|----------|-------|---------------|
| **UI Design** | 6.5/10 | Good color palette and layout foundation, but plagued by inconsistency: 3+ card radius systems, hardcoded colors, unused CSS tokens, inaccessible accent color contrast. Lacks a cohesive design system despite strong individual section designs. |
| **UX** | 6.0/10 | Strong user journey flow with logical section progression. Suffers from broken links (`/providers`, `/become-provider`), no pincode checker, no sticky add-to-cart on mobile, hidden carousel arrows on touch, and fast autoplay. Information scent is good overall. |
| **Responsiveness** | 6.5/10 | Desktop and mobile layouts are functional. Tablet experience is suboptimal (no search bar, no nav links). Mobile touch targets too small (36px). Hero arrows hidden on touch. Product grid 2-column may be cramped. Bottom nav z-index and padding are handled. |
| **Accessibility** | 3.5/10 | **Critical issues:** Carousel has no ARIA landmarks or roles. FAQ accordion lacks `aria-expanded`. No skip-to-content link. Mobile menu has no focus trapping or dialog roles. Color contrast fails for orange accent. Missing focus indicators. |
| **Performance** | 4.5/10 | All sections are `'use client'` — massive JS bundle. No `next/image` leading to CLS and no image optimization. Material Symbols CDN loaded unnecessarily. Hero progress bar causes 50ms re-render cycle. No dynamic imports or lazy loading for below-fold sections. |
| **Code Quality** | 5.0/10 | Well-organized folder structure but significant technical debt: 40+ hardcoded hex values, dead code (ProviderCard, unused CSS tokens, empty services dir), fragile DOM query in search, code smell in page.tsx (dummy variable to force import). Two redundant Next.js projects in repo. |
| **Maintainability** | 4.5/10 | Hardcoded colors across files make rebranding expensive. Mock data directly imported means full rewrite for API integration. Duplicate font loading. Dead components (ProviderCard unused). Inconsistency between reusable UI components and inline implementations. |
| **Ecommerce Readiness** | 5.5/10 | Trust-building elements are present (reviews, guarantees, local focus). Critical gaps: no pincode checker, non-functional wishlist, broken provider links, no persistent security/trust badges above fold, no scarcity signals, no "Buy Now" option, no guest checkout indication. |
| **SEO** | 5.0/10 | Good heading hierarchy and metadata structure. **Critical gaps:** no JSON-LD structured data, no canonical URL, no hreflang for Hindi, broken internal links, missing routes, no FAQ schema despite having FAQSection. |

### Overall Score: 5.2/10

---

## CRITICAL ISSUES (Must Fix)

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| C1 | Hero carousel arrows invisible on mobile (no hover state) | `HeroSection.tsx:238,244` | **Touch users cannot navigate hero manually** — 100% of mobile users lose carousel control. |
| C2 | ARIA missing on hero carousel, FAQ accordion, tabs | `HeroSection.tsx`, `FAQSection.tsx`, `BestSellersSection.tsx:48-63` | Screen readers cannot interact with core page features. Legal risk under accessibility guidelines. |
| C3 | No `next/image` usage on homepage sections — layout shift | Multiple section files | Poor Core Web Vitals (CLS, LCP), no image optimization, SEO penalty. |
| C4 | All sections are `'use client'` — massive JS penalty | All 10 section + 5 global components | 15+ client components in one page. Bundle bloat, slow TTI, poor performance scores. |
| C5 | Dark green `#1A6B3C` hardcoded ~40+ times | Nearly every component | Maintenance nightmare. Single brand color change requires editing every file. |
| C6 | Broken links: `/providers`, `/become-provider`, `/#testimonials` | `ProvidersSection.tsx`, `HeroSection.tsx`, `Header.tsx`, `Footer.tsx` | 404 errors, broken user journeys, negative SEO signals. |
| C7 | No JSON-LD structured data | — | Missed rich results for Products, FAQs, LocalBusiness, Reviews. Significant SEO gap. |
| C8 | `page.tsx` dummy variables to force imports (code smell) | `page.tsx:16-17` | Indicates bundler issue misdiagnosis. Dead code runs on every page load. |
| C9 | Progress bar causes 20 re-renders/sec | `HeroSection.tsx:113-121` | Unnecessary CPU cost during autoplay. Battery drain on mobile. |
| C10 | Duplicate font loading (next/font + CDN link) | `layout.tsx:10-14,37-39` | Two font requests, defeats Next.js font optimization, render blocking. |

---

## MEDIUM PRIORITY ISSUES (Should Fix)

| # | Issue | File(s) |
|---|-------|---------|
| M1 | ProviderCard component (77 lines) is never used | `src/components/ui/ProviderCard.tsx` |
| M2 | Rating, Badge, Card, Button UI components not used on homepage | `src/components/ui/` |
| M3 | No error boundaries on any section | All sections |
| M4 | Orange accent `#E8930A` fails WCAG AA contrast on white | All components using accent |
| M5 | SearchSuggestionsOverlay fragile `querySelectorAll('[onMouseDown]')` | `SearchSuggestionsOverlay.tsx:119-126` |
| M6 | No pincode checker on homepage (component exists but unused) | — |
| M7 | `formatCurrency()` utility exists but never used on homepage | `ProductCard.tsx`, etc. |
| M8 | FAQ accordion has hardcoded `maxHeight: 300px` | `FAQSection.tsx:71` |
| M9 | No skip-to-content link | `layout.tsx` |
| M10 | Amazon-hosted product images (licensing risk) | `mockData.ts:370,373` |
| M11 | Hero CTA buttons too small (`text-xs md:text-sm`) | `HeroSection.tsx:216,223` |
| M12 | Wishlist toggle is local state only (not persisted) | `ProductCard.tsx:17,31-35` |
| M13 | Unused CSS custom properties and spacing tokens | `globals.css:57-68,74-84,86-99` |
| M14 | `src/services/` directory is empty | — |
| M15 | Sticky header has no `prefers-reduced-motion` support | `Header.tsx` |
| M16 | No `<nav>` semantic elements for header navigation | `Header.tsx:372-394` |
| M17 | No page-specific metadata on homepage | `page.tsx` |
| M18 | No active nav link indication | `Header.tsx` |
| M19 | Two redundant Next.js projects in repo (`firebase-account/`, `growplants-account/`) | Project root |
| M20 | Newsletter has fake subscription (1.6s setTimeout, no API call) | `NewsletterSection.tsx:16` |

---

## LOW PRIORITY ISSUES (Nice to Have)

| # | Issue | File(s) |
|---|-------|---------|
| L1 | No breadcrumb on homepage | — |
| L2 | Category grid items on mobile could use 1 column | `QuickCategoryGrid.tsx:35` |
| L3 | No sorting options on homepage product grid | `BestSellersSection.tsx` |
| L4 | Hero autoplay interval slightly fast (5s) | `HeroSection.tsx:111` |
| L5 | No `<address>` semantic element for footer contact | `Footer.tsx:29-45` |
| L6 | No `role="tab"` / `aria-selected` on filter tabs | `BestSellersSection.tsx:49-62` |
| L7 | Blog newsletter mini-prompt might confuse with main newsletter | `BlogPreviewSection.tsx:87-97` |
| L8 | Footer copyright says "2024" — update to 2026 | `Footer.tsx:136` |
| L9 | Material Symbols CDN loaded but seldom used on homepage | `layout.tsx:40` |
| L10 | No recently viewed products on homepage | — |
| L11 | CTA could use more persuasive copy (lack of urgency) | `HeroSection.tsx:215-226` |
| L12 | No `canonical` link tag | `layout.tsx` |
| L13 | No `hreflang` for Hindi despite bilingual support | — |
| L14 | HeroSection touch handlers use `useState` for gesture (could use refs) | `HeroSection.tsx:82-83` |
| L15 | `globals.css` duplicates some Tailwind utilities as custom classes | `globals.css:225-242,255-264` |

---

*This report identifies 9 Critical, 20 Medium, and 15 Low priority issues across the GrowPlants homepage. The strongest aspects are the logical section ordering, bilingual infrastructure, and attention to local market trust signals. The weakest areas are accessibility (3.5/10), performance (4.5/10), and code maintainability (4.5/10), driven primarily by systematic client-side rendering, hardcoded values, missing semantic ARIA, and absence of structured data.*
