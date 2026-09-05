import { ShieldCheck, User, Landmark } from "lucide-react";
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
    <main className="min-h-screen bg-navy-950 lg:bg-gradient-to-br lg:from-slate-50 lg:to-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="hidden flex-col justify-center px-12 lg:flex">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
            <Landmark className="h-6 w-6" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy-700">
            Digital Government Services
          </p>
          <h1 className="max-w-md text-4xl font-bold leading-tight text-navy-900">
            A connected directory for better public service.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-slate-500">
            Secure access to the Government of Madhya Pradesh business directory, designed for
            efficient and responsible administration.
          </p>
          <div className="mt-8 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-navy-700" />
            Protected access for authorised government users
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="card w-full max-w-sm p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mp-emblem.jpeg"
                alt="Emblem of the Government of Madhya Pradesh"
                className="mb-4 h-16 w-16 rounded-full object-cover shadow"
              />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Official Access Portal
              </p>
              <h2 className="mt-1 text-2xl font-bold text-navy-900">Government Directory</h2>
              <p className="mt-1 text-sm font-semibold text-navy-700">Government of Madhya Pradesh</p>
            </div>

            {hasError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                Incorrect username or password. Please try again.
              </div>
            )}

            <form action={loginAction} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={next} />
              <div>
                <label className="field-label" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    autoFocus
                    placeholder="Enter your username"
                    className="field-input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <PasswordField name="password" placeholder="Enter your password" autoComplete="current-password" />
              </div>

              <button type="submit" className="btn-primary w-full py-3">
                Login
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-400">
              Use your authorised account credentials to continue.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
