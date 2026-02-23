import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.order.update({
            where: { id: params.id },
            data: { status: "REFUNDED" },
        });
        return NextResponse.redirect(new URL("/admin/orders", req.url));
    } catch (error) {
        return NextResponse.json({ error: "Refund failed" }, { status: 500 });
    }
}
