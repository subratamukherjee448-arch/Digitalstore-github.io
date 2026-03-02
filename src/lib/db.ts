import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const getDatabaseUrl = () => {
    const tmpPath = path.join("/tmp", "dev.db");

    // If we already have it in /tmp, use it
    if (fs.existsSync(tmpPath)) {
        return `file:${tmpPath}`;
    }

    // Otherwise, find the bundled one and copy it
    const possiblePaths = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
        // Vercel specific search
        ...["", "prisma", ".next/server/chunks"].map(p => path.join(process.cwd(), p, "dev.db"))
    ];

    for (const src of possiblePaths) {
        if (fs.existsSync(src)) {
            try {
                fs.copyFileSync(src, tmpPath);
                console.log(`✅ Copied DB from ${src} to ${tmpPath}`);
                return `file:${tmpPath}`;
            } catch (e) {
                console.error(`❌ Failed to copy DB from ${src}:`, e);
            }
        }
    }

    console.warn("⚠️ No bundled DB found, using default path (may fail on Vercel)");
    return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
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
