import type { LucideIcon } from "lucide-react";

const COLORS = {
  green: "bg-green-50 text-green-700 hover:bg-green-100",
  amber: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  slate: "bg-slate-100 text-slate-600 hover:bg-slate-200",
} as const;

export default function ActionPill({
  href,
  icon: Icon,
  label,
  color,
  external,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  color: keyof typeof COLORS;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${COLORS[color]}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </a>
  );
}
