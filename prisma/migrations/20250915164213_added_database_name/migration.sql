/*
  Warnings:

  - You are about to drop the `Listing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListingProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ListingProgress" DROP CONSTRAINT "ListingProgress_listingId_fkey";

-- DropTable
DROP TABLE "public"."Listing";

-- DropTable
DROP TABLE "public"."ListingProgress";

-- CreateTable
CREATE TABLE "public"."listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyFor" "public"."PropertyFor",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listing_progress" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_progress_listingId_key" ON "public"."listing_progress"("listingId");

-- AddForeignKey
ALTER TABLE "public"."listing" ADD CONSTRAINT "listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listing_progress" ADD CONSTRAINT "listing_progress_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
