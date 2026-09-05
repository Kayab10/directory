import { Layers, Building2, UserSquare2, Landmark, Headset, Contact } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

const TILES = [
  { key: "sectors", label: "Sectors", icon: Layers, badgeBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { key: "departments", label: "Departments", icon: Building2, badgeBg: "bg-blue-50", iconColor: "text-blue-600" },
  { key: "heads", label: "Dept. Heads", icon: UserSquare2, badgeBg: "bg-violet-50", iconColor: "text-violet-600" },
  { key: "organisations", label: "Organizations", icon: Landmark, badgeBg: "bg-orange-50", iconColor: "text-orange-600" },
  { key: "pa", label: "PA / Assistant", icon: Headset, badgeBg: "bg-teal-50", iconColor: "text-teal-600" },
  { key: "contacts", label: "Contact Persons", icon: Contact, badgeBg: "bg-pink-50", iconColor: "text-pink-600" },
] as const;

export default async function DashboardPage() {
  const [sectors, departments, heads, organisations, pa, contacts] = await Promise.all([
    prisma.sector.count(),
    prisma.department.count({ where: { parentId: null } }),
    prisma.department.count({ where: { headName: { not: null } } }),
    prisma.department.count({ where: { NOT: { parentId: null } } }),
    prisma.department.count({ where: { paName: { not: null } } }),
    prisma.contactPerson.count(),
  ]);

  const values: Record<(typeof TILES)[number]["key"], number> = {
    sectors,
    departments,
    heads,
    organisations,
    pa,
    contacts,
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Government of Madhya Pradesh directory overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.key} className="card p-5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tile.badgeBg} ${tile.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-navy-900">{values[tile.key]}</p>
              <p className="text-sm text-slate-500">{tile.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
