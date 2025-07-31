-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "provider" "public"."UserProviders" NOT NULL DEFAULT 'local';
