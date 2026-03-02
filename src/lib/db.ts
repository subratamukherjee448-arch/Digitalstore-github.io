import { PrismaClient } from "@prisma/client";

import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Diagnostic logging for Vercel
const logFiles = (dir: string) => {
    try {
        if (fs.existsSync(dir)) {
            console.log(`📂 Files in ${dir}:`, fs.readdirSync(dir));
        } else {
            console.log(`❌ Directory not found: ${dir}`);
        }
    } catch (e) {
        console.log(`❌ Error listing ${dir}:`, e);
    }
};

const cwd = process.cwd();
console.log("📍 Current working directory:", cwd);
logFiles(cwd);
logFiles(path.join(cwd, "prisma"));

const dbPath = path.join(cwd, "prisma", "dev.db");
console.log("💾 Targeted DB Path:", dbPath);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasources: {
            db: {
                url: `file:${dbPath}`,
            },
        },
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
