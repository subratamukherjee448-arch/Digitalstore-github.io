import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createReadStream, existsSync } from "fs";
import { join } from "path";
import { Readable } from "stream";

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        // Find token
        const downloadToken = await prisma.downloadToken.findUnique({
            where: { token },
            include: { order: true },
        });

        if (!downloadToken) {
            return NextResponse.json({ error: "Invalid download token" }, { status: 404 });
        }

        // Check if order is paid
        if (downloadToken.order.status !== "PAID") {
            return NextResponse.json({ error: "Order not paid" }, { status: 403 });
        }

        // Check expiry
        if (new Date() > downloadToken.expiresAt) {
            return NextResponse.json(
                { error: "Download link has expired. Please contact support." },
                { status: 403 }
            );
        }

        // Check download count
        if (downloadToken.downloadCount >= downloadToken.maxDownloads) {
            return NextResponse.json(
                { error: "Maximum download limit reached. Please contact support." },
                { status: 403 }
            );
        }

        // Get product file path
        const product = await prisma.product.findUnique({
            where: { id: downloadToken.productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const storagePath = process.env.STORAGE_PATH || "./storage";
        const filePath = join(process.cwd(), storagePath, product.filePath);

        if (!existsSync(filePath)) {
            console.error("File not found:", filePath);
            // Return a sample response for demo purposes
            await prisma.downloadToken.update({
                where: { token },
                data: { downloadCount: { increment: 1 } },
            });

            return new NextResponse(
                `This is a demo download for: ${product.title}\n\nIn production, the actual file would be served from secure storage.`,
                {
                    headers: {
                        "Content-Type": "text/plain",
                        "Content-Disposition": `attachment; filename="${product.title.replace(/[^a-zA-Z0-9 ]/g, "")}_demo.txt"`,
                    },
                }
            );
        }

        // Increment download count
        await prisma.downloadToken.update({
            where: { token },
            data: { downloadCount: { increment: 1 } },
        });

        // Stream the file
        const fs = require("fs");
        const fileBuffer = fs.readFileSync(filePath);
        const ext = product.format === "EBOOK" ? "pdf" : "mp3";
        const contentType = product.format === "EBOOK" ? "application/pdf" : "audio/mpeg";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${product.title.replace(/[^a-zA-Z0-9 ]/g, "")}.${ext}"`,
                "Content-Length": fileBuffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("Download error:", error);
        return NextResponse.json(
            { error: "Download failed" },
            { status: 500 }
        );
    }
}
