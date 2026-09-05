import { PrismaClient, OrgType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SECTORS = [
  { name: "Agriculture", slug: "agriculture", icon: "Sprout", color: "green", description: "Departments and organisations supporting agriculture, animal husbandry, fisheries and farmer welfare in Madhya Pradesh." },
  { name: "Education", slug: "education", icon: "GraduationCap", color: "blue", description: "Departments and institutions responsible for school, higher and technical education." },
  { name: "Environment", slug: "environment", icon: "Leaf", color: "emerald", description: "Departments overseeing forests, environment and climate matters." },
  { name: "Housing", slug: "housing", icon: "Home", color: "amber", description: "Departments responsible for housing and urban development." },
  { name: "Governance", slug: "governance", icon: "Landmark", color: "indigo", description: "General administration, revenue and governance departments." },
  { name: "Social", slug: "social", icon: "Users", color: "rose", description: "Departments responsible for social justice and welfare programmes." },
  { name: "Health", slug: "health", icon: "HeartPulse", color: "red", description: "Departments and institutions responsible for public health, medical education and family welfare services." },
  { name: "Infrastructure", slug: "infrastructure", icon: "Building2", color: "slate", description: "Departments responsible for roads, energy, water and public infrastructure." },
  { name: "Law Enforcement", slug: "law-enforcement", icon: "ShieldCheck", color: "cyan", description: "Departments responsible for police, home affairs and public safety." },
  { name: "Others", slug: "others", icon: "MoreHorizontal", color: "violet", description: "Other departments and organisations of the Government of Madhya Pradesh." },
];

async function main() {
  // --- Users -------------------------------------------------------------
  const users: Array<{ username: string; password: string; role: Role }> = [
    { username: "admin", password: "admin123", role: Role.DATA_ENTRY },
    { username: "user", password: "user123", role: Role.GENERAL },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { username: u.username, passwordHash, role: u.role },
    });
  }

  // --- Sectors -------------------------------------------------------------
  const sectorMap: Record<string, string> = {};
  for (let i = 0; i < SECTORS.length; i++) {
    const s = SECTORS[i];
    const sector = await prisma.sector.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, order: i },
    });
    sectorMap[s.slug] = sector.id;
  }

  // --- Sample data: Agriculture sector (from the product spec) ------------
  const agri = sectorMap["agriculture"];

  const animalHusbandry = await prisma.department.create({
    data: {
      sectorId: agri,
      name: "Department of Animal Husbandry & Dairying",
      orgType: OrgType.PARENT_DEPARTMENT,
      order: 0,
    },
  });
  for (const [i, name] of [
    "MP State Livestock and Poultry Development Corporation",
    "M.P. Gausamvardhan Board",
    "Madhya Pradesh State Cooperative Dairy Federation (MPCDF)",
    "National Dairy Development Board (NDDB)",
    "Nanaji Deshmukh Veterinary Science University, Jabalpur",
  ].entries()) {
    await prisma.department.create({
      data: {
        sectorId: agri,
        parentId: animalHusbandry.id,
        name,
        orgType: OrgType.CORPORATION,
        order: i,
      },
    });
  }

  const farmerWelfare = await prisma.department.create({
    data: {
      sectorId: agri,
      name: "Farmer Welfare & Agriculture Development Department",
      orgType: OrgType.PARENT_DEPARTMENT,
      order: 1,
    },
  });
  for (const [i, name] of [
    "Department of Horticulture & Food Processing",
    "Directorate of Agriculture Engineering",
    "Madhya Pradesh State Agricultural Marketing Board (Mandi Board)",
    "MP State Agro Industries Corporation Limited",
    "Madhya Pradesh State Seed and Farm Development Corporation",
    "Madhya Pradesh State Seed Certification Agency",
    "M.P. State Cooperative Marketing Federation Ltd. (MARKFED)",
  ].entries()) {
    await prisma.department.create({
      data: {
        sectorId: agri,
        parentId: farmerWelfare.id,
        name,
        orgType: OrgType.SUB_DEPARTMENT,
        order: i,
      },
    });
  }

  const fisherman = await prisma.department.create({
    data: {
      sectorId: agri,
      name: "Fisherman Welfare & Fisheries Development Department",
      orgType: OrgType.PARENT_DEPARTMENT,
      order: 2,
    },
  });
  await prisma.department.create({
    data: {
      sectorId: agri,
      parentId: fisherman.id,
      name: "M.P. Fish Federation (Cooperative) Limited",
      orgType: OrgType.SUB_DEPARTMENT,
      order: 0,
    },
  });

  // --- Sample data: Education sector (from the product spec, section 6) ---
  const edu = sectorMap["education"];
  const techEdu = await prisma.department.create({
    data: {
      sectorId: edu,
      name: "Department of Technical Education, Skill Development & Employment",
      orgType: OrgType.PARENT_DEPARTMENT,
      officeAddress: "Vallabh Bhawan II, First Floor, Bhopal",
      headName: "Shri Manish Singh",
      headDesignation: "Principal Secretary",
      email: "pstechedu@mp.gov.in",
      order: 0,
    },
  });
  void techEdu;

  console.log("Seed complete. Demo logins -> admin/admin123 (Data Entry), user/user123 (General).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
