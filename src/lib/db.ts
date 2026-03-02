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
        console.log(`📡 [DB] Production environment detected. Target: ${tmpPath}`);
        if (!fs.existsSync(tmpPath)) {
            const possiblePaths = [
                path.join(process.cwd(), "prisma", "dev.db"),
                path.join(process.cwd(), "dev.db"),
                path.join(process.cwd(), ".next/server/chunks", "dev.db"),
            ];

            console.log(`📡 [DB] Searching for source DB in: ${JSON.stringify(possiblePaths)}`);
            let found = false;
            for (const src of possiblePaths) {
                if (fs.existsSync(src)) {
                    try {
                        fs.copyFileSync(src, tmpPath);
                        console.log(`✅ [DB] Copied source DB from ${src} to ${tmpPath}`);
                        found = true;
                        break;
                    } catch (e) {
                        console.error(`❌ [DB] Failed to copy DB from ${src}:`, e);
                    }
                }
            }
            if (!found) {
                console.error(`❌ [DB] Could not find source dev.db in any possible path.`);
            }
        } else {
            console.log(`📡 [DB] /tmp/dev.db already exists.`);
        }
        return `file:${tmpPath}`;
    }

    // Local development
    const prismaDir = path.resolve(process.cwd(), "prisma");
    const localDbPath = path.join(prismaDir, "dev.db");

    // We prioritize making the path absolute to the prisma folder
    // This fixes issues where "file:./dev.db" might point to the project root instead of /prisma
    console.log(`📡 [DB] Local SQLite target: ${localDbPath}`);
    return `file:${localDbPath}`;
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
