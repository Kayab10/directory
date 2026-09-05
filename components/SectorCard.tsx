import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSectorTheme } from "@/lib/sector-theme";

export default function SectorCard({
  slug,
  name,
  description,
  color,
  departmentCount,
  actions,
}: {
  slug: string;
  name: string;
  description?: string | null;
  color?: string | null;
  departmentCount?: number;
  actions?: React.ReactNode;
}) {
  const theme = getSectorTheme(color);

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${theme.solid}`}>
      {actions && <div className="absolute right-3 top-3 z-10 flex gap-1.5">{actions}</div>}
      <Link href={`/sectors/${slug}`} className="flex flex-1 flex-col p-5">
        <h3 className={`pr-16 text-lg font-bold ${theme.solidText}`}>{name}</h3>
        {description && <p className={`mt-1.5 line-clamp-2 text-sm ${theme.solidSubtext}`}>{description}</p>}
        <div className="mt-4 flex items-center justify-between">
          {typeof departmentCount === "number" && (
            <span className={`text-xs font-medium ${theme.solidSubtext}`}>
              {departmentCount} department{departmentCount === 1 ? "" : "s"}
            </span>
          )}
          <span className={`ml-auto flex items-center gap-1 text-sm font-semibold ${theme.solidText} group-hover:gap-1.5`}>
            View <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}
