import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL, NODE_ENV } from "./env.config.js";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("database is connected successfully");
  } catch (error) {
    console.error(`database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
