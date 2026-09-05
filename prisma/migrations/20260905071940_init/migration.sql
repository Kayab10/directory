-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DATA_ENTRY', 'GENERAL');

-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('PARENT_DEPARTMENT', 'SUB_DEPARTMENT', 'BOARD', 'CORPORATION', 'INSTITUTION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'Layers',
    "color" TEXT NOT NULL DEFAULT 'blue',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "orgType" "OrgType" NOT NULL DEFAULT 'PARENT_DEPARTMENT',
    "officeAddress" TEXT,
    "mapUrl" TEXT,
    "website" TEXT,
    "headName" TEXT,
    "headDesignation" TEXT,
    "paName" TEXT,
    "paPhone" TEXT,
    "paEmail" TEXT,
    "paMobile" TEXT,
    "officePhone" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPerson" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ContactPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_slug_key" ON "Sector"("slug");

-- CreateIndex
CREATE INDEX "Department_sectorId_idx" ON "Department"("sectorId");

-- CreateIndex
CREATE INDEX "Department_parentId_idx" ON "Department"("parentId");

-- CreateIndex
CREATE INDEX "ContactPerson_departmentId_idx" ON "ContactPerson"("departmentId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
