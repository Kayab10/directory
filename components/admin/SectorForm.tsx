"use client";

import { useState } from "react";
import { SECTOR_ICON_OPTIONS, getSectorIcon } from "@/lib/icon-map";
import { SECTOR_COLOR_OPTIONS, getSectorTheme } from "@/lib/sector-theme";

export default function SectorForm({
  action,
  id,
  initial,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id?: string;
  initial?: { name?: string; description?: string | null; icon?: string; color?: string };
}) {
  const [icon, setIcon] = useState(initial?.icon ?? SECTOR_ICON_OPTIONS[0]);
  const [color, setColor] = useState(initial?.color ?? SECTOR_COLOR_OPTIONS[0]);

  return (
    <form action={action} className="card space-y-5 p-5">
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name="icon" value={icon} />
      <input type="hidden" name="color" value={color} />

      <div>
        <label className="field-label">Sector name</label>
        <input name="name" required defaultValue={initial?.name} className="field-input" placeholder="e.g. Agriculture" />
      </div>

      <div>
        <label className="field-label">Description (optional)</label>
        <textarea name="description" defaultValue={initial?.description ?? ""} rows={2} className="field-input" />
      </div>

      <div>
        <label className="field-label">Icon</label>
        <div className="flex flex-wrap gap-2">
          {SECTOR_ICON_OPTIONS.map((opt) => {
            const Icon = getSectorIcon(opt);
            const active = opt === icon;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => setIcon(opt)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 ${
                  active ? "border-navy-800 bg-navy-900/5" : "border-slate-200 hover:border-slate-300"
                }`}
                aria-label={opt}
              >
                <Icon className="h-5 w-5 text-navy-800" />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="field-label">Card colour</label>
        <div className="flex flex-wrap gap-2">
          {SECTOR_COLOR_OPTIONS.map((opt) => {
            const theme = getSectorTheme(opt);
            const active = opt === color;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => setColor(opt)}
                className={`h-9 w-9 rounded-full ${theme.bar} ${active ? "ring-2 ring-offset-2 ring-navy-800" : ""}`}
                aria-label={opt}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
