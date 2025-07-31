/*
  Warnings:

  - Added the required column `availableFrom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableMonth` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableMonthNumber` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "availableFrom" TEXT NOT NULL,
ADD COLUMN     "availableMonth" TEXT NOT NULL,
ADD COLUMN     "availableMonthNumber" TEXT NOT NULL;
