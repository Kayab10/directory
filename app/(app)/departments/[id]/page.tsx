import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Trash2, Plus, Landmark, ChevronRight, Globe, Crown, Phone, MapPin, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ContactActions, { mapsUrl } from "@/components/ContactActions";
import ActionPill from "@/components/ActionPill";
import PersonCard from "@/components/PersonCard";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { deleteDepartmentAction } from "@/app/(app)/admin/actions/departments";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-navy-900">{value || <span className="text-slate-400">Not available</span>}</p>
    </div>
  );
}

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
  const callNumber = dept.mobile || dept.officePhone;

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
        subtitle={dept.orgType}
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

      <div className="space-y-5">
        {isParentLevel ? (
          <section className="card border-blue-200 p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Crown className="h-5 w-5" />
              </span>
              <h2 className="text-base font-bold text-navy-900">Head of Department</h2>
            </div>

            {dept.ministerName && (
              <>
                <div className="mb-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Hon&apos;ble Minister</p>
                  <p className="text-sm font-bold text-red-700">{dept.ministerName}</p>
                </div>
                <div className="mb-4 border-t border-slate-100" />
              </>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Head of Department" value={dept.headName} />
              <Field label="Designation" value={dept.headDesignation} />
              <Field label="Mobile" value={dept.mobile} />
              <Field label="Telephone" value={dept.officePhone} />
            </div>

            {dept.officeAddress && (
              <div className="mt-4">
                <Field label="Address" value={dept.officeAddress} />
              </div>
            )}

            {(callNumber || dept.officeAddress || dept.email || dept.website) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {callNumber && <ActionPill color="green" icon={Phone} label="Call" href={`tel:${callNumber.replace(/\s+/g, "")}`} />}
                {dept.officeAddress && <ActionPill color="amber" icon={MapPin} label="Map" href={mapsUrl(dept.officeAddress)} external />}
                {dept.email && <ActionPill color="blue" icon={Mail} label="Email" href={`mailto:${dept.email}`} />}
                {dept.website && (
                  <ActionPill
                    color="slate"
                    icon={Globe}
                    label="Website"
                    href={dept.website.startsWith("http") ? dept.website : `https://${dept.website}`}
                    external
                  />
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="card p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Organization Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Organization Type" value={dept.orgType} />
              </div>
              {(dept.officeAddress || dept.website || dept.email || dept.officePhone || dept.mobile) && (
                <div className="mt-4">
                  <ContactActions
                    address={dept.officeAddress}
                    phone={dept.officePhone}
                    mobile={dept.mobile}
                    email={dept.email}
                    website={dept.website}
                  />
                </div>
              )}
            </section>

            <section className="card p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Head / Officer</h2>
              {dept.headName ? (
                <PersonCard name={dept.headName} designation={dept.headDesignation} accent="border-l-navy-800" />
              ) : (
                <p className="text-sm text-slate-400">No head/officer information added.</p>
              )}
            </section>
          </>
        )}

        <section className="card p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">PA / Assistant</h2>
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
            <p className="text-sm text-slate-400">No PA/assistant information added.</p>
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
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Sub Departments / Organisations</h2>
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
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">
                No organisations under this department yet.
              </p>
            ) : (
              <div className="space-y-3">
                {dept.children.map((child) => (
                  <div key={child.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                    <Link href={`/departments/${child.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <Landmark className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-navy-900">{child.name}</p>
                        <p className="text-sm text-slate-500">{child.orgType}</p>
                      </div>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                      {isAdmin && (
                        <>
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
                        </>
                      )}
                      <Link href={`/departments/${child.id}`} className="text-slate-300 hover:text-slate-400">
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

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
  );
}
