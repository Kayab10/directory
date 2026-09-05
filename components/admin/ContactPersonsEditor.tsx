"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, UserCircle2 } from "lucide-react";

type Row = { key: number; name: string; designation: string; mobile: string; email: string };

export default function ContactPersonsEditor({
  initial,
}: {
  initial?: { name: string; designation: string; mobile: string; email: string }[];
}) {
  const nextKey = useRef(0);
  const makeRow = (r?: Partial<Row>): Row => ({
    key: nextKey.current++,
    name: r?.name ?? "",
    designation: r?.designation ?? "",
    mobile: r?.mobile ?? "",
    email: r?.email ?? "",
  });

  const [rows, setRows] = useState<Row[]>(() => {
    const base = initial && initial.length > 0 ? initial.map((r) => makeRow(r)) : [makeRow(), makeRow()];
    return base;
  });

  function update(key: number, field: keyof Omit<Row, "key">, value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()]);
  }

  function removeRow(key: number) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={row.key} className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <UserCircle2 className="h-4 w-4 text-slate-400" /> Contact Person {i + 1}
            </p>
            <button
              type="button"
              onClick={() => removeRow(row.key)}
              className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input
                name="contact_name"
                value={row.name}
                onChange={(e) => update(row.key, "name", e.target.value)}
                className="field-input"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="field-label">Designation</label>
              <input
                name="contact_designation"
                value={row.designation}
                onChange={(e) => update(row.key, "designation", e.target.value)}
                className="field-input"
                placeholder="Designation"
              />
            </div>
            <div>
              <label className="field-label">Mobile</label>
              <input
                name="contact_mobile"
                value={row.mobile}
                onChange={(e) => update(row.key, "mobile", e.target.value)}
                className="field-input"
                placeholder="+91 ..."
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                name="contact_email"
                type="email"
                value={row.email}
                onChange={(e) => update(row.key, "email", e.target.value)}
                className="field-input"
                placeholder="name@mp.gov.in"
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addRow} className="btn-secondary btn-sm">
        <Plus className="h-3.5 w-3.5" /> Add another contact person
      </button>
    </div>
  );
}
