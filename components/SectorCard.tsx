import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSectorIcon } from "@/lib/icon-map";
import { getSectorTheme } from "@/lib/sector-theme";

export default function SectorCard({
  slug,
  name,
  description,
  icon,
  color,
  departmentCount,
  actions,
}: {
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  departmentCount?: number;
  actions?: React.ReactNode;
}) {
  const Icon = getSectorIcon(icon);
  const theme = getSectorTheme(color);

  return (
    <div
      className={`group card relative flex flex-col overflow-hidden ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg ${theme.ring}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1.5 ${theme.bar}`} />
      <Link href={`/sectors/${slug}`} className="flex flex-1 flex-col p-5">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${theme.badgeBg} ${theme.badgeText}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-navy-900">{name}</h3>
        {description && <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{description}</p>}
        <div className="mt-4 flex items-center justify-between">
          {typeof departmentCount === "number" && (
            <span className="text-xs font-medium text-slate-400">
              {departmentCount} department{departmentCount === 1 ? "" : "s"}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-navy-800 group-hover:gap-1.5">
            View <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
      {actions && <div className="flex gap-2 border-t border-slate-100 px-5 py-3">{actions}</div>}
    </div>
  );
}
