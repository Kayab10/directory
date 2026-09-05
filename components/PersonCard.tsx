import { UserCircle2 } from "lucide-react";
import InfoRow from "./InfoRow";

export default function PersonCard({
  name,
  designation,
  email,
  phone,
  mobile,
  accent = "border-l-navy-800",
  actions,
}: {
  name?: string | null;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  accent?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 ${accent} bg-white p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UserCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-navy-900">{name || "Not available"}</p>
            {designation && <p className="text-sm text-slate-500">{designation}</p>}
          </div>
        </div>
        {actions}
      </div>
      {(email || phone || mobile) && (
        <div className="mt-3 space-y-0.5 border-t border-slate-100 pt-3">
          <InfoRow kind="email" label="Email" value={email} />
          <InfoRow kind="phone" label="Office Phone" value={phone} />
          <InfoRow kind="mobile" label="Mobile" value={mobile} />
        </div>
      )}
    </div>
  );
}
