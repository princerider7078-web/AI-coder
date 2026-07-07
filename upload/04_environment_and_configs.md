# GrowPlants - Environment & Configurations

This document details the configuration files and environment variables needed to build and run the **GrowPlants** app. Feed this to GLM 5.2 to configure the project's foundation.

---

## 1. Environment Variables Templates

### Server-Side Variables (`.env`)
Create a `.env` file in the root of the project:
```bash
# PostgreSQL database url (Neon, RDS, or local Postgres)
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# JWT token secret keys for server session control
JWT_SECRET="growplants-super-secret-jwt-key-2026"
JWT_REFRESH_SECRET="growplants-super-secret-refresh-jwt-key-2026"

# Next Public variables
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Firebase Client & Admin Config (`.env.local`)
Create a `.env.local` file in the root of the project:
```bash
# Firebase Client Config (exposed to browser)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

# Firebase Admin Config (server-only, never exposed to browser)
FIREBASE_ADMIN_PROJECT_ID="your-project-id"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Optional: Firebase Local Emulator Suite
# FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
# FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
# FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

---

## 2. Configuration Files

### Next.js Configurations (`next.config.ts`)
Ensures that standard paths compile and remote images load from verified Indian gardening sites.
```typescript
import type { NextConfig } from "next";
import path from "node:path";

const domains = [
  "5.imimg.com",
  "amd.deodap.com",
  "cdn.mos.cms.futurecdn.net",
  "dukaan.b-cdn.net",
  "encrypted-tbn0.gstatic.com",
  "encrypted-tbn2.gstatic.com",
  "encrypted-tbn3.gstatic.com",
  "gardengram.in",
  "ilovenursery.com",
  "images.meesho.com",
  "littleveggiepatchco.com.au",
  "m.media-amazon.com",
  "nativejungleplants.com",
  "naturealive.in",
  "nurserylive.com",
  "nurserynisarga.in",
  "nurturinggreen.in",
  "plantsguru.com",
  "res.cloudinary.com",
  "rukminim1.flixcart.com",
  "rukminim2.flixcart.com",
  "storage.googleapis.com",
  "www.ugaoo.com",
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: domains.map((domain) => ({
      protocol: "https",
      hostname: domain,
    })),
  },
};

export default nextConfig;
```

### PostCSS Config (`postcss.config.mjs`)
Uses Tailwind CSS v4's direct compiler:
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

## 3. Firebase Security Rules

### Firestore Security Rules (`firestore.rules`)
```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // USERS COLLECTION
    // Users can read/write their own document (which contains addresses, cart, wishlist, orders as arrays)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // ORDERS COLLECTION
    // Users can create their own orders (client-side write for reliability).
    // Reads allowed only for the owning user.
    // Admin SDK (server-side) bypasses these rules entirely.
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if false; // Only Admin SDK can modify/delete
    }
  }
}
```

### Storage Security Rules (`storage.rules`)
```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Profile images - users can only upload/update their own
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    // Product images - public read, admin write
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only admin
    }

    // Order invoices - users can only read their own
    match /invoices/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only admin
    }
  }
}
```
