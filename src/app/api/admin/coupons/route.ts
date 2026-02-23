import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

export async function POST(req: NextRequest) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { code, discountPercent, usageLimit } = await req.json();
    const coupon = await prisma.coupon.create({
        data: { code, discountPercent, usageLimit: usageLimit || 100 },
    });
    return NextResponse.json(coupon);
}
