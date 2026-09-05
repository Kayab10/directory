"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Users, Search, Menu, X, LogOut, KeyRound } from "lucide-react";
import { logoutAction } from "@/app/actions/logout";

type NavItem = { href: string; label: string; icon: typeof Home };

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sectors", label: "Sectors", icon: Layers },
  { href: "/heads", label: "Department's Head", icon: Users },
  { href: "/search", label: "Search", icon: Search },
];

export default function AppShell({
  username,
  role,
  children,
}: {
  username: string;
  role: "DATA_ENTRY" | "GENERAL";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const SidebarContent = (
    <>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="px-3.5 py-2">
          <p className="text-sm font-semibold text-navy-900">{username}</p>
          <p className="text-xs text-slate-500">{role === "DATA_ENTRY" ? "Data Entry User" : "General User"}</p>
        </div>
        <Link
          href="/account"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <KeyRound className="h-4 w-4" /> Change Password
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mp-emblem.jpeg" alt="Emblem of the Government of Madhya Pradesh" className="h-9 w-9 rounded-full object-cover" />
            <p className="text-base font-bold text-navy-900">Government Directory</p>
          </Link>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          {SidebarContent}
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-navy-950/40" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
                <span className="text-sm font-bold text-navy-900">Menu</span>
                <button
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto">{SidebarContent}</div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
