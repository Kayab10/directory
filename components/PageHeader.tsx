import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; href?: string };

export default function PageHeader({
  crumbs,
  title,
  subtitle,
  actions,
}: {
  crumbs?: Crumb[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
        <Link href="/" className="flex items-center gap-1 hover:text-navy-800">
          <Home className="h-3.5 w-3.5" /> Home
        </Link>
        {crumbs?.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            {c.href ? (
              <Link href={c.href} className="hover:text-navy-800">
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-navy-800">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
