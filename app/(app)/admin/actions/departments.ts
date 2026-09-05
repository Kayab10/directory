"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { OrgType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireDataEntry } from "@/lib/session-helpers";

function str(v: FormDataEntryValue | null) {
  const s = v ? String(v).trim() : "";
  return s.length ? s : null;
}

function safePath(v: FormDataEntryValue | null, fallback: string) {
  const s = v ? String(v) : "";
  return s.startsWith("/") ? s : fallback;
}

const VALID_ORG_TYPES = new Set(Object.values(OrgType));

function contactsFromForm(formData: FormData) {
  const names = formData.getAll("contact_name").map(String);
  const designations = formData.getAll("contact_designation").map(String);
  const mobiles = formData.getAll("contact_mobile").map(String);
  const emails = formData.getAll("contact_email").map(String);

  const contacts: { name: string; designation: string | null; mobile: string | null; email: string | null }[] = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i]?.trim();
    const designation = designations[i]?.trim();
    const mobile = mobiles[i]?.trim();
    const email = emails[i]?.trim();
    if (!name && !designation && !mobile && !email) continue;
    contacts.push({
      name: name || "Not named",
      designation: designation || null,
      mobile: mobile || null,
      email: email || null,
    });
  }
  return contacts;
}

function departmentFields(formData: FormData) {
  const orgTypeRaw = String(formData.get("orgType") || "PARENT_DEPARTMENT");
  const orgType = (VALID_ORG_TYPES.has(orgTypeRaw as OrgType) ? orgTypeRaw : "PARENT_DEPARTMENT") as OrgType;

  return {
    name: String(formData.get("name") || "").trim(),
    orgType,
    officeAddress: str(formData.get("officeAddress")),
    mapUrl: str(formData.get("mapUrl")),
    website: str(formData.get("website")),
    ministerName: str(formData.get("ministerName")),
    headName: str(formData.get("headName")),
    headDesignation: str(formData.get("headDesignation")),
    paName: str(formData.get("paName")),
    paPhone: str(formData.get("paPhone")),
    paEmail: str(formData.get("paEmail")),
    paMobile: str(formData.get("paMobile")),
    officePhone: str(formData.get("officePhone")),
    email: str(formData.get("email")),
    mobile: str(formData.get("mobile")),
  };
}

export async function createDepartmentAction(formData: FormData) {
  await requireDataEntry();

  const sectorId = String(formData.get("sectorId") || "");
  const parentId = str(formData.get("parentId"));
  const fallback = parentId ? `/departments/${parentId}` : "/sectors";
  const fields = departmentFields(formData);

  if (!sectorId || !fields.name) redirect(fallback);

  const siblingCount = await prisma.department.count({
    where: { sectorId, parentId: parentId ?? null },
  });

  const dept = await prisma.department.create({
    data: {
      sectorId,
      parentId,
      order: siblingCount,
      ...fields,
      contacts: { create: contactsFromForm(formData) },
    },
    include: { sector: true },
  });

  revalidatePath("/");
  revalidatePath("/sectors");
  revalidatePath(`/sectors/${dept.sector.slug}`);
  revalidatePath("/heads");
  // New parent departments land on the sector page; new sub-organisations
  // land back on their parent department's profile.
  redirect(dept.parentId ? `/departments/${dept.parentId}` : `/sectors/${dept.sector.slug}`);
}

export async function updateDepartmentAction(formData: FormData) {
  await requireDataEntry();

  const id = String(formData.get("id") || "");
  const redirectTo = safePath(formData.get("redirectTo"), `/departments/${id}`);
  const fields = departmentFields(formData);
  if (!id || !fields.name) redirect(redirectTo);

  const contacts = contactsFromForm(formData);

  const dept = await prisma.$transaction(async (tx) => {
    await tx.contactPerson.deleteMany({ where: { departmentId: id } });
    return tx.department.update({
      where: { id },
      data: {
        ...fields,
        contacts: { create: contacts },
      },
      include: { sector: true, parent: true },
    });
  });

  revalidatePath("/");
  revalidatePath("/sectors");
  revalidatePath(`/sectors/${dept.sector.slug}`);
  revalidatePath(`/departments/${id}`);
  revalidatePath("/heads");
  redirect(redirectTo);
}

export async function deleteDepartmentAction(formData: FormData) {
  await requireDataEntry();
  const id = String(formData.get("id") || "");

  const dept = await prisma.department.findUnique({ where: { id }, include: { sector: true } });
  if (!dept) redirect("/sectors");

  // The record (and, if it's a parent department, everything under it -
  // sub-departments/boards/corporations/institutions and their contact
  // persons) is being removed, so we can never redirect back to its own
  // now-deleted page - always land somewhere that still exists.
  const destination = dept.parentId ? `/departments/${dept.parentId}` : `/sectors/${dept.sector.slug}`;

  await prisma.department.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/sectors");
  revalidatePath(`/sectors/${dept.sector.slug}`);
  revalidatePath(`/departments/${id}`);
  if (dept.parentId) revalidatePath(`/departments/${dept.parentId}`);
  revalidatePath("/heads");
  redirect(destination);
}
