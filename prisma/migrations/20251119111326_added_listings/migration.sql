/*
  Warnings:

  - You are about to drop the column `propertyFor` on the `listing` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `property_image` table. All the data in the column will be lost.
  - Added the required column `listingId` to the `property_image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."property_image" DROP CONSTRAINT "property_image_propertyId_fkey";

-- AlterTable
ALTER TABLE "public"."listing" DROP COLUMN "propertyFor",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "public"."ListingStatus" NOT NULL DEFAULT 'draft',
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."property_image" DROP COLUMN "propertyId",
ADD COLUMN     "listingId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "listing_userId_idx" ON "public"."listing"("userId");

-- CreateIndex
CREATE INDEX "listing_latitude_idx" ON "public"."listing"("latitude");

-- CreateIndex
CREATE INDEX "listing_longitude_idx" ON "public"."listing"("longitude");

-- CreateIndex
CREATE INDEX "listing_monthlyRent_idx" ON "public"."listing"("monthlyRent");

-- CreateIndex
CREATE INDEX "listing_bedrooms_idx" ON "public"."listing"("bedrooms");

-- CreateIndex
CREATE INDEX "listing_isDeleted_status_createdAt_idx" ON "public"."listing"("isDeleted", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."property_image" ADD CONSTRAINT "property_image_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
