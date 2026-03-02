import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * For SQLite to work on Vercel, we must:
 * 1. Find the bundled database file (created during build).
 * 2. Copy it to the writable /tmp directory.
 * 3. Point Prisma to this writable copy.
 */
const getDatabaseUrl = () => {
    const tmpPath = path.join("/tmp", "dev.db");

    // In production (Vercel), we copy the bundled DB to /tmp for read/write access
    if (process.env.NODE_ENV === "production") {
        if (!fs.existsSync(tmpPath)) {
            const possiblePaths = [
                path.join(process.cwd(), "prisma", "dev.db"),
                path.join(process.cwd(), "dev.db"),
                path.join(process.cwd(), ".next/server/chunks", "dev.db"),
            ];

            for (const src of possiblePaths) {
                if (fs.existsSync(src)) {
                    try {
                        fs.copyFileSync(src, tmpPath);
                        console.log(`✅ Production DB initialized at ${tmpPath}`);
                        break;
                    } catch (e) {
                        console.error(`❌ Failed to copy DB:`, e);
                    }
                }
            }
        }
        return `file:${tmpPath}`;
    }

    // Local development
    return process.env.SQLITE_URL || `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
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
