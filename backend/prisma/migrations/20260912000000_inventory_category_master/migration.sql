-- Replace the fixed item category enum with editable category codes.
ALTER TABLE "Item"
ALTER COLUMN "category" TYPE TEXT
USING lower("category"::text);

DROP TYPE "ItemCategory";

CREATE TABLE "InventoryCategory" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventorySubcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventorySubcategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InventoryCategory_code_key" ON "InventoryCategory"("code");
CREATE UNIQUE INDEX "InventorySubcategory_code_key" ON "InventorySubcategory"("code");
CREATE INDEX "InventorySubcategory_categoryId_idx" ON "InventorySubcategory"("categoryId");

ALTER TABLE "InventorySubcategory"
ADD CONSTRAINT "InventorySubcategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "InventoryCategory"("id")
ON DELETE CASCADE ON UPDATE CASCADE;