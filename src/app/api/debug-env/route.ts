import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const mask = (str: string | undefined) => {
        if (!str) return "MISSING";
        if (str.length < 8) return "***";
        return `${str.slice(0, 4)}...${str.slice(-4)}`;
    };

    const session = await getServerSession(authOptions);

    let users: any[] = [];
    let products: any[] = [];
    let orders: any[] = [];
    let stats = { userCount: 0, productCount: 0, orderCount: 0 };

    try {
        stats.userCount = await prisma.user.count();
        stats.productCount = await prisma.product.count();
        stats.orderCount = await prisma.order.count();

        users = await prisma.user.findMany({ select: { id: true, email: true, role: true }, take: 5, orderBy: { createdAt: 'desc' } });
        products = await prisma.product.findMany({ select: { id: true, title: true }, take: 5 });
        orders = await prisma.order.findMany({
            select: { id: true, status: true, total: true, createdAt: true, userId: true },
            take: 10,
            orderBy: { createdAt: 'desc' }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }

    return NextResponse.json({
        sessionUserId: (session?.user as any)?.id || "NONE",
        sessionEmail: session?.user?.email || "NONE",
        sessionRole: (session?.user as any)?.role || "NONE",
        stats,
        dbUsers: users.map(u => ({ id: u.id, email: mask(u.email), role: u.role })),
        dbProducts: products.map(p => ({ id: p.id, title: p.title })),
        dbOrders: orders,
        NODE_ENV: process.env.NODE_ENV,
    });
}

export const dynamic = 'force-dynamic';
