# MakerBench — Master Technical Specification & Production Architecture

## 1. Executive Security Audit & Architectural Upgrades

| Feature Area | Original Spec Risk | Production-Grade Mitigation & Security Requirement |
| :--- | :--- | :--- |
| **Project API & Access Control** | **BOLA / IDOR:** Unprotected `/api/projects/:id` endpoints allow unauthorized users to modify or fetch arbitrary projects. | Strict JWT ownership middleware verifying `project.ownerId === req.user.id`. Reject unverified requests with `403 Forbidden`. |
| **Marketplace Currency** | **Floating Point Drift:** Storing prices as `float` (e.g. `$19.99` as `19.99`) causes precision errors during payout calculations. | Store all monetary values as **integers in cents** (e.g., `$19.99` -> `1999`). |
| **Stripe Webhooks** | **Replay & Spoofing:** Insecure webhook routes allow fake `checkout.session.completed` events. | Verify HMAC signatures using `express.raw({ type: 'application/json' })`. Enforce DB transaction locks on `stripePaymentIntentId` for idempotency. |
| **File Storage (S3/R2)** | **Bandwidth Exhaustion / Malware:** Uploading project files through API endpoints creates memory bottlenecks. | Use **S3 Presigned URLs** for direct browser-to-bucket uploads with strict MIME-type checks (`image/png`, `model/stl`) and a 10MB cap. |
| **Codeblocks Engine** | **Main-Thread DoS:** Infinite loops in user-designed Blockly code freeze the browser thread. | Execute block logic inside a **Web Worker thread** with a maximum loop execution timeout limit (500ms). |
| **Content Licensing** | **IP Disputes:** Unclear ownership transfer upon marketplace purchase. | Implement explicit `licenseType` (`PERSONAL_USE`, `COMMERCIAL_USE`) and moderation statuses (`DRAFT`, `PENDING_REVIEW`, `APPROVED`). |

---

## 2. Production Database Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  BUYER
  SELLER
  ADMIN
}

enum ProjectType {
  DESIGN_3D
  CIRCUIT
  CODEBLOCK
}

enum ListingStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  ARCHIVED
}

enum LicenseType {
  PERSONAL_USE
  COMMERCIAL_USE
}

enum OrderStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model User {
  id                       String    @id @default(uuid())
  email                    String    @unique
  passwordHash             String?
  role                     Role      @default(BUYER)
  stripeAccountId          String?   @unique
  stripeOnboardingComplete  Boolean   @default(false)
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt
  deletedAt                DateTime?

  projects                 Project[]
  listings                 Listing[] @relation("SellerListings")
  orders                   Order[]   @relation("BuyerOrders")
  reviews                  Review[]

  @@index([email])
}

model Project {
  id           String      @id @default(uuid())
  ownerId      String
  owner        User        @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  type         ProjectType
  title        String
  sceneJson    Json
  thumbnailUrl String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  deletedAt    DateTime?

  listings     Listing[]

  @@index([ownerId])
}

model Listing {
  id          String        @id @default(uuid())
  projectId   String
  project     Project       @relation(fields: [projectId], references: [id])
  sellerId    String
  seller      User          @relation("SellerListings", fields: [sellerId], references: [id])
  priceCents  Int           // Integer format (e.g., 1500 = $15.00)
  title       String
  description String
  category    String
  licenseType LicenseType   @default(PERSONAL_USE)
  status      ListingStatus @default(DRAFT)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  orderItems  OrderItem[]
  reviews     Review[]

  @@index([sellerId])
  @@index([status])
}

model Order {
  id                    String      @id @default(uuid())
  buyerId               String
  buyer                 User        @relation("BuyerOrders", fields: [buyerId], references: [id])
  stripePaymentIntentId String      @unique
  totalAmountCents      Int
  status                OrderStatus @default(PENDING)
  createdAt             DateTime    @default(now())

  items                 OrderItem[]

  @@index([buyerId])
}

model OrderItem {
  id               String  @id @default(uuid())
  orderId          String
  order            Order   @relation(fields: [orderId], references: [id])
  listingId        String
  listing          Listing @relation(fields: [listingId], references: [id])
  sellerId         String
  amountCents      Int
  platformFeeCents Int
  stripeTransferId String?

  @@index([orderId])
}

model Review {
  id        String   @id @default(uuid())
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id])
  buyerId   String
  buyer     User     @relation(fields: [buyerId], references: [id])
  rating    Int      // 1 to 5 scale
  comment   String
  createdAt DateTime @default(now())

  @@unique([listingId, buyerId])
}
