"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({
  name,
  placeholder,
  autoComplete,
}: {
  name: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        name={name}
        type={visible ? "text" : "password"}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="field-input pl-10 pr-10"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
