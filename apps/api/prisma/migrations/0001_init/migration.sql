CREATE TYPE "ProjectType" AS ENUM (
  'DESIGN_3D',
  'CIRCUIT',
  'CODEBLOCK'
);

CREATE TYPE "ProjectStatus" AS ENUM (
  'ACTIVE',
  'ARCHIVED'
);

CREATE TYPE "ListingStatus" AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
);

CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING',
  'PAID',
  'FULFILLED',
  'CANCELLED',
  'REFUNDED'
);

CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED'
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "displayName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "ProjectType" NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Listing" (
  "id" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "projectId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
  "stock" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "totalCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPriceCents" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "body" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),

  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_clerkUserId_key"
ON "User"("clerkUserId");

CREATE UNIQUE INDEX "User_email_key"
ON "User"("email");

CREATE INDEX "User_deletedAt_idx"
ON "User"("deletedAt");

CREATE INDEX "Project_ownerId_deletedAt_idx"
ON "Project"("ownerId", "deletedAt");

CREATE INDEX "Project_status_deletedAt_idx"
ON "Project"("status", "deletedAt");

CREATE INDEX "Listing_sellerId_deletedAt_idx"
ON "Listing"("sellerId", "deletedAt");

CREATE INDEX "Listing_projectId_deletedAt_idx"
ON "Listing"("projectId", "deletedAt");

CREATE INDEX "Listing_status_deletedAt_idx"
ON "Listing"("status", "deletedAt");

CREATE INDEX "Order_buyerId_deletedAt_idx"
ON "Order"("buyerId", "deletedAt");

CREATE INDEX "Order_status_deletedAt_idx"
ON "Order"("status", "deletedAt");

CREATE INDEX "OrderItem_orderId_deletedAt_idx"
ON "OrderItem"("orderId", "deletedAt");

CREATE INDEX "OrderItem_listingId_deletedAt_idx"
ON "OrderItem"("listingId", "deletedAt");

CREATE UNIQUE INDEX "Review_authorId_listingId_key"
ON "Review"("authorId", "listingId");

CREATE INDEX "Review_listingId_deletedAt_idx"
ON "Review"("listingId", "deletedAt");

CREATE INDEX "Review_authorId_deletedAt_idx"
ON "Review"("authorId", "deletedAt");

ALTER TABLE "Project"
ADD CONSTRAINT "Project_ownerId_fkey"
FOREIGN KEY ("ownerId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Listing"
ADD CONSTRAINT "Listing_sellerId_fkey"
FOREIGN KEY ("sellerId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Listing"
ADD CONSTRAINT "Listing_projectId_fkey"
FOREIGN KEY ("projectId")
REFERENCES "Project"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "Order"
ADD CONSTRAINT "Order_buyerId_fkey"
FOREIGN KEY ("buyerId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_orderId_fkey"
FOREIGN KEY ("orderId")
REFERENCES "Order"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_listingId_fkey"
FOREIGN KEY ("listingId")
REFERENCES "Listing"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Review"
ADD CONSTRAINT "Review_authorId_fkey"
FOREIGN KEY ("authorId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Review"
ADD CONSTRAINT "Review_listingId_fkey"
FOREIGN KEY ("listingId")
REFERENCES "Listing"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
