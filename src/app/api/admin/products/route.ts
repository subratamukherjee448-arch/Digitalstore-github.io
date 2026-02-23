import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

// GET all products (admin)
export async function GET() {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
}

// POST new product
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const product = await prisma.product.create({
            data: {
                title: body.title,
                author: body.author,
                description: body.description,
                price: body.price,
                format: body.format,
                category: body.category,
                coverUrl: body.coverUrl || "/covers/placeholder.jpg",
                filePath: body.filePath,
                sampleUrl: body.sampleUrl || "",
                featured: body.featured || false,
                active: body.active ?? true,
            },
        });
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
