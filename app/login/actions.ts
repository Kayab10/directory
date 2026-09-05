"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

function safeNext(next: FormDataEntryValue | null) {
  const value = String(next || "/");
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNext(formData.get("next"));

  if (!username || !password) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const user = await prisma.user.findUnique({ where: { username } });
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !valid) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createSessionToken({ sub: user.id, username: user.username, role: user.role });
  await setSessionCookie(token);
  redirect(next);
}
