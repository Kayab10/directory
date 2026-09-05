import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import SectorCard from "@/components/SectorCard";
import PageHeader from "@/components/PageHeader";
import QuickSearch from "@/components/QuickSearch";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { Plus } from "lucide-react";
import { deleteSectorAction } from "../admin/actions/sectors";

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
  const session = await getSession();
  const isAdmin = session?.role === "DATA_ENTRY";

  const sectors = await prisma.sector.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { departments: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Sectors"
        subtitle="All sectors of Government of Madhya Pradesh"
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
              color={sector.color}
              departmentCount={sector._count.departments}
              actions={
                isAdmin ? (
                  <>
                    <Link
                      href={`/admin/sectors/${sector.id}/edit`}
                      className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-white"
                    >
                      <Pencil className="mr-1 inline h-3 w-3" /> Modify
                    </Link>
                    <form action={deleteSectorAction}>
                      <input type="hidden" name="id" value={sector.id} />
                      <ConfirmSubmitButton
                        className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-white"
                        confirmMessage={`Delete "${sector.name}" and ALL its departments, sub-departments and contact persons? This cannot be undone.`}
                      >
                        <Trash2 className="mr-1 inline h-3 w-3" /> Delete
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
