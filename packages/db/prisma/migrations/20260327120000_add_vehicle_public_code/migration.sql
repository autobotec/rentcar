-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "publicCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_publicCode_key" ON "Vehicle"("publicCode");
