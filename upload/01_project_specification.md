# GrowPlants - Project Specification

This document provides a comprehensive overview of the **GrowPlants** application's scope, core features, architecture, and technology stack. Feed this to GLM 5.2 to establish the high-level boundaries of the system.

---

## 1. Product Vision & Target Audience

**GrowPlants** is a location-based botanical e-commerce and gardening service marketplace tailored specifically for the Indian gardening ecosystem. 
* **Target Launch Region:** Sonipat, Haryana (India), with scaling parameters built for state-wide (Haryana) and national expansion.
* **Core Pillars:**
  1. **E-Commerce Store:** A curated, owner-managed marketplace for plants (indoor, outdoor, flowering, succulents), premium planters (ceramic, plastic, metal), and gardening materials (seeds, soil, tools, fertilizers).
  2. **Service Marketplace:** A platform where customers can book verified service providers (gardeners) for tasks like garden maintenance, balcony setup, landscaping, and plant health checkups.
  3. **Bilingual Experience:** A fully localized, client-side translation model supporting both English (EN) and Hindi (HI) languages, toggleable instantly at any stage of the application.
  4. **Roles Matrix:** 
     * **Customers:** Browse shop, book services, view orders, manage addresses/profile.
     * **Service Providers:** Apply to onboard, list offered services, check calendar bookings, view payouts.
     * **Admins:** Manage catalog, approve gardeners, oversee orders/bookings, process returns, handle logistics.

---

## 2. Platform Features Checklist

### A. Customer Portal
- [x] **Home Page:** Hero banner, category slider, collections, new arrivals, best sellers, trust badges, sitemap footer.
- [x] **Bilingual Localization:** English and Hindi support powered by Zustand and custom context.
- [x] **Product Catalog:** Shop page with filters (category, care difficulty, light needs, pet safety, price range).
- [x] **Product Details:** High-quality image carousel, care specifications (water, light, difficulty), similar products, reviews with media uploads, verified purchase badges.
- [x] **Cart & Drawer:** Sidebar Cart Drawer with free-shipping indicator (threshold: ₹499) and client-side persistence.
- [x] **Checkout & Address Management:** Secure multi-address selection, location pin picker, and Razorpay/COD gateways.
- [x] **Order Tracking:** Detailed order timelines (Pending → Confirmed → Processing → Out for Delivery → Delivered).
- [x] **Service Booking:** Browse gardeners and setup services, pick slot dates, specify address, write custom notes, book gardener.
- [x] **Account Settings:** Dashboard, order history, active bookings, wishlist, addresses, profiles, security center.

### B. Service Provider Portal
- [x] **Onboarding Form:** Name, business details, experience, city selector, ID uploads (Aadhar, PAN), service radius.
- [x] **Job Panel:** View active service bookings, history of jobs, verify payouts, and manage service listings.

### C. Admin Operations (Bypassed via server SDK or direct DB)
- [x] Onboard providers, check ID documents, approve/suspend profiles, manage stock levels, issue refunds, view analytical charts (page views, search terms).

---

## 3. Technology Stack

The application is architected as a hybrid stack to enable real-time updates on the client side while preserving rigid transactional consistency and relational integrity on the server side.

| Layer | Technologies Used | Description & Implementation Details |
|---|---|---|
| **Frontend UI** | **Next.js 16.2.7 (React 19.2.4)** | React Server Components (RSC) for page loading; client components for interactive segments. |
| **Language** | **TypeScript 5.x** | Strict typing for API payloads, contexts, and database rows. |
| **Styling** | **Tailwind CSS v4** | Utilizes CSS-based variable configurations (`@tailwindcss/postcss`). Custom theme colors (Light olive `#f7fbf0`, Dark pine text `#181d17`). |
| **Icons** | **Lucide React + Material Symbols** | Lucide React for UI elements; Material symbols CDN loaded in root layout for additional icons. |
| **Client State** | **Zustand + React Context** | Zustand manages the bilingual toggle dictionary. 7 React Contexts manage Auth, Cart, Wishlist, Address, Orders, User, and Settings. |
| **Forms & Validation**| **React Hook Form + Zod** | Handles forms (profile edit, addresses, reviews) with type-safe validations. |
| **Caching / Data Fetch**| **TanStack React Query v5** | Caches API calls on the client side to avoid redundant server round-trips. |
| **Primary Database** | **PostgreSQL** | Primary transaction-heavy relational database. |
| **ORM** | **Prisma 7.8.0** | Type-safe data client for querying PostgreSQL. Configured with seed scripts. |
| **Realtime Sync / Auth**| **Firebase Client SDK (12.14)** | Email/Password auth, real-time client-side sync of Cart, Wishlist, and Orders via Firestore. |
| **Server Admin SDK** | **Firebase Admin SDK (14.0)** | Performs server-side ID token verification, session JWT generation. |
| **Session Control** | **JWT (jsonwebtoken 9.0.3)** | Generates HTTP-only cookie-based tokens for server side routes verification. |
| **File Storage** | **Firebase Storage** | Saves user avatars, provider certificates, and invoice receipts. |
