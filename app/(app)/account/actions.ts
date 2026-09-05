"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session-helpers";

export async function changePasswordAction(formData: FormData) {
  const session = await requireUser();

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const fail = (reason: string) => redirect(`/account?error=${reason}`);

  if (newPassword.length < 6) fail("short");
  if (newPassword !== confirmPassword) fail("mismatch");

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) fail("invalid");

  const ok = await bcrypt.compare(currentPassword, user!.passwordHash);
  if (!ok) fail("invalid");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: session.sub }, data: { passwordHash } });

  redirect("/account?success=1");
}
