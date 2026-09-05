import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getSession, type SessionPayload } from "./auth";

// Middleware already blocks unauthenticated requests from reaching these
// pages, but every server component/action re-checks here too, so nothing
// ever depends on middleware alone.
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireDataEntry(): Promise<SessionPayload> {
  const session = await requireUser();
  if (session.role !== Role.DATA_ENTRY) redirect("/");
  return session;
}
