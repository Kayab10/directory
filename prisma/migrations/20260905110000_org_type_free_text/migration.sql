-- Convert orgType from an enum to free text, preserving existing values
-- (rather than the destructive drop+recreate Prisma would otherwise
-- generate, which would wipe every existing department's org type).
ALTER TABLE "Department" ALTER COLUMN "orgType" DROP DEFAULT;

ALTER TABLE "Department" ALTER COLUMN "orgType" TYPE TEXT USING (
  CASE "orgType"::text
    WHEN 'PARENT_DEPARTMENT' THEN 'Parent Department'
    WHEN 'SUB_DEPARTMENT' THEN 'Sub Department'
    WHEN 'BOARD' THEN 'Board'
    WHEN 'CORPORATION' THEN 'Corporation'
    WHEN 'INSTITUTION' THEN 'Institution'
    ELSE "orgType"::text
  END
);

ALTER TABLE "Department" ALTER COLUMN "orgType" SET DEFAULT 'Parent Department';

DROP TYPE "OrgType";
