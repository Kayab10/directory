// Literal Tailwind class names are used throughout (never built from a
// template string) so Tailwind's JIT scanner can find them at build time.
export type SectorTheme = {
  bar: string; // top accent bar on the sector card
  badgeBg: string; // icon badge background
  badgeText: string; // icon badge foreground
  ring: string; // hover ring accent
};

export const SECTOR_THEMES: Record<string, SectorTheme> = {
  green: { bar: "bg-green-500", badgeBg: "bg-green-100", badgeText: "text-green-700", ring: "hover:ring-green-300" },
  blue: { bar: "bg-blue-500", badgeBg: "bg-blue-100", badgeText: "text-blue-700", ring: "hover:ring-blue-300" },
  emerald: { bar: "bg-emerald-500", badgeBg: "bg-emerald-100", badgeText: "text-emerald-700", ring: "hover:ring-emerald-300" },
  amber: { bar: "bg-amber-500", badgeBg: "bg-amber-100", badgeText: "text-amber-700", ring: "hover:ring-amber-300" },
  indigo: { bar: "bg-indigo-500", badgeBg: "bg-indigo-100", badgeText: "text-indigo-700", ring: "hover:ring-indigo-300" },
  rose: { bar: "bg-rose-500", badgeBg: "bg-rose-100", badgeText: "text-rose-700", ring: "hover:ring-rose-300" },
  red: { bar: "bg-red-500", badgeBg: "bg-red-100", badgeText: "text-red-700", ring: "hover:ring-red-300" },
  slate: { bar: "bg-slate-500", badgeBg: "bg-slate-100", badgeText: "text-slate-700", ring: "hover:ring-slate-300" },
  cyan: { bar: "bg-cyan-500", badgeBg: "bg-cyan-100", badgeText: "text-cyan-700", ring: "hover:ring-cyan-300" },
  violet: { bar: "bg-violet-500", badgeBg: "bg-violet-100", badgeText: "text-violet-700", ring: "hover:ring-violet-300" },
};

export const SECTOR_COLOR_OPTIONS = Object.keys(SECTOR_THEMES);

export function getSectorTheme(color?: string | null): SectorTheme {
  return (color && SECTOR_THEMES[color]) || SECTOR_THEMES.blue;
}
