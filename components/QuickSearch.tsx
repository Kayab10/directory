import { Search } from "lucide-react";

export default function QuickSearch({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/search" method="GET" className="relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search sectors, departments, organizations, heads, contact"
        className="field-input pl-10"
      />
    </form>
  );
}
