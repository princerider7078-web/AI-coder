# GrowPlants - Hybrid Database Design

This document details the database architecture of **GrowPlants**. It uses a hybrid model:
1. **PostgreSQL (via Prisma ORM)**: Holds transaction-heavy relational tables (users, orders, bookings, catalog, inventory, payouts, reviews).
2. **Firebase Firestore (Client-side / Real-time)**: Stores real-time client state for offline capabilities (active carts, user addresses, live orders, wishlists).

---

## 1. PostgreSQL Relational Schema (Prisma)

The full, production-ready schema is located in [schema.prisma](file:///c:/Users/laptop%20care/Desktop/GROWPLANTS_WEBAPP/prisma/schema.prisma). It contains **35+ models** and **12 custom Enums**.

### Core Enums
* `Role`: `CUSTOMER`, `ADMIN`, `PROVIDER`
* `UserStatus`: `ACTIVE`, `SUSPENDED`, `DELETED`
* `VerificationStatus`: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`
* `ServiceType`: `ONE_TIME`, `RECURRING`, `SUBSCRIPTION`
* `PricingType`: `FIXED`, `HOURLY`, `QUOTE_BASED`
* `BookingStatus`: `PENDING`, `CONFIRMED`, `PROVIDER_ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW_PROVIDER`, `NO_SHOW_CUSTOMER`, `DISPUTED`
* `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIAL_REFUND`
* `PaymentMethod`: `RAZORPAY`, `COD`, `WALLET`
* `OrderStatus`: `PENDING`, `CONFIRMED`, `PROCESSING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `RETURN_REQUESTED`, `RETURN_APPROVED`, `RETURN_COMPLETED`, `REFUNDED`

### Primary Models & Key Attributes
Below is a map of the core Prisma models to guide GLM 5.2:

* **User (`users`)**:
  * Fields: `id` (UUID PK), `name`, `email` (unique), `phone` (unique), `passwordHash`, `role` (Role Enum), `status` (UserStatus Enum), `avatar`, `gender`, `preferredLanguage`, `createdAt`, `updatedAt`.
  * Relations: Has many `Address`, `Session`, `Order`, `Review`, `Booking`, and optional `ServiceProvider` / `CustomerProfile`.
* **Product (`products`)**:
  * Fields: `id` (PK), `name`, `slug` (unique), `sku` (unique), `basePrice`, `sellingPrice`, `costPrice`, `difficultyLevel` (care needs), `status` (Active/Inactive), `featured` (Boolean).
  * Relations: Belongs to `Category`, has many `ProductImage`, `ProductVariant`, `Inventory`, `Review`.
* **Category (`categories`)**:
  * Fields: `id` (PK), `name`, `slug` (unique), `parentId` (self-referencing self-join).
* **Inventory (`inventory`)**:
  * Fields: `id`, `productId`, `availableStock`, `reservedStock`, `soldStock`, `reorderLevel`.
* **Order (`orders`)**:
  * Fields: `id`, `orderNumber` (unique), `userId`, `addressId`, `subtotal`, `shippingCharge`, `discount`, `grandTotal`, `paymentMethod`, `paymentStatus`, `orderStatus`.
  * Relations: Belongs to `User`, `Address`. Has many `OrderItem`, `OrderStatusHistory`.
* **ServiceProvider (`providers`)**:
  * Fields: `id`, `userId` (unique), `businessName`, `experienceYears`, `status` (VerificationStatus Enum), `city`, `approvalDate`.
  * Relations: Belongs to `User`, has many `Service`, `Booking`, `ProviderEarning`.
* **Booking (`bookings`)**:
  * Fields: `id`, `userId`, `providerId`, `serviceId`, `addressId`, `bookingDate`, `status` (BookingStatus Enum), `notes`.
  * Relations: Belongs to `User`, `ServiceProvider`, `Service`, `Address`.

---

## 2. Firebase Firestore Database Schema

Firestore acts as a high-speed, real-time caching and synchronization layer for customer profiles and active client sessions (cart, wishlist).

### `users` Collection
* **Document ID**: `{uid}` (Matches the Firebase Auth user ID and Prisma user UUID).
* **Document Schema**:
  ```json
  {
    "uid": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "profileImage": "string or null",
    "memberSince": "Timestamp",
    "preferences": {
      "notifications": { "email": "boolean", "sms": "boolean", "push": "boolean" },
      "darkMode": "boolean",
      "language": "en" | "hi"
    },
    "addresses": [
      {
        "id": "string",
        "fullName": "string",
        "phone": "string",
        "houseNumber": "string",
        "street": "string",
        "city": "string",
        "state": "string",
        "pincode": "string",
        "latitude": "number or null",
        "longitude": "number or null",
        "isDefault": "boolean"
      }
    ],
    "wishlist": [
      {
        "id": "string",
        "productId": "string",
        "name": "string",
        "price": "number",
        "image": "string",
        "inStock": "boolean",
        "addedAt": "Timestamp"
      }
    ],
    "cart": [
      {
        "id": "string",
        "productId": "string",
        "variantId": "string",
        "name": "string",
        "price": "number",
        "image": "string",
        "quantity": "number",
        "inStock": "boolean",
        "addedAt": "Timestamp"
      }
    ]
  }
  ```

### `orders` Collection
* **Document ID**: `{orderId}` (Matches SQL order ID).
* **Document Schema**:
  ```json
  {
    "orderId": "string",
    "userId": "string",
    "orderPlacedAt": "Timestamp",
    "paymentMethod": "string",
    "paymentStatus": "string",
    "name": "string",
    "phone": "string",
    "addressDetails": {
      "house": "string",
      "street": "string",
      "city": "string",
      "state": "string",
      "pincode": "string"
    },
    "products": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        "quantity": "number",
        "image": "string"
      }
    ],
    "subtotal": "number",
    "shippingFee": "number",
    "totalAmount": "number",
    "orderStatus": "string"
  }
  ```

---

## 3. Seeding Database

The seeder script in [seed.ts](file:///c:/Users/laptop%20care/Desktop/GROWPLANTS_WEBAPP/prisma/seed.ts) populates:
1. **Users**: Creates default customers, gardeners, and admins.
2. **Categories & Products**: Loads category trees and feeds static catalog details from [plants-data.json](file:///c:/Users/laptop%20care/Desktop/GROWPLANTS_WEBAPP/src/data/plants-data.json) and [pots-data.json](file:///c:/Users/laptop%20care/Desktop/GROWPLANTS_WEBAPP/src/data/pots-data.json).
3. **Services**: Configures basic gardening options.
4. **Reviews**: Creates dummy reviews for testing.

Provide [schema.prisma](file:///c:/Users/laptop%20care/Desktop/GROWPLANTS_WEBAPP/prisma/schema.prisma) and [seed.ts](file:///c:/Users/laptop%20care/Desktop/GROWPLANTS_WEBAPP/prisma/seed.ts) directly to GLM 5.2 to initialize the schema and populate the database.
