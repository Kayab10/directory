import { LogIn } from "lucide-react";
import { loginAction } from "./actions";
import PasswordField from "@/components/PasswordField";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";
  const next = params.next && params.next.startsWith("/") ? params.next : "/";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <div className="flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mp-emblem.jpeg"
          alt="Emblem of the Government of Madhya Pradesh"
          className="mb-4 h-16 w-16 rounded-full object-cover shadow"
        />
        <h1 className="text-xl font-bold text-navy-900">Government Directory</h1>
        <p className="mt-1 text-sm text-slate-500">Government of Madhya Pradesh</p>
      </div>

      <div className="card mt-6 w-full max-w-sm p-6 sm:p-8">
        {hasError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            Incorrect username or password. Please try again.
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              autoFocus
              placeholder="Enter username"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <PasswordField name="password" placeholder="Enter password" autoComplete="current-password" />
          </div>

          <button type="submit" className="btn-primary w-full py-3">
            <LogIn className="h-4 w-4" /> Sign In
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Use your authorised account credentials to continue.
      </p>
    </main>
  );
}
