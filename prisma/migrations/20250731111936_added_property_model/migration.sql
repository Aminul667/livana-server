-- CreateEnum
CREATE TYPE "public"."ListingType" AS ENUM ('rent', 'sale');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('flat', 'house', 'villa', 'studio');

-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('residential', 'commercial');

-- CreateEnum
CREATE TYPE "public"."FurnishedStatus" AS ENUM ('furnished', 'semi_furnished', 'unfurnished');

-- CreateEnum
CREATE TYPE "public"."RentFrequency" AS ENUM ('monthly', 'half_yearly', 'yearly');

-- CreateTable
CREATE TABLE "public"."Property" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyImage" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
