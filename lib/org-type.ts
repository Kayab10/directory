import type { OrgType } from "@prisma/client";

export const ORG_TYPE_LABELS: Record<OrgType, string> = {
  PARENT_DEPARTMENT: "Parent Department",
  SUB_DEPARTMENT: "Sub Department",
  BOARD: "Board",
  CORPORATION: "Corporation",
  INSTITUTION: "Institution",
};

export const ORG_TYPE_OPTIONS: OrgType[] = [
  "SUB_DEPARTMENT",
  "BOARD",
  "CORPORATION",
  "INSTITUTION",
] as OrgType[];
