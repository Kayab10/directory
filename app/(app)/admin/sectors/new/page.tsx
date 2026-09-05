import { requireDataEntry } from "@/lib/session-helpers";
import PageHeader from "@/components/PageHeader";
import SectorForm from "@/components/admin/SectorForm";
import { createSectorAction } from "@/app/(app)/admin/actions/sectors";

export const dynamic = "force-dynamic";

export default async function NewSectorPage() {
  await requireDataEntry();

  return (
    <div>
      <PageHeader crumbs={[{ label: "Sectors", href: "/" }]} title="Add Sector" />
      <SectorForm action={createSectorAction} />
    </div>
  );
}
