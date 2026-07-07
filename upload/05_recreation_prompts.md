# GrowPlants - Step-by-Step GLM 5.2 Reconstruction Prompts

This document provides a copy-paste sequence of AI prompts that you can input to GLM 5.2. Follow these steps in order to code the entire application progressively.

---

### Prompt 1: Project Setup & Package Configurations
**Instructions:** Paste this prompt into GLM 5.2 to initialize the project shell and dependencies.
```text
Initialize a new Next.js 16 application with TypeScript, Tailwind CSS v4, and App Router.
1. Create a `package.json` with the following key dependencies:
   - "next": "16.2.7"
   - "react": "19.2.4"
   - "react-dom": "19.2.4"
   - "@prisma/client": "^7.8.0"
   - "@tanstack/react-query": "^5.101.0"
   - "firebase": "^12.14.0"
   - "firebase-admin": "^14.0.0"
   - "jsonwebtoken": "^9.0.3"
   - "bcryptjs": "^3.0.3"
   - "zod": "^4.4.3"
   - "zustand": "^5.0.14"
   - "lucide-react": "^1.17.0"
   - "react-hook-form": "^7.77.0"
   - "class-variance-authority": "^0.7.1"
   - "tailwind-merge": "^3.6.0"
2. Configure `tsconfig.json` to support paths mapping `@/*` to `./src/*`.
3. Configure `postcss.config.mjs` with `@tailwindcss/postcss` and create `src/app/globals.css` with basic Tailwind imports.
4. Establish the theme colors: Background olive (`#f7fbf0`) and text pine (`#181d17`) as CSS variables or tailwind utility presets.
5. Create `.env` and `.env.local` templates in the root directory.
```

---

### Prompt 2: Database Schema & Seeding (PostgreSQL + Prisma)
**Instructions:** Run this prompt after the packages are initialized. Upload `prisma/schema.prisma` and `prisma/seed.ts` along with this prompt.
```text
Configure the Prisma database connection layer for PostgreSQL.
1. Set up the schema models defined in the uploaded `prisma/schema.prisma` file, including models like User, CustomerProfile, Address, Category, Product, ProductImage, ProductVariant, Inventory, Cart, Order, OrderItem, ServiceProvider, Service, and Booking.
2. Build the singleton client connector at `src/lib/prisma.ts` ensuring that PrismaClient is only instantiated once globally in development environments.
3. Write a database seeding file at `prisma/seed.ts` that:
   - Sets up default ENUM status entries.
   - Seed categories (Plants, Planters, Tools, Seeds, Fertilizers) and populates them using catalog details.
   - Populates initial products using standard structures for plants (care levels, sunlight, water req, pet safety) and planters.
   - Seed default services (Gardening Maintenance, Lawn Setup) and initial User roles (Admin, Provider, Customer).
```

---

### Prompt 3: Firebase Integration Layer (Client & Admin SDKs)
**Instructions:** Paste this prompt to create the Firebase integration utilities.
```text
Set up the Firebase client and admin utility integration layers at `src/lib/firebase/`.
1. In `client.ts`, configure the Firebase Client SDK using the following environment parameters:
   - NEXT_PUBLIC_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID.
   - Verify connection logic to support local Auth and Firestore emulators during development.
2. In `auth.ts`, implement Firebase Client authentication helper wrappers:
   - `signUpWithEmailPassword()`, `signInWithEmailPassword()`, `signOutUser()`, `resetUserPassword()`.
3. In `firestore.ts`, create Firestore CRUD functions matching the interfaces FirestoreUser, FirestoreAddress, FirestoreCartItem, and FirestoreWishlistItem.
4. In `admin.ts`, configure the Firebase Admin SDK using variables:
   - FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY.
   - Provide helper `verifyIdToken(token)` to authorize server side API requests.
5. In `storage.ts`, implement profile image upload tasks targeting Firebase Storage.
```

---

### Prompt 4: React Context Providers & Zustand Bilingual Store
**Instructions:** Paste this prompt to implement frontend state synchronizations.
```text
Build the global contexts and stores under `src/contexts/` and `src/store/`.
1. Create a Zustand store `src/store/useBilingual.ts` containing:
   - An English dictionary and a Hindi dictionary supporting keys like `nav_home`, `hero_title`, `btn_shop_plants`, `btn_book_service`, etc.
   - A state variable `language` ('en' | 'hi'), helper `t(key)` for dictionary lookups, and action `setLanguage(lang)` to trigger instant language switching.
2. Build the following React context providers under `src/contexts/`:
   - `AuthContext.tsx`: Manages the current Firebase authenticated user state and syncs it with the server session.
   - `UserContext.tsx`: Syncs the active Firestore user profile.
   - `CartContext.tsx`: Dual-sync cart state. Reads from localStorage for guest sessions, and automatically uploads/syncs with Firestore users collection on login.
   - `WishlistContext.tsx`: Tracks favorited items.
   - `AddressContext.tsx`: Manages user addresses.
   - `OrdersContext.tsx`: Real-time order update listener connecting to Firestore.
3. Wrap all providers inside `src/components/AppProviders.tsx` and load it inside the root layout.
```

---

### Prompt 5: Layout shell (Header, BottomNav, Footer & CartDrawer)
**Instructions:** Paste this prompt to establish the visual foundation of the app.
```text
Create the global layout components inside `src/components/global/` and implement the main root layout.
1. Create `AnnouncementBar.tsx`: A top bar showing promotional offers, localized in English & Hindi.
2. Create `Header.tsx`: A desktop header featuring a Logo, Pincode coverage checker, searchable input area, bilingual language toggle switch, and buttons for Wishlist, Cart (with bubble count), and Account. Include `MegaMenu.tsx` for categories.
3. Create `CartDrawer.tsx`: A slide-out cart sidebar listing items, quantity buttons, and progress indicators showing how much more to add to reach the ₹499 free delivery threshold.
4. Create `Footer.tsx`: A beautiful multi-column footer displaying columns for shop links, services, quick support links, trust badges, payment badges, and social media links.
5. Create `MobileBottomNav.tsx`: A bottom navigation bar for mobile viewports displaying buttons for Home, Shop, Services, Cart, and Account.
6. Assemble these inside `src/app/layout.tsx` using Inter font and styling the body background with a premium light olive tone (`#f7fbf0`).
```

---

### Prompt 6: API Endpoint Handlers & Server Session Middleware
**Instructions:** Paste this prompt to create the REST API routes.
```text
Implement the backend routes under `src/app/api/` and server-side authentication library.
1. Write `src/lib/auth.ts`: Functions to sign JWT cookies on login and verify JWT cookies on request routes.
2. Create route handlers for JWT-based local authentication:
   - `/api/auth/register`: Receives email, password, phone, name; hashes password; saves user in Postgres via Prisma.
   - `/api/auth/login`: Validates user credentials, creates a session in Postgres, and sets HTTP-only cookies containing the JWT.
   - `/api/auth/logout`: Clears the JWT session cookie.
   - `/api/auth/me`: Decodes JWT cookie, queries matching PostgreSQL user row, and returns profile details.
3. Implement dynamic routes for products and categories:
   - `/api/categories`: Returns catalog category tree structure.
   - `/api/products`: Returns list of products with support for filter flags (categories, difficulty, water, lights, search, price range).
   - `/api/products/[slug]`: Resolves detailed single product database specifications.
4. Implement addresses CRUD routes at `/api/addresses`:
   - Handles GET (retrieve all user addresses), POST (add new address), PATCH (edit address), and DELETE.
```

---

### Prompt 7: Product Catalog Shop & Dynamic Details Page
**Instructions:** Paste this prompt to build the product views.
```text
Create the shop catalog interfaces in the frontend.
1. Build `src/app/shop/page.tsx`:
   - A sidebar filter showing Category check boxes, Care difficulty level (Easy, Medium, Expert), Sunlight requirements (Low, Medium, High), Pet Safety toggles, and Price Range sliders.
   - A grid layout displaying cards with high-quality images, titles, pricing (with MRP discount tags), ratings, and a quick "Add to Cart" button.
2. Build `src/app/product/[slug]/page.tsx`:
   - An SSR-optimized detail layout.
   - Interactive image carousel.
   - Meta specification section: care indicators (water schedule, sun requirements, pet safety, difficulty).
   - Rating histogram summaries, verified buyer reviews list, similar products slider, and review submission form using react-hook-form.
```

---

### Prompt 8: Checkout Workflow & Order Confirmation
**Instructions:** Paste this prompt to build checkout operations.
```text
Implement the Checkout and Order management frontend.
1. Build `src/app/cart/page.tsx`: Detailed shopping cart overview with product list, quantity adjusters, and checkout summary details.
2. Build `src/app/checkout/page.tsx`:
   - Address selector workspace with "Add New Address" modal.
   - Integrated Pincode Coverage validator (verifying if pincode is within serviceable gardening slots in Sonipat/Haryana).
   - Itemized checkout review table.
   - Payment method selectors (Razorpay simulator button or Cash on Delivery).
   - On payment success, issues order, reduces Postgres product inventory, saves order in Postgres + Firestore, and redirects to confirmation.
3. Build `src/app/order-confirmation/[orderId]/page.tsx`:
   - Confirmed order details layout.
   - Order receipt download link.
   - Order status timeline tracking component (Pending, Confirmed, Shipped, Delivered).
```

---

### Prompt 9: Gardening Service Booking & Provider marketplace
**Instructions:** Paste this prompt to create the service booking modules.
```text
Build the services booking and gardening marketplace module.
1. Build `src/app/services/page.tsx`:
   - Catalogs gardening services: Balcony Setup, Terrace Garden Setup, Gardener Maintenance, Lawn Care, Plant Health Check.
   - Renders descriptions, pricing parameters (Hourly/Fixed), and a "Book Service" action button.
2. Implement a booking scheduler modal:
   - Calendar date picker, time slot selector (Morning/Evening), address selector, and custom gardener instructions text area.
   - Saves bookings to PostgreSQL and synchronizes with provider calendars.
3. Build `src/app/become-provider/page.tsx`: Onboarding form for gardeners to apply. Collects name, details, ID uploads (Aadhar/PAN files), and service radius.
4. Build `src/app/provider/page.tsx`: Dashboard for verified providers to check assigned tasks, job calendar, customer notes, and monthly payout statements.
```

---

### Prompt 10: Accounts Dashboard & Security Center
**Instructions:** Paste this prompt to complete the profile settings interface.
```text
Implement the user settings workspace under `src/app/account/`.
1. Create `src/app/account/layout.tsx` to provide a dashboard navigation sidebar containing: Overview, Order History, Active Bookings, Wishlist, Address Book, Profile Details, and Security.
2. Implement components for:
   - `dashboard/page.tsx`: High-level summary of active cart items, total orders, favorited plants, and recent bookings.
   - `profile/page.tsx`: Form validating email, name, avatar upload, gender, DOB, and preferred language.
   - `addresses/page.tsx`: Grid listing saved addresses with "Set Default" checkmark tools and deletion buttons.
   - `settings/page.tsx`: System preferences (Dark/Light mode, language selection, marketing consents).
   - `security/page.tsx`: Forms for change password operations, logging device histories, and logging out sessions.
```
