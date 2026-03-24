/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "checkinAt" DATETIME;
ALTER TABLE "Reservation" ADD COLUMN "checkoutAt" DATETIME;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "driveType" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "engine" TEXT;

-- CreateTable
CREATE TABLE "ExpenseType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VehicleExpense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VehicleExpense_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VehicleExpense_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ExpenseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseType_name_key" ON "ExpenseType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_code_key" ON "Location"("code");
