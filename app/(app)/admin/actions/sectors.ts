"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireDataEntry } from "@/lib/session-helpers";
import { slugify } from "@/lib/slug";
import { SECTOR_ICON_OPTIONS } from "@/lib/icon-map";
import { SECTOR_COLOR_OPTIONS } from "@/lib/sector-theme";

function str(v: FormDataEntryValue | null) {
  const s = v ? String(v).trim() : "";
  return s.length ? s : null;
}

async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = slugify(base) || "sector";
  let n = 1;
  // Small directory, a handful of sectors - a simple loop is plenty.
  while (
    await prisma.sector.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}

export async function createSectorAction(formData: FormData) {
  await requireDataEntry();

  const name = String(formData.get("name") || "").trim();
  if (!name) redirect("/");

  const icon = SECTOR_ICON_OPTIONS.includes(String(formData.get("icon"))) ? String(formData.get("icon")) : "Layers";
  const color = SECTOR_COLOR_OPTIONS.includes(String(formData.get("color"))) ? String(formData.get("color")) : "blue";
  const description = str(formData.get("description"));
  const count = await prisma.sector.count();
  const slug = await uniqueSlug(name);

  await prisma.sector.create({
    data: { name, slug, description, icon, color, order: count },
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateSectorAction(formData: FormData) {
  await requireDataEntry();

  const id = String(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  if (!id || !name) redirect("/");

  const icon = SECTOR_ICON_OPTIONS.includes(String(formData.get("icon"))) ? String(formData.get("icon")) : "Layers";
  const color = SECTOR_COLOR_OPTIONS.includes(String(formData.get("color"))) ? String(formData.get("color")) : "blue";
  const description = str(formData.get("description"));

  const existing = await prisma.sector.findUnique({ where: { id } });
  if (!existing) redirect("/");

  const slug = name === existing.name ? existing.slug : await uniqueSlug(name, id);

  await prisma.sector.update({
    where: { id },
    data: { name, slug, description, icon, color },
  });

  revalidatePath("/");
  revalidatePath(`/sectors/${existing.slug}`);
  revalidatePath(`/sectors/${slug}`);
  redirect(`/sectors/${slug}`);
}

export async function deleteSectorAction(formData: FormData) {
  await requireDataEntry();
  const id = String(formData.get("id"));
  const sector = await prisma.sector.findUnique({ where: { id } });
  if (!sector) redirect("/");

  // Cascades in the database: every department in this sector (and their
  // sub-departments and contact persons) is deleted along with it.
  await prisma.sector.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/sectors/${sector.slug}`);
  revalidatePath("/heads");
  redirect("/");
}
