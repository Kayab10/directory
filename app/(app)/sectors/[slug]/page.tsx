import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Landmark, Plus, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { getSectorIcon } from "@/lib/icon-map";
import { getSectorTheme } from "@/lib/sector-theme";
import { deleteDepartmentAction } from "@/app/(app)/admin/actions/departments";

export const dynamic = "force-dynamic";

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  const isAdmin = session?.role === "DATA_ENTRY";

  const sector = await prisma.sector.findUnique({
    where: { slug },
    include: {
      departments: {
        where: { parentId: null },
        orderBy: { order: "asc" },
        include: {
          _count: { select: { children: true } },
        },
      },
    },
  });

  if (!sector) notFound();

  const Icon = getSectorIcon(sector.icon);
  const theme = getSectorTheme(sector.color);

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Sectors", href: "/sectors" }, { label: sector.name }]}
        title={sector.name}
        subtitle={sector.description ?? undefined}
        actions={
          isAdmin ? (
            <Link href={`/admin/departments/new?sectorId=${sector.id}`} className="btn-primary btn-sm">
              <Plus className="h-3.5 w-3.5" /> Add Department
            </Link>
          ) : undefined
        }
      />

      <div className={`mb-6 flex items-center gap-3 rounded-2xl ${theme.badgeBg} p-4`}>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white ${theme.badgeText}`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className={`text-sm font-medium ${theme.badgeText}`}>
          {sector.departments.length} parent department{sector.departments.length === 1 ? "" : "s"} in this sector
        </p>
      </div>

      {sector.departments.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No departments have been added to this sector yet.
        </p>
      ) : (
        <div className="space-y-3">
          {sector.departments.map((dept) => (
            <div key={dept.id} className="card p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Landmark className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/departments/${dept.id}`} className="font-bold text-navy-900 hover:underline">
                    {dept.name}
                  </Link>
                  {dept.headName ? (
                    <p className="mt-0.5 text-sm text-slate-500">
                      Head: <span className="font-medium text-slate-700">{dept.headName}</span>
                      {dept.headDesignation ? `, ${dept.headDesignation}` : ""}
                    </p>
                  ) : (
                    dept._count.children > 0 && (
                      <p className="mt-0.5 text-sm text-slate-400">
                        {dept._count.children} sub department{dept._count.children === 1 ? "" : "s"}
                      </p>
                    )
                  )}
                </div>
                <Link
                  href={`/departments/${dept.id}`}
                  className="flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-800 hover:underline"
                >
                  View <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {isAdmin && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <Link
                    href={`/admin/departments/new?sectorId=${sector.id}&parentId=${dept.id}`}
                    className="btn-secondary btn-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Organization
                  </Link>
                  <Link href={`/admin/departments/${dept.id}/edit`} className="btn-secondary btn-sm">
                    <Pencil className="h-3.5 w-3.5" /> Modify
                  </Link>
                  <form action={deleteDepartmentAction}>
                    <input type="hidden" name="id" value={dept.id} />
                    <ConfirmSubmitButton
                      className="btn-danger btn-sm"
                      confirmMessage={
                        dept._count.children > 0
                          ? `Delete "${dept.name}" and all ${dept._count.children} of its sub departments/boards/corporations and their contacts? This cannot be undone.`
                          : `Delete "${dept.name}" and its contacts? This cannot be undone.`
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
