-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_sectorId_fkey";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "active";

-- AlterTable
ALTER TABLE "Sector" DROP COLUMN "active";

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

