import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireDataEntry } from "@/lib/session-helpers";
import PageHeader from "@/components/PageHeader";
import SectorForm from "@/components/admin/SectorForm";
import { updateSectorAction } from "@/app/(app)/admin/actions/sectors";

export const dynamic = "force-dynamic";

export default async function EditSectorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireDataEntry();
  const { id } = await params;

  const sector = await prisma.sector.findUnique({ where: { id } });
  if (!sector) notFound();

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Sectors", href: "/sectors" }, { label: sector.name, href: `/sectors/${sector.slug}` }]}
        title={`Edit: ${sector.name}`}
      />
      <SectorForm action={updateSectorAction} id={sector.id} initial={sector} />
    </div>
  );
}
