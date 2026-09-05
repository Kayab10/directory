"use client";

import { useState } from "react";
import ContactPersonsEditor from "./ContactPersonsEditor";
import { ORG_TYPE_LABELS, ORG_TYPE_OPTIONS } from "@/lib/org-type";
import type { OrgType } from "@prisma/client";

type SectorOption = { id: string; name: string };

export default function DepartmentForm({
  action,
  sectors,
  id,
  sectorId,
  parentId,
  parentName,
  orgType,
  redirectTo,
  initial,
  initialContacts,
}: {
  action: (formData: FormData) => void | Promise<void>;
  sectors: SectorOption[];
  id?: string;
  sectorId?: string;
  parentId?: string | null;
  parentName?: string | null;
  orgType?: OrgType;
  redirectTo: string;
  initial?: {
    name?: string;
    officeAddress?: string | null;
    mapUrl?: string | null;
    website?: string | null;
    headName?: string | null;
    headDesignation?: string | null;
    paName?: string | null;
    paPhone?: string | null;
    paEmail?: string | null;
    paMobile?: string | null;
    officePhone?: string | null;
    email?: string | null;
    mobile?: string | null;
  };
  initialContacts?: { name: string; designation: string; mobile: string; email: string }[];
}) {
  const isSub = Boolean(parentId);
  const [selectedOrgType, setSelectedOrgType] = useState<OrgType>(orgType ?? (isSub ? "SUB_DEPARTMENT" : "PARENT_DEPARTMENT"));

  return (
    <form action={action} className="space-y-6">
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}

      <section className="card space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
          {isSub ? "Sub Department / Board / Corporation / Institution" : "Parent Department"}
        </h2>

        {parentName && (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Under parent department: <span className="font-medium text-navy-800">{parentName}</span>
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Sector</label>
            {isSub ? (
              <input
                disabled
                value={sectors.find((s) => s.id === sectorId)?.name ?? ""}
                className="field-input bg-slate-50 text-slate-400"
              />
            ) : (
              <select name="sectorId" defaultValue={sectorId} required className="field-input">
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
            {isSub && <input type="hidden" name="sectorId" value={sectorId} />}
          </div>

          <div>
            <label className="field-label">Organisation Type</label>
            {isSub ? (
              <select
                name="orgType"
                value={selectedOrgType}
                onChange={(e) => setSelectedOrgType(e.target.value as OrgType)}
                className="field-input"
              >
                {ORG_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {ORG_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            ) : (
              <input disabled value="Parent Department" className="field-input bg-slate-50 text-slate-400" />
            )}
            {!isSub && <input type="hidden" name="orgType" value="PARENT_DEPARTMENT" />}
          </div>
        </div>

        <div>
          <label className="field-label">Name</label>
          <input name="name" required defaultValue={initial?.name} className="field-input" placeholder="Department / organisation name" />
        </div>

        <div>
          <label className="field-label">Office Address</label>
          <textarea name="officeAddress" defaultValue={initial?.officeAddress ?? ""} rows={2} className="field-input" placeholder="e.g. Vallabh Bhawan II, Bhopal" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Map link (optional)</label>
            <input name="mapUrl" defaultValue={initial?.mapUrl ?? ""} className="field-input" placeholder="https://maps.google.com/..." />
          </div>
          <div>
            <label className="field-label">Website (optional)</label>
            <input name="website" defaultValue={initial?.website ?? ""} className="field-input" placeholder="https://..." />
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Head of Organisation</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Name</label>
            <input name="headName" defaultValue={initial?.headName ?? ""} className="field-input" placeholder="Shri / Smt. ..." />
          </div>
          <div>
            <label className="field-label">Designation</label>
            <input name="headDesignation" defaultValue={initial?.headDesignation ?? ""} className="field-input" placeholder="Principal Secretary" />
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">PA Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">PA Name</label>
            <input name="paName" defaultValue={initial?.paName ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">Office Phone</label>
            <input name="paPhone" defaultValue={initial?.paPhone ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input name="paEmail" type="email" defaultValue={initial?.paEmail ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">Mobile</label>
            <input name="paMobile" defaultValue={initial?.paMobile ?? ""} className="field-input" />
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Department Contact</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Office Phone</label>
            <input name="officePhone" defaultValue={initial?.officePhone ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input name="email" type="email" defaultValue={initial?.email ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">Mobile</label>
            <input name="mobile" defaultValue={initial?.mobile ?? ""} className="field-input" />
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Contact Persons</h2>
        <ContactPersonsEditor initial={initialContacts} />
      </section>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
