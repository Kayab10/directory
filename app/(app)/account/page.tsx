import { KeyRound } from "lucide-react";
import { requireUser } from "@/lib/session-helpers";
import PageHeader from "@/components/PageHeader";
import PasswordField from "@/components/PasswordField";
import { changePasswordAction } from "./actions";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  short: "New password must be at least 6 characters long.",
  mismatch: "New password and confirmation do not match.",
  invalid: "Current password is incorrect.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const session = await requireUser();
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="My Account" subtitle={`Signed in as ${session.username}`} />

      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2 text-navy-900">
          <KeyRound className="h-5 w-5" />
          <h2 className="text-lg font-bold">Change Password</h2>
        </div>

        {params.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {ERROR_MESSAGES[params.error] ?? "Could not update password."}
          </div>
        )}
        {params.success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm text-green-700">
            Password updated successfully.
          </div>
        )}

        <form action={changePasswordAction} className="space-y-4">
          <div>
            <label className="field-label">Current password</label>
            <PasswordField name="currentPassword" autoComplete="current-password" />
          </div>
          <div>
            <label className="field-label">New password</label>
            <PasswordField name="newPassword" autoComplete="new-password" />
          </div>
          <div>
            <label className="field-label">Confirm new password</label>
            <PasswordField name="confirmPassword" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
