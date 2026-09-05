"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Search,
  Menu,
  X,
  LogOut,
  KeyRound,
  ChevronDown,
} from "lucide-react";
import { logoutAction } from "@/app/actions/logout";

type NavItem = { href: string; label: string; icon: typeof LayoutGrid };

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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", label: "Sectors", icon: LayoutGrid },
    { href: "/heads", label: "Department's Head", icon: Users },
    { href: "/search", label: "Search", icon: Search },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const SidebarContent = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              active ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mp-emblem.jpeg" alt="Emblem of the Government of Madhya Pradesh" className="h-9 w-9 rounded-full object-cover" />
              <div className="leading-tight">
                <p className="text-sm font-bold text-navy-900 sm:text-base">Government Directory</p>
                <p className="hidden text-xs text-slate-500 sm:block">Government of Madhya Pradesh</p>
              </div>
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Users className="h-3.5 w-3.5" />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-4 text-navy-900">{username}</span>
                <span className="block text-[11px] leading-4 text-slate-500">
                  {role === "DATA_ENTRY" ? "Data Entry User" : "General User"}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <KeyRound className="h-4 w-4" /> Change password
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          {SidebarContent}
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-navy-950/40" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                <span className="text-sm font-bold text-navy-900">Menu</span>
                <button
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {SidebarContent}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
