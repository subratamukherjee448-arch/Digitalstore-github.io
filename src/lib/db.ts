import { PrismaClient } from "@prisma/client";

const getDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;
    if (url && !url.startsWith("file:") && !url.includes("://")) {
        return `file:${url}`;
    }
    return url;
};

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasources: {
            db: {
                url: getDatabaseUrl(),
            },
        },
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
