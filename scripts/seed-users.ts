import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create test users with different roles
  const testUsers = [
    {
      name: "Admin User",
      email: "admin@vishnu.edu.in",
      password: "admin123",
      role: UserRole.ADMIN,
    },
    {
      name: "Organizer User",
      email: "organizer@vishnu.edu.in",
      password: "organizer123",
      role: UserRole.ORGANIZER,
    },
    {
      name: "Participant User",
      email: "participant@vishnu.edu.in",
      password: "participant123",
      role: UserRole.PARTICIPANT,
    },
  ];

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        },
      });
      console.log(
        `Created user: ${userData.email} with role: ${userData.role}`
      );
    } else {
      console.log(`User ${userData.email} already exists`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
