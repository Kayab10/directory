import Link from "next/link";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import QuickSearch from "@/components/QuickSearch";
import ContactActions from "@/components/ContactActions";
import SectorCard from "@/components/SectorCard";
import { ORG_TYPE_LABELS } from "@/lib/org-type";

export const dynamic = "force-dynamic";

const ci = (q: string) => ({ contains: q, mode: "insensitive" as const });

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim() ?? "";

  if (!q) {
    return (
      <div>
        <PageHeader title="Search" subtitle="Search the entire Government Directory." />
        <QuickSearch />
        <p className="mt-6 text-sm text-slate-400">
          Search by sector, department, board, corporation, institution, officer name, designation, email or mobile
          number.
        </p>
      </div>
    );
  }

  const [sectors, departments, contacts] = await Promise.all([
    prisma.sector.findMany({ where: { name: ci(q) }, orderBy: { order: "asc" } }),
    prisma.department.findMany({
      where: {
        OR: [
          { name: ci(q) },
          { headName: ci(q) },
          { headDesignation: ci(q) },
          { email: ci(q) },
          { mobile: ci(q) },
          { officePhone: ci(q) },
          { paName: ci(q) },
        ],
      },
      include: { sector: true, parent: true },
    }),
    prisma.contactPerson.findMany({
      where: {
        OR: [{ name: ci(q) }, { designation: ci(q) }, { email: ci(q) }, { mobile: ci(q) }],
      },
      include: { department: { include: { sector: true, parent: true } } },
    }),
  ]);

  type ResultRow = {
    id: string;
    name: string;
    designation?: string | null;
    sectorName: string;
    breadcrumb: string;
    officeAddress?: string | null;
    email?: string | null;
    phone?: string | null;
    mobile?: string | null;
    matchedContact?: { name: string; designation?: string | null; email?: string | null; mobile?: string | null };
  };

  const byId = new Map<string, ResultRow>();

  for (const d of departments) {
    byId.set(d.id, {
      id: d.id,
      name: d.name,
      designation: d.headDesignation ? `${d.headDesignation}${d.headName ? ` — ${d.headName}` : ""}` : ORG_TYPE_LABELS[d.orgType],
      sectorName: d.sector.name,
      breadcrumb: d.parent ? `${d.sector.name} / ${d.parent.name}` : d.sector.name,
      officeAddress: d.officeAddress,
      email: d.email,
      phone: d.officePhone,
      mobile: d.mobile,
    });
  }

  for (const c of contacts) {
    const d = c.department;
    if (!byId.has(d.id)) {
      byId.set(d.id, {
        id: d.id,
        name: d.name,
        designation: ORG_TYPE_LABELS[d.orgType],
        sectorName: d.sector.name,
        breadcrumb: d.parent ? `${d.sector.name} / ${d.parent.name}` : d.sector.name,
        officeAddress: d.officeAddress,
        email: d.email,
        phone: d.officePhone,
        mobile: d.mobile,
      });
    }
    byId.get(d.id)!.matchedContact = {
      name: c.name,
      designation: c.designation,
      email: c.email,
      mobile: c.mobile,
    };
  }

  const results = Array.from(byId.values());
  const totalCount = sectors.length + results.length;

  return (
    <div>
      <PageHeader title="Search" subtitle={`Results for "${q}"`} />
      <div className="mb-6">
        <QuickSearch defaultValue={q} />
      </div>

      {totalCount === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No results found for &ldquo;{q}&rdquo;.
        </p>
      ) : (
        <div className="space-y-8">
          {sectors.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Sectors</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sectors.map((s) => (
                  <SectorCard key={s.id} slug={s.slug} name={s.name} description={s.description} color={s.color} />
                ))}
              </div>
            </section>
          )}

          {results.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
                Departments &amp; Organisations
              </h2>
              <div className="space-y-3">
                {results.map((r) => (
                  <div key={r.id} className="card p-4 sm:p-5">
                    <p className="text-xs font-medium text-slate-400">{r.breadcrumb}</p>
                    <Link href={`/departments/${r.id}`} className="mt-0.5 block text-lg font-bold text-navy-900 hover:underline">
                      {r.name}
                    </Link>
                    {r.designation && <p className="text-sm text-slate-500">{r.designation}</p>}

                    {r.matchedContact && (
                      <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        Matched contact: <span className="font-semibold">{r.matchedContact.name}</span>
                        {r.matchedContact.designation ? ` — ${r.matchedContact.designation}` : ""}
                        {r.matchedContact.mobile ? ` · ${r.matchedContact.mobile}` : ""}
                        {r.matchedContact.email ? ` · ${r.matchedContact.email}` : ""}
                      </div>
                    )}

                    {(r.officeAddress || r.email || r.phone || r.mobile) && (
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <ContactActions
                          address={r.officeAddress}
                          addressLabel="Office Address"
                          phone={r.phone}
                          mobile={r.mobile}
                          email={r.email}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
