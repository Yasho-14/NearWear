# NearWear Project Folder Structure

```
/
|-- docs/
|   |-- ARCHITECTURE.md             # System architecture & technical decisions
|   |-- DATABASE_ERD.md             # Entity Relationship Diagram & Data Dictionary
|   |-- IMPLEMENTATION_CHECKLIST.md # Master feature progress checklist
|   |-- PROJECT_STRUCTURE.md        # Folder & component roadmap
|
|-- prisma/
|   |-- schema.prisma               # Prisma relational data model definition
|   |-- seed.ts                     # Database seeder with realistic local boutiques
|   |-- dev.db                      # Local SQLite file database
|
|-- server/
|   |-- index.ts                    # Backend route definitions & controllers
|   |-- middleware/
|   |   |-- auth.ts                 # JWT verification & RBAC role guards
|   |-- routes/
|   |   |-- auth.ts                 # Authentication routes (login, register, me)
|   |   |-- stores.ts               # Boutique discovery & store CRUD
|   |   |-- products.ts             # Inventory & product catalog routes
|   |   |-- reservations.ts         # Try-On fitting room reservations
|   |   |-- orders.ts               # Checkout, order placement & fulfillment
|   |   |-- tailoring.ts            # Tailoring & custom styling requests
|   |   |-- analytics.ts            # Merchant & Admin analytics
|   |-- utils/
|   |   |-- db.ts                   # Prisma client singleton instance
|   |   |-- security.ts             # JWT signing and bcrypt helpers
|
|-- src/
|   |-- components/
|   |   |-- Navbar.tsx              # Top navigation bar with role badge & cart count
|   |   |-- RoleSwitcher.tsx        # Seamless role switcher (Customer, Merchant, Tailor, Admin)
|   |   |-- StoreCard.tsx           # Boutique preview card with distance and rating
|   |   |-- ProductCard.tsx         # Product card with try-on badge & quick action
|   |   |-- TryOnModal.tsx          # Fitting room reservation booking modal
|   |   |-- CartDrawer.tsx          # Slide-out shopping cart & checkout sheet
|   |   |-- TailoringModal.tsx      # Tailor alteration request modal
|   |   |-- StoreFilters.tsx        # Neighborhood, category & radius filter bar
|   |-- views/
|   |   |-- CustomerDiscovery.tsx   # Main shopper feed & boutique discovery
|   |   |-- StoreDetailView.tsx     # Boutique profile, hours, and store racks
|   |   |-- MerchantDashboard.tsx   # Store Owner inventory, fitting rooms & orders
|   |   |-- TailorDashboard.tsx     # Stylist & Tailor alteration workbench
|   |   |-- AdminDashboard.tsx      # Platform overview, metrics & store verification
|   |   |-- CustomerReservations.tsx# Shopper active try-on bookings & passes
|   |   |-- CustomerOrders.tsx      # Shopper order tracking & history
|   |-- context/
|   |   |-- AuthContext.tsx         # User authentication, token, and role context
|   |   |-- CartContext.tsx         # Persistent shopping cart context
|   |-- types/
|   |   |-- index.ts                # Shared TypeScript types & interfaces
|   |-- App.tsx                     # Main layout & view routing
|   |-- main.tsx                    # React client entry point
|   |-- index.css                   # Global styles & Tailwind CSS
|
|-- server.ts                       # Express + Vite development / production entrypoint
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
```
