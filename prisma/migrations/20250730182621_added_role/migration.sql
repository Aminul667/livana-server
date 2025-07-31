/*
  Warnings:

  - You are about to drop the column `needPasswordChange` on the `users` table. All the data in the column will be lost.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('landlord', 'tenant');

-- CreateEnum
CREATE TYPE "public"."UserProviders" AS ENUM ('local', 'google', 'facebook');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "needPasswordChange",
ADD COLUMN     "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "public"."UserRole" NOT NULL;
