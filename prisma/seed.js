const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@finance.dev",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // Create analyst user
  const analystPassword = await bcrypt.hash("analyst123", 10);
  const analyst = await prisma.user.create({
    data: {
      name: "Finance Analyst",
      email: "analyst@finance.dev",
      password: analystPassword,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  // Create viewer user
  const viewerPassword = await bcrypt.hash("viewer123", 10);
  const viewer = await prisma.user.create({
    data: {
      name: "Dashboard Viewer",
      email: "viewer@finance.dev",
      password: viewerPassword,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  // Seed financial records
  const categories = ["Salary", "Rent", "Utilities", "Marketing", "Sales", "Consulting", "Office Supplies", "Travel"];
  const now = new Date();

  const records = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const type = Math.random() > 0.4 ? "INCOME" : "EXPENSE";
    records.push({
      amount: parseFloat((Math.random() * 9000 + 1000).toFixed(2)),
      type,
      category: categories[Math.floor(Math.random() * categories.length)],
      date,
      notes: `Auto-generated ${type.toLowerCase()} record #${i + 1}`,
      createdById: admin.id,
    });
  }

  await prisma.financialRecord.createMany({ data: records });

  console.log("✅ Seed complete!");
  console.log("\n🔑 Demo Credentials:");
  console.log("  Admin   → admin@finance.dev    / admin123");
  console.log("  Analyst → analyst@finance.dev  / analyst123");
  console.log("  Viewer  → viewer@finance.dev   / viewer123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
