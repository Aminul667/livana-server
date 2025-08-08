/*
  Warnings:

  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Property" DROP CONSTRAINT "Property_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PropertyImage" DROP CONSTRAINT "PropertyImage_propertyId_fkey";

-- DropTable
DROP TABLE "public"."Property";

-- CreateTable
CREATE TABLE "public"."property" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "listingType" "public"."ListingType" NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL,
    "purpose" "public"."Purpose" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "areaSqFt" DOUBLE PRECISION NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "totalFloors" INTEGER,
    "furnished" "public"."FurnishedStatus" NOT NULL,
    "coverImage" TEXT NOT NULL,
    "availableFrom" TEXT NOT NULL,
    "availableMonth" TEXT NOT NULL,
    "availableMonthNumber" INTEGER NOT NULL,
    "rentFrequency" "public"."RentFrequency",
    "depositAmount" DOUBLE PRECISION,
    "maintenanceFee" DOUBLE PRECISION,
    "amenities" TEXT[],
    "hasParking" BOOLEAN NOT NULL,
    "hasLift" BOOLEAN NOT NULL,
    "hasBalcony" BOOLEAN NOT NULL,
    "heating" BOOLEAN NOT NULL,
    "cooling" BOOLEAN NOT NULL,
    "petFriendly" BOOLEAN NOT NULL,
    "internetIncluded" BOOLEAN NOT NULL,
    "videoUrl" TEXT,
    "status" "public"."ListingStatus" NOT NULL DEFAULT 'draft',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."property" ADD CONSTRAINT "property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
