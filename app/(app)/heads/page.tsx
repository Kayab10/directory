import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ContactActions from "@/components/ContactActions";

export const dynamic = "force-dynamic";

export default async function DepartmentHeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sector?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const sectorId = params.sector?.trim();

  const [heads, sectors] = await Promise.all([
    prisma.department.findMany({
      where: {
        headName: { not: null },
        ...(sectorId ? { sectorId } : {}),
        ...(q
          ? {
              OR: [
                { headName: { contains: q, mode: "insensitive" } },
                { headDesignation: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
                { sector: { name: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: { sector: true },
      orderBy: [{ sector: { order: "asc" } }, { order: "asc" }],
    }),
    prisma.sector.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <PageHeader title="Department's Head" subtitle="Consolidated directory of heads of departments and organisations." />

      <form action="/heads" method="GET" className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Filter by name, designation, department or sector"
            className="field-input pl-10"
          />
        </div>
        <select name="sector" defaultValue={sectorId ?? ""} className="field-input sm:w-56">
          <option value="">All sectors</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </form>

      {heads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No matching department heads found.
        </p>
      ) : (
        <div className="space-y-3">
          {heads.map((dept) => (
            <div key={dept.id} className="card p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-navy-900">{dept.headName}</p>
                  <p className="text-sm text-slate-500">{dept.headDesignation}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                      {dept.sector.name}
                    </span>
                    <Link
                      href={`/departments/${dept.id}`}
                      className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-100"
                    >
                      {dept.name}
                    </Link>
                  </div>
                  {dept.ministerName && (
                    <p className="mt-2 text-sm">
                      <span className="font-medium text-slate-400">Hon&apos;ble Minister: </span>
                      <span className="font-bold text-red-700">{dept.ministerName}</span>
                    </p>
                  )}
                </div>
                <Link
                  href={`/departments/${dept.id}`}
                  className="flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-800 hover:underline"
                >
                  View profile <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              {(dept.officeAddress || dept.email || dept.officePhone || dept.mobile) && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <ContactActions
                    address={dept.officeAddress}
                    addressLabel="Office Address"
                    phone={dept.officePhone}
                    mobile={dept.mobile}
                    email={dept.email}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
