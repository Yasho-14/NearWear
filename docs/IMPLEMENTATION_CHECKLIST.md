# NearWear Implementation Checklist

## Master Phase Checklist

### Phase 1: Foundations, Backend Core & Authentication [CURRENT]
- [x] Workspace inspection, framework validation & dependency resolution
- [x] Architecture document, ERD, and folder structure specification
- [x] Prisma schema setup with User, Store, Product, TryOnReservation, Order, OrderItem, TailoringRequest, Review
- [x] SQLite / Prisma database migration pipeline & persistent storage
- [x] Full-stack Express server (`server.ts`) mounting Vite middleware
- [x] Authentication & RBAC engine:
  - Password hashing with `bcryptjs`
  - JWT token generation & verification middleware
  - Role switcher helper for instant testing across 4 roles (Customer, Store Owner, Stylist, Admin)
  - Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/switch-role`
- [x] Comprehensive database seeder with realistic boutique stores, products, inventory, reservations, and sample orders
- [x] End-to-end TypeScript compilation & unit tests for core logic (`npx tsx --test`)

### Phase 2: Boutique Discovery & Real-Time Local Catalog
- [x] Store directory API (`/api/stores`) with filtering by neighborhood, category, search, and distance
- [x] Product catalog API (`/api/products`) with filters: category, gender, size, try-on availability, in-stock
- [x] Store detail page with store hero, operational hours, map coordinates, verified badge, and product showcase
- [x] Product quick-view and detail view with size selector, color selector, and stock indicator

### Phase 3: Fitting Room "Try-Before-You-Buy" Reservation System
- [x] Reservation booking API (`/api/reservations`) with time-slot selection and fitting room allocation
- [x] Customer Try-On modal with date picker, time slot chips, and size preference notes
- [x] Merchant Fitting Room Management: accept reservation, assign fitting room cabin, mark as completed or cancelled
- [x] Customer "My Try-Ons" pass with QR/confirmation code and boutique directions

### Phase 4: Order Checkout & Fulfillment Pipeline
- [x] Cart state management with in-store pickup and local delivery support
- [x] Order placement API (`/api/orders`) with multi-item order lines and stock verification
- [x] Store Owner Order Management dashboard: status transitions (Pending -> Preparing -> Ready -> Delivered)
- [x] Customer Order History with live status tracker

### Phase 5: Tailoring & Stylist Custom Requests
- [x] Tailoring request creation API (`/api/tailoring`) with custom measurements and garment details
- [x] Stylist / Tailor workspace: browse open alteration requests, submit price quotes, update progress milestones
- [x] Customer alteration status tracking card

### Phase 6: Verified Fit Reviews & Analytics
- [x] Verified reviews API (`/api/reviews`) with fit indicators (Runs Small, True to Size, Runs Large)
- [x] Boutique Analytics API (`/api/analytics`) tracking GMV, reservation-to-sale conversion rate, and popular items
- [x] Platform Admin Governance view
