import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import InfoRow from "@/components/InfoRow";

export const dynamic = "force-dynamic";

export default async function DepartmentHeadsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim();

  const heads = await prisma.department.findMany({
    where: {
      headName: { not: null },
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
  });

  return (
    <div>
      <PageHeader title="Department's Head" subtitle="Consolidated directory of heads of departments and organisations." />

      <form action="/heads" method="GET" className="relative mb-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Filter by name, designation, department or sector"
          className="field-input pl-10"
        />
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
                  <Link
                    href={`/departments/${dept.id}`}
                    className="mt-1 inline-block text-sm font-medium text-navy-700 hover:underline"
                  >
                    {dept.name}
                  </Link>
                  <span className="mt-1 block w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                    {dept.sector.name}
                  </span>
                </div>
                <Link
                  href={`/departments/${dept.id}`}
                  className="flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-800 hover:underline"
                >
                  View profile <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-x-6 border-t border-slate-100 pt-3 sm:grid-cols-2">
                <InfoRow kind="address" label="Office Address" value={dept.officeAddress} />
                <InfoRow kind="email" label="Email" value={dept.email} />
                <InfoRow kind="phone" label="Office Phone" value={dept.officePhone} />
                <InfoRow kind="mobile" label="Mobile" value={dept.mobile} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
