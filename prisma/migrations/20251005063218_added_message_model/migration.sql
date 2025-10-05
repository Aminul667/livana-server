-- AlterTable
ALTER TABLE "public"."listing" ADD COLUMN     "address" TEXT,
ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "areaSqFt" DOUBLE PRECISION,
ADD COLUMN     "availableFrom" TEXT,
ADD COLUMN     "availableMonth" TEXT,
ADD COLUMN     "availableMonthNumber" INTEGER,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "cooling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "depositAmount" DOUBLE PRECISION,
ADD COLUMN     "floorNumber" INTEGER,
ADD COLUMN     "furnished" "public"."FurnishedStatus",
ADD COLUMN     "hasBalcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasLift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "internetIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "listingType" "public"."ListingType",
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "maintenanceFee" DOUBLE PRECISION,
ADD COLUMN     "monthlyRent" DOUBLE PRECISION,
ADD COLUMN     "petFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "rentFrequency" "public"."RentFrequency",
ADD COLUMN     "state" TEXT,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "weeklyRent" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "text" VARCHAR(2000),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
