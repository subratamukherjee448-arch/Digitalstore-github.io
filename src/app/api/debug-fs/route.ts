import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    const results: any = {};

    const scan = (dir: string, label: string) => {
        try {
            if (fs.existsSync(dir)) {
                results[label] = {
                    exists: true,
                    files: fs.readdirSync(dir),
                };
            } else {
                results[label] = { exists: false };
            }
        } catch (e: any) {
            results[label] = { error: e.message };
        }
    };

    scan(process.cwd(), "cwd");
    scan(path.join(process.cwd(), "prisma"), "cwd_prisma");
    scan(path.join(process.cwd(), ".next"), "cwd_next");
    scan("/tmp", "tmp");

    // Try to find dev.db recursively up to 3 levels
    const findFile = (dir: string, target: string, depth = 0): string[] => {
        if (depth > 3) return [];
        let found: string[] = [];
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const full = path.join(dir, item);
                if (item === target) found.push(full);
                if (fs.statSync(full).isDirectory() && !item.startsWith(".")) {
                    found = found.concat(findFile(full, target, depth + 1));
                }
            }
        } catch { }
        return found;
    };

    results.found_dev_db = findFile(process.cwd(), "dev.db");

    return NextResponse.json(results);
}
