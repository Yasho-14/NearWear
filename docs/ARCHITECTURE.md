# NearWear Architecture Document

## 1. System Overview
**NearWear** is a full-stack, hyperlocal fashion and boutique discovery platform connecting shoppers with local neighborhood apparel stores, artisan tailors, and independent stylists. The platform bridges the physical-digital gap with features like:
- Hyperlocal store discovery by neighborhood and distance
- Real-time in-store inventory browsing
- Fitting room "Try-Before-You-Buy" reservation booking
- Custom tailoring and alteration request tracking
- Unified checkout for in-store pickup and local delivery
- Role-Based Access Control (RBAC) with dedicated dashboards for Customers, Store Owners, Stylists/Tailors, and Platform Admins

---

## 2. High-Level Architecture
```
+-------------------------------------------------------------+
|                        Client Layer                         |
|  React 19 + TypeScript + Tailwind CSS + Lucide Icons        |
|  - Customer Fashion Hub & Discovery View                    |
|  - Fitting Room Try-On Reservation Booking Modal            |
|  - Merchant / Boutique Management Portal                    |
|  - Stylist & Tailor Alterations Workflow                    |
|  - Admin Platform Oversight & Governance                    |
+-------------------------------------------------------------+
                               |
                               | (REST API / Bearer JWT)
                               v
+-------------------------------------------------------------+
|                        Server Layer                         |
|  Express 4 + tsx + Vite Middleware (server.ts)              |
|  - Auth & RBAC Middleware (/api/auth)                       |
|  - Boutique & Catalog Router (/api/stores, /api/products)   |
|  - Reservation Engine (/api/reservations)                   |
|  - Order Fulfillment Router (/api/orders)                   |
|  - Alteration & Styling Service (/api/tailoring)            |
|  - Analytics & Audit Controller (/api/analytics)            |
+-------------------------------------------------------------+
                               |
                               | (Type-safe ORM queries)
                               v
+-------------------------------------------------------------+
|                     Data Persistence Layer                  |
|  Prisma ORM + Embedded SQLite / PostgreSQL Engine           |
|  - File-backed ACID storage (`prisma/dev.db`)               |
|  - Strict relational foreign keys & indices                 |
|  - Deterministic migrations & seed pipeline                 |
+-------------------------------------------------------------+
```

---

## 3. Tech Stack Breakdown
| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | High-performance reactive UI with modular hooks |
| **Styling** | Tailwind CSS v4 + Motion | Modern aesthetics, responsive grid, zero-clutter layout |
| **Icons** | Lucide React | Accessible, lightweight iconography |
| **Backend Runtime** | Node.js v22 + Express 4 | Robust REST API server with JWT authentication |
| **ORM / Data Access** | Prisma Client 8 | Type-safe schema definition and relational migrations |
| **Database** | SQLite / PostgreSQL compatible | File-based local ACID persistence for zero-friction hosting |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs | Secure password hashing, token validation, RBAC |
| **Dev Environment** | Vite + tsx | Integrated dev server with port 3000 mapping |

---

## 4. Role-Based Access Control (RBAC)
NearWear enforces 4 distinct roles:
1. **`CUSTOMER` (Default)**:
   - Search & discover nearby boutiques.
   - Filter catalog by distance, neighborhood, size, category, and try-on readiness.
   - Book in-store fitting room appointments.
   - Order items for in-store pickup or local delivery.
   - Submit garments for tailoring and track alteration progress.
   - Write reviews with fit ratings (`RUNS_SMALL`, `TRUE_TO_SIZE`, `RUNS_LARGE`).

2. **`STORE_OWNER` (Merchant)**:
   - Manage boutique profile, operating hours, geolocation, and contact info.
   - CRUD inventory items, variants (sizes, colors), and try-on eligibility.
   - Accept, reschedule, or complete try-on fitting room reservations.
   - Manage order fulfillment lifecycle (Pending -> Processing -> Ready -> Delivered).
   - View revenue, reservation conversion rates, and inventory velocity.

3. **`STYLIST` / `TAILOR`**:
   - Offer alteration, custom fitting, and styling services.
   - Review incoming tailoring requests and measurements.
   - Provide estimates, quotes, and milestone status updates.

4. **`ADMIN`**:
   - Oversee all boutiques, verify legitimate storefronts.
   - Platform-wide GMV, active reservation, and user audit metrics.
   - Moderate reviews and manage categories.
