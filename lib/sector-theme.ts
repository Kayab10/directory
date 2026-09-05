// Literal Tailwind class names are used throughout (never built from a
// template string) so Tailwind's JIT scanner can find them at build time.
//
// Sector cards render as solid colour blocks (not white cards with an
// accent), so each theme is a full background + text pairing plus the
// lighter shades used for the small icon badges shown elsewhere (sector
// detail rows, dashboard tiles).
export type SectorTheme = {
  solid: string; // full-colour sector card background
  solidText: string; // primary text on the solid card
  solidSubtext: string; // secondary/description text on the solid card
  badgeBg: string; // icon badge background (light, used off the solid card)
  badgeText: string; // icon badge foreground
};

export const SECTOR_THEMES: Record<string, SectorTheme> = {
  green: { solid: "bg-green-700", solidText: "text-white", solidSubtext: "text-green-50", badgeBg: "bg-green-100", badgeText: "text-green-700" },
  blue: { solid: "bg-blue-600", solidText: "text-white", solidSubtext: "text-blue-50", badgeBg: "bg-blue-100", badgeText: "text-blue-700" },
  teal: { solid: "bg-teal-700", solidText: "text-white", solidSubtext: "text-teal-50", badgeBg: "bg-teal-100", badgeText: "text-teal-700" },
  orange: { solid: "bg-orange-700", solidText: "text-white", solidSubtext: "text-orange-50", badgeBg: "bg-orange-100", badgeText: "text-orange-700" },
  indigo: { solid: "bg-indigo-700", solidText: "text-white", solidSubtext: "text-indigo-50", badgeBg: "bg-indigo-100", badgeText: "text-indigo-700" },
  pink: { solid: "bg-pink-700", solidText: "text-white", solidSubtext: "text-pink-50", badgeBg: "bg-pink-100", badgeText: "text-pink-700" },
  red: { solid: "bg-red-600", solidText: "text-white", solidSubtext: "text-red-50", badgeBg: "bg-red-100", badgeText: "text-red-700" },
  slate: { solid: "bg-slate-600", solidText: "text-white", solidSubtext: "text-slate-50", badgeBg: "bg-slate-100", badgeText: "text-slate-700" },
  violet: { solid: "bg-violet-600", solidText: "text-white", solidSubtext: "text-violet-50", badgeBg: "bg-violet-100", badgeText: "text-violet-700" },
  yellow: { solid: "bg-yellow-700", solidText: "text-white", solidSubtext: "text-yellow-50", badgeBg: "bg-yellow-100", badgeText: "text-yellow-700" },
};

export const SECTOR_COLOR_OPTIONS = Object.keys(SECTOR_THEMES);

export function getSectorTheme(color?: string | null): SectorTheme {
  return (color && SECTOR_THEMES[color]) || SECTOR_THEMES.blue;
}
