import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const mask = (str: string | undefined) => {
        if (!str) return "MISSING";
        if (str.length < 8) return "***";
        return `${str.slice(0, 4)}...${str.slice(-4)}`;
    };

    return NextResponse.json({
        RAZORPAY_KEY_ID: mask(process.env.RAZORPAY_KEY_ID),
        RAZORPAY_KEY_SECRET: mask(process.env.RAZORPAY_KEY_SECRET),
        DATABASE_URL: mask(process.env.DATABASE_URL),
        NEXTAUTH_URL: mask(process.env.NEXTAUTH_URL),
        NODE_ENV: process.env.NODE_ENV,
    });
}
