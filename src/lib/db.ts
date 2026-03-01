import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL has the correct protocol for SQLite
if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:") &&
    !process.env.DATABASE_URL.includes("://")
) {
    process.env.DATABASE_URL = `file:${process.env.DATABASE_URL}`;
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

console.log("📡 Initializing Prisma with URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Mask password if present

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
