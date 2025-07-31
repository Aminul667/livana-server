-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('draft', 'published');

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "status" "public"."ListingStatus" NOT NULL DEFAULT 'draft';
