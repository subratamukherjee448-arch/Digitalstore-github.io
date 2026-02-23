import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get("code");

        if (!code) {
            return NextResponse.json({ valid: false, message: "Coupon code is required" });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!coupon) {
            return NextResponse.json({ valid: false, message: "Invalid coupon code" });
        }

        if (!coupon.active) {
            return NextResponse.json({ valid: false, message: "This coupon is no longer active" });
        }

        if (coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json({ valid: false, message: "This coupon has reached its usage limit" });
        }

        return NextResponse.json({
            valid: true,
            discountPercent: coupon.discountPercent,
            message: `${coupon.discountPercent}% discount will be applied`,
        });
    } catch (error) {
        console.error("Coupon validation error:", error);
        return NextResponse.json({ valid: false, message: "Failed to validate coupon" });
    }
}
