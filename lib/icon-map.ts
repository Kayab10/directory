import {
  Sprout,
  GraduationCap,
  Leaf,
  Home,
  Landmark,
  Users,
  HeartPulse,
  Building2,
  ShieldCheck,
  MoreHorizontal,
  Layers,
  type LucideIcon,
} from "lucide-react";

export const SECTOR_ICONS: Record<string, LucideIcon> = {
  Sprout,
  GraduationCap,
  Leaf,
  Home,
  Landmark,
  Users,
  HeartPulse,
  Building2,
  ShieldCheck,
  MoreHorizontal,
  Layers,
};

export function getSectorIcon(name?: string | null): LucideIcon {
  return (name && SECTOR_ICONS[name]) || Layers;
}

export const SECTOR_ICON_OPTIONS = Object.keys(SECTOR_ICONS);
