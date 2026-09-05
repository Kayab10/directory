import type { LucideIcon } from "lucide-react";

export default function StatChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-600">
      <Icon className="h-4 w-4 text-navy-700" />
      <span className="font-semibold text-navy-900">{value}</span> {label}
    </span>
  );
}
