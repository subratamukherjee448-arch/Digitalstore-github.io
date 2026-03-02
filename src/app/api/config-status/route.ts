import { NextRequest, NextResponse } from "next/server";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const configured = isRazorpayConfigured();
    let dbStatus = "Checking...";
    let userCount = 0;

    try {
        userCount = await prisma.user.count();
        dbStatus = "Connected";
    } catch (e: any) {
        dbStatus = `Error: ${e.message}`;
    }

    const session = await getServerSession(authOptions);

    return NextResponse.json({
        demoMode: !configured,
        razorpayConfigured: configured,
        database: {
            status: dbStatus,
            userCount,
        },
        session: {
            active: !!session,
            email: session?.user?.email || null,
        },
        env: {
            NODE_ENV: process.env.NODE_ENV,
        }
    });
}
