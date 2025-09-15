-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('landlord', 'tenant', 'admin');

-- CreateEnum
CREATE TYPE "public"."UserProviders" AS ENUM ('local', 'google', 'facebook');

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

-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "provider" "public"."UserProviders" NOT NULL DEFAULT 'local',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

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
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."ListingStatus" NOT NULL DEFAULT 'draft',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_image" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "public"."users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "public"."profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "public"."profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_phone_key" ON "public"."profile"("phone");

-- CreateIndex
CREATE INDEX "property_userId_idx" ON "public"."property"("userId");

-- CreateIndex
CREATE INDEX "property_latitude_idx" ON "public"."property"("latitude");

-- CreateIndex
CREATE INDEX "property_longitude_idx" ON "public"."property"("longitude");

-- CreateIndex
CREATE INDEX "property_price_idx" ON "public"."property"("price");

-- CreateIndex
CREATE INDEX "property_bedrooms_idx" ON "public"."property"("bedrooms");

-- CreateIndex
CREATE INDEX "property_isDeleted_status_createdAt_idx" ON "public"."property"("isDeleted", "status", "createdAt");

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "public"."payment"("userId");

-- CreateIndex
CREATE INDEX "payment_propertyId_idx" ON "public"."payment"("propertyId");

-- CreateIndex
CREATE INDEX "payment_type_idx" ON "public"."payment"("type");

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property" ADD CONSTRAINT "property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_image" ADD CONSTRAINT "property_image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
