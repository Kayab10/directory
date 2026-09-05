import Link from "next/link";
import { LayoutGrid, Building2, Users, Plus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import SectorCard from "@/components/SectorCard";
import PageHeader from "@/components/PageHeader";
import QuickSearch from "@/components/QuickSearch";
import StatChip from "@/components/StatChip";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { deleteSectorAction } from "./admin/actions/sectors";

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
  const session = await getSession();
  const isAdmin = session?.role === "DATA_ENTRY";

  const sectors = await prisma.sector.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { departments: true } } },
  });

  const [departmentCount, headCount] = await Promise.all([
    prisma.department.count(),
    prisma.department.count({ where: { headName: { not: null } } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Sectors"
        subtitle="Browse departments and organisations by sector, Government of Madhya Pradesh."
        actions={
          isAdmin ? (
            <Link href="/admin/sectors/new" className="btn-primary btn-sm">
              <Plus className="h-3.5 w-3.5" /> Add Sector
            </Link>
          ) : undefined
        }
      />

      <div className="mb-6">
        <QuickSearch />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <StatChip icon={LayoutGrid} label="Sectors" value={sectors.length} />
        <StatChip icon={Building2} label="Departments" value={departmentCount} />
        <StatChip icon={Users} label="Dept. Heads" value={headCount} />
      </div>

      {sectors.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No sectors have been added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => (
            <SectorCard
              key={sector.id}
              slug={sector.slug}
              name={sector.name}
              description={sector.description}
              icon={sector.icon}
              color={sector.color}
              departmentCount={sector._count.departments}
              actions={
                isAdmin ? (
                  <>
                    <Link href={`/admin/sectors/${sector.id}/edit`} className="btn-secondary btn-sm">
                      <Pencil className="h-3.5 w-3.5" /> Modify
                    </Link>
                    <form action={deleteSectorAction}>
                      <input type="hidden" name="id" value={sector.id} />
                      <ConfirmSubmitButton
                        className="btn-danger btn-sm"
                        confirmMessage={`Delete "${sector.name}" and ALL its departments, sub-departments and contact persons? This cannot be undone.`}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </ConfirmSubmitButton>
                    </form>
                  </>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
