import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Trash2, Plus, Building2, ChevronRight, Globe } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ContactActions from "@/components/ContactActions";
import PersonCard from "@/components/PersonCard";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { ORG_TYPE_LABELS } from "@/lib/org-type";
import { deleteDepartmentAction } from "@/app/(app)/admin/actions/departments";

export const dynamic = "force-dynamic";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const isAdmin = session?.role === "DATA_ENTRY";

  const dept = await prisma.department.findUnique({
    where: { id },
    include: {
      sector: true,
      parent: true,
      children: { orderBy: { order: "asc" } },
      contacts: { orderBy: { order: "asc" } },
    },
  });

  if (!dept) notFound();

  const isParentLevel = !dept.parentId;

  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Sectors", href: "/sectors" },
          { label: dept.sector.name, href: `/sectors/${dept.sector.slug}` },
          ...(dept.parent ? [{ label: dept.parent.name, href: `/departments/${dept.parent.id}` }] : []),
          { label: dept.name },
        ]}
        title={dept.name}
        subtitle={ORG_TYPE_LABELS[dept.orgType]}
        actions={
          isAdmin ? (
            <>
              <Link href={`/admin/departments/${dept.id}/edit`} className="btn-secondary btn-sm">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deleteDepartmentAction}>
                <input type="hidden" name="id" value={dept.id} />
                <ConfirmSubmitButton
                  className="btn-danger btn-sm"
                  confirmMessage={
                    dept.children.length > 0
                      ? `Delete "${dept.name}" and all ${dept.children.length} of its sub departments/boards/corporations and their contacts? This cannot be undone.`
                      : `Delete "${dept.name}" and its contacts? This cannot be undone.`
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </ConfirmSubmitButton>
              </form>
            </>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Department Information</h2>
            {dept.ministerName && (
              <div className="mb-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Hon&apos;ble Minister</p>
                <p className="text-sm font-bold text-red-700">{dept.ministerName}</p>
              </div>
            )}
            {dept.officeAddress || dept.website || dept.email || dept.officePhone || dept.mobile ? (
              <ContactActions
                address={dept.officeAddress}
                addressLabel="Office Address"
                phone={dept.officePhone}
                mobile={dept.mobile}
                email={dept.email}
                website={dept.website}
              />
            ) : (
              <p className="text-sm text-slate-400">No department contact details have been added yet.</p>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Contact Persons</h2>
            {dept.contacts.length === 0 ? (
              <p className="text-sm text-slate-400">No contact persons have been added yet.</p>
            ) : (
              <div className="space-y-3">
                {dept.contacts.map((c) => (
                  <PersonCard
                    key={c.id}
                    name={c.name}
                    designation={c.designation}
                    email={c.email}
                    mobile={c.mobile}
                    accent="border-l-slate-300"
                  />
                ))}
              </div>
            )}
          </section>

          {isParentLevel && (
            <section className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                  Sub Departments / Boards / Corporations / Institutions
                </h2>
                {isAdmin && (
                  <Link
                    href={`/admin/departments/new?sectorId=${dept.sectorId}&parentId=${dept.id}`}
                    className="btn-secondary btn-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Link>
                )}
              </div>
              {dept.children.length === 0 ? (
                <p className="text-sm text-slate-400">No organisations under this department yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {dept.children.map((child) => (
                    <li key={child.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                        <Link href={`/departments/${child.id}`} className="truncate text-sm font-medium text-navy-800 hover:underline">
                          {child.name}
                        </Link>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                          {ORG_TYPE_LABELS[child.orgType]}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="flex shrink-0 gap-2">
                          <Link href={`/admin/departments/${child.id}/edit`} className="btn-secondary btn-sm">
                            <Pencil className="h-3.5 w-3.5" /> Modify
                          </Link>
                          <form action={deleteDepartmentAction}>
                            <input type="hidden" name="id" value={child.id} />
                            <ConfirmSubmitButton
                              className="btn-danger btn-sm"
                              confirmMessage={`Delete "${child.name}" and its contacts? This cannot be undone.`}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </ConfirmSubmitButton>
                          </form>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <div className="space-y-5">
          <section className="card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Head of Organisation</h2>
            {dept.headName ? (
              <PersonCard name={dept.headName} designation={dept.headDesignation} accent="border-l-navy-800" />
            ) : (
              <p className="text-sm text-slate-400">Not yet assigned.</p>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">PA Details</h2>
            {dept.paName || dept.paPhone || dept.paEmail || dept.paMobile ? (
              <PersonCard
                name={dept.paName}
                designation="Personal Assistant"
                phone={dept.paPhone}
                email={dept.paEmail}
                mobile={dept.paMobile}
                accent="border-l-slate-300"
              />
            ) : (
              <p className="text-sm text-slate-400">No PA details have been added yet.</p>
            )}
          </section>

          {dept.parent && (
            <Link
              href={`/departments/${dept.parent.id}`}
              className="card flex items-center justify-between gap-2 p-4 text-sm font-semibold text-navy-800 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Parent department: {dept.parent.name}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
