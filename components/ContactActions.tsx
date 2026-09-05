import { Phone, Smartphone, Mail, MapPin, Globe } from "lucide-react";
import ActionPill from "./ActionPill";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function ContactActions({
  address,
  addressLabel = "Address",
  phone,
  mobile,
  email,
  website,
}: {
  address?: string | null;
  addressLabel?: string;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
}) {
  const hasAny = address || phone || mobile || email || website;
  if (!hasAny) return null;

  return (
    <div className="space-y-2.5">
      {address && (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{addressLabel}</p>
          <p className="text-sm text-slate-700">{address}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {phone && <ActionPill color="green" icon={Phone} label="Call" href={`tel:${phone.replace(/\s+/g, "")}`} />}
        {mobile && (
          <ActionPill color="green" icon={Smartphone} label="Mobile" href={`tel:${mobile.replace(/\s+/g, "")}`} />
        )}
        {address && <ActionPill color="amber" icon={MapPin} label="Map" href={mapsUrl(address)} external />}
        {email && <ActionPill color="blue" icon={Mail} label="Email" href={`mailto:${email}`} />}
        {website && (
          <ActionPill
            color="slate"
            icon={Globe}
            label="Website"
            href={website.startsWith("http") ? website : `https://${website}`}
            external
          />
        )}
      </div>
    </div>
  );
}
