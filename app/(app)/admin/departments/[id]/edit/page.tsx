import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireDataEntry } from "@/lib/session-helpers";
import PageHeader from "@/components/PageHeader";
import DepartmentForm from "@/components/admin/DepartmentForm";
import { updateDepartmentAction } from "@/app/(app)/admin/actions/departments";

export const dynamic = "force-dynamic";

export default async function EditDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireDataEntry();
  const { id } = await params;

  const dept = await prisma.department.findUnique({
    where: { id },
    include: { sector: true, parent: true, contacts: { orderBy: { order: "asc" } } },
  });
  if (!dept) notFound();

  const sectors = await prisma.sector.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Sectors", href: "/" },
          { label: dept.sector.name, href: `/sectors/${dept.sector.slug}` },
          ...(dept.parent ? [{ label: dept.parent.name, href: `/departments/${dept.parent.id}` }] : []),
          { label: dept.name, href: `/departments/${dept.id}` },
        ]}
        title={`Edit: ${dept.name}`}
      />
      <DepartmentForm
        action={updateDepartmentAction}
        sectors={sectors}
        id={dept.id}
        sectorId={dept.sectorId}
        parentId={dept.parentId}
        parentName={dept.parent?.name}
        orgType={dept.orgType}
        redirectTo={`/departments/${dept.id}`}
        initial={dept}
        initialContacts={dept.contacts.map((c) => ({
          name: c.name,
          designation: c.designation ?? "",
          mobile: c.mobile ?? "",
          email: c.email ?? "",
        }))}
      />
    </div>
  );
}
