import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

// PUT update product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        // Fetch existing product to check if filePath changed
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
            select: { filePath: true },
        });

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                title: body.title,
                author: body.author,
                description: body.description,
                price: body.price,
                format: body.format,
                category: body.category,
                coverUrl: body.coverUrl,
                filePath: body.filePath,
                sampleUrl: body.sampleUrl || "",
                featured: body.featured,
                active: body.active,
            },
        });

        // If file path changed, reset download limits and extend expiry for previous buyers
        if (existingProduct && body.filePath && existingProduct.filePath !== body.filePath) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            await prisma.downloadToken.updateMany({
                where: { productId: params.id },
                data: {
                    downloadCount: 0,
                    expiresAt: thirtyDaysFromNow,
                },
            });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await prisma.product.update({
            where: { id: params.id },
            data: { active: false },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
