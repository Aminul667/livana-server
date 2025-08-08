/*
  Warnings:

  - You are about to drop the `PropertyImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PropertyImage" DROP CONSTRAINT "PropertyImage_propertyId_fkey";

-- DropTable
DROP TABLE "public"."PropertyImage";

-- CreateTable
CREATE TABLE "public"."property_image" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."property_image" ADD CONSTRAINT "property_image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
