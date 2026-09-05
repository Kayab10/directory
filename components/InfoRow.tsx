import type { LucideIcon } from "lucide-react";
import { Mail, Phone, Smartphone, MapPin, Globe } from "lucide-react";

type Kind = "phone" | "mobile" | "email" | "address" | "website" | "plain";

const ICONS: Record<Kind, LucideIcon> = {
  phone: Phone,
  mobile: Smartphone,
  email: Mail,
  address: MapPin,
  website: Globe,
  plain: Mail,
};

function hrefFor(kind: Kind, value: string) {
  switch (kind) {
    case "phone":
    case "mobile":
      return `tel:${value.replace(/\s+/g, "")}`;
    case "email":
      return `mailto:${value}`;
    case "address":
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
    case "website":
      return value.startsWith("http") ? value : `https://${value}`;
    default:
      return undefined;
  }
}

export default function InfoRow({
  kind,
  label,
  value,
}: {
  kind: Kind;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  const Icon = ICONS[kind];
  const href = hrefFor(kind, value);

  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        {href ? (
          <a
            href={href}
            target={kind === "address" || kind === "website" ? "_blank" : undefined}
            rel={kind === "address" || kind === "website" ? "noreferrer" : undefined}
            className="break-words text-sm font-medium text-navy-800 hover:text-navy-900 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-sm font-medium text-navy-900">{value}</p>
        )}
      </div>
    </div>
  );
}
