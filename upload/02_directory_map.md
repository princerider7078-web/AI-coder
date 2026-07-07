# GrowPlants - Directory Map & Code Structure

This document catalogs the folders and files in `src/` to guide GLM 5.2 in reproducing the folder structure.

---

## 1. Directory Tree Overview

```
src/
├── app/                  # Next.js App Router (Pages, Layouts, CSS, and REST API routes)
├── components/           # Reusable UI widgets and layout modules (global, sections, ui, products)
├── contexts/             # React Context Providers for global features and data sync
├── data/                 # Static catalog data (JSON databases for plants and pots)
├── hooks/                # Custom React hooks (addresses, profile, orders, account)
├── lib/                  # Library bindings (Prisma, Firebase SDK, Firebase Admin, utilities)
├── store/                # Zustand stores (language/bilingual translation dictionaries)
└── types/                # TypeScript interfaces and module overrides
```

---

## 2. Next.js Routing Structure (`src/app/`)

The application implements standard Next.js file-based routing:

* **`/` (Root page)**: `page.tsx` renders the landing page, incorporating slider sections, new arrivals, gardener profiles, testimonials, and SEO tags.
* **`/about`**: Renders Sonipat-focused botanical store brand story and mission statement.
* **`/contact`**: Interactive form that submits message parameters to `/api/contact`.
* **`/faq`**: A collapsible accordian checklist addressing common order/delivery queries.
* **`/terms`**, **`/privacy-policy`**, **`/refund-policy`**: Public legal guidelines.
* **`/login`**: Houses the toggleable login & registration panel, linking directly to Firebase Auth.
* **`/shop`**: Catalog search workspace with active filter panels.
* **`/product/[slug]`**: Dynamic route displaying comprehensive specs of a plant or pot, rating histograms, and similar items.
* **`/cart`**: Summary view of items.
* **`/checkout`**: Payment gate option panel with integrated pincode check and address picker.
* **`/order-confirmation/[orderId]`**: Renders final receipt, shipping metrics, and delivery timelines.
* **`/providers`**: A registry directory listing verified local gardeners.
* **`/services`**: Catalogs available gardening services, service descriptions, and booking button.
* **`/become-provider`**: Multi-step onboarding application form for local gardeners.
* **`/provider`**: Work portal dashboard where approved gardeners manage bookings and payouts.
* **`/account/`**: Nested account dashboard workspace:
  * `layout.tsx`: Side panel menu framework (Dashboard, Orders, Wishlist, Addresses, Settings, Security).
  * `dashboard/page.tsx`: Snapshot of active orders, latest reviews, profile summary.
  * `orders/page.tsx`: Historial orders list with invoice downloads.
  * `wishlist/page.tsx`: Grid list of favorited products.
  * `addresses/page.tsx`: Location management workspace.
  * `profile/page.tsx`: Form for updating contact and biological profile details.
  * `settings/page.tsx`: Light/Dark mode toggles, notifications configurations.
  * `security/page.tsx`: Password reset tool.

---

## 3. Server Endpoints (`src/app/api/`)

REST API endpoints built inside Next.js routes, integrating with PostgreSQL (via Prisma) or returning fallback mock lists:

- **`/api/auth/register`**: Hashes passwords using `bcryptjs` and inserts users into PostgreSQL.
- **`/api/auth/login`**: Verifies user email in Prisma, issues secure HTTP-only cookies storing user session JWTs.
- **`/api/auth/logout`**: Clears the JWT session cookies on browser environments.
- **`/api/auth/me`**: Parses JWT token cookie, extracts matching profile details from the database.
- **`/api/auth/revoke-tokens`**: Standard endpoint to revoke user Firebase tokens.
- **`/api/account/profile`**: Processes profile information edits in Prisma.
- **`/api/addresses`**: Handles standard CRUD operations (GET, POST, PATCH, DELETE) for addresses in the PostgreSQL database.
- **`/api/categories`**: Lists product categories tree.
- **`/api/products`**: Serves paginated, filtered, and searched lists of products.
- **`/api/products/[slug]`**: Resolves individual product specs.
- **`/api/products/[slug]/similar`**: Queries similar products matching target product category slug.
- **`/api/products/[slug]/reviews`**: Retrieves product-specific reviews.
- **`/api/products/[slug]/submit-review`**: Inserts a new review, updates average ratings in PostgreSQL.
- **`/api/services`**: Returns catalog of available gardening services.
- **`/api/services/[slug]`**: Returns target service specifications.
- **`/api/services/providers`**: Lists onboarded gardening specialists.
- **`/api/bookings`**: Processes service booking operations.
- **`/api/cart`**: Server-side sync endpoint for shopping cart backups.
- **`/api/wishlist`**: Operations to toggle user favorites.
- **`/api/orders`**: Server-side creation of orders, handles transaction status and address tracking.
- **`/api/contact`**: Receives contact form tickets.

---

## 4. Front-End Core Configurations

### Zustand Bilingual Store (`src/store/useBilingual.ts`)
Houses translation keys for English (`en`) and Hindi (`hi`). State contains `language` ('en' | 'hi'), `t()` (translation lookup function), and `setLanguage()` action. Crucial for enabling bilingual UI.

### React Contexts (`src/contexts/`)
- **`AuthContext.tsx`**: Tracks Firebase auth state (`user`), handles `login`, `register`, `logout` and session initialization.
- **`UserContext.tsx`**: Synchronizes current user Firestore profiles.
- **`CartContext.tsx`**: Manages shopping cart items, quantities, subtotal calculations, and synchronizes to local storage or Firestore depending on login status.
- **`WishlistContext.tsx`**: Manages wishlist arrays.
- **`AddressContext.tsx`**: Handles client CRUD queries for addresses.
- **`OrdersContext.tsx`**: Connects real-time snapshots to active customer orders.
- **`SettingsContext.tsx`**: Handles dark mode toggles and site options.

### Shared Lib Utilities (`src/lib/`)
- **`prisma.ts`**: Implements a global singleton PrismaClient to avoid exhausting Postgres connection pools.
- **`auth.ts`**: Encapsulates JWT encoding, decoding, verification, and cookie serialization.
- **`toast.ts`**: Creates on-the-fly toast alerts inside the DOM (no external dependencies).
- **`utils.ts`**: Standard Tailwind merging utilities (`cn`) and decimal formats.
- **`firebase/`**: Contains initialization logic for standard Firebase, Firestore schema arrays, and Admin SDK scopes.
