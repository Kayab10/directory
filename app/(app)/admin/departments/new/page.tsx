import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireDataEntry } from "@/lib/session-helpers";
import PageHeader from "@/components/PageHeader";
import DepartmentForm from "@/components/admin/DepartmentForm";
import { createDepartmentAction } from "@/app/(app)/admin/actions/departments";

export const dynamic = "force-dynamic";

export default async function NewDepartmentPage({
  searchParams,
}: {
  searchParams: Promise<{ sectorId?: string; parentId?: string }>;
}) {
  await requireDataEntry();
  const params = await searchParams;

  const sectors = await prisma.sector.findMany({ orderBy: { order: "asc" } });
  if (sectors.length === 0) notFound();

  let parent = null;
  if (params.parentId) {
    parent = await prisma.department.findUnique({ where: { id: params.parentId } });
    if (!parent) notFound();
  }

  const sectorId = parent?.sectorId ?? params.sectorId ?? sectors[0].id;
  const sector = sectors.find((s) => s.id === sectorId) ?? sectors[0];
  const redirectTo = parent ? `/departments/${parent.id}` : `/sectors/${sector.slug}`;

  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Sectors", href: "/sectors" },
          { label: sector.name, href: `/sectors/${sector.slug}` },
          ...(parent ? [{ label: parent.name, href: `/departments/${parent.id}` }] : []),
        ]}
        title={parent ? "Add Sub Department / Board / Corporation" : "Add Parent Department"}
      />
      <DepartmentForm
        action={createDepartmentAction}
        sectors={sectors}
        sectorId={sectorId}
        parentId={parent?.id ?? null}
        parentName={parent?.name}
        redirectTo={redirectTo}
      />
    </div>
  );
}
