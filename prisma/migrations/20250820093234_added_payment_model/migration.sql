-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT,
    "type" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "public"."payment"("userId");

-- CreateIndex
CREATE INDEX "payment_propertyId_idx" ON "public"."payment"("propertyId");

-- CreateIndex
CREATE INDEX "payment_type_idx" ON "public"."payment"("type");

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

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
