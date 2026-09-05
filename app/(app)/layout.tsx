import { requireUser } from "@/lib/session-helpers";
import AppShell from "@/components/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();

  return (
    <AppShell username={session.username} role={session.role}>
      {children}
    </AppShell>
  );
}
