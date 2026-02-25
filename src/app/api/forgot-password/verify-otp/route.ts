import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "No account found" }, { status: 404 });
        }

        // Find the latest non-verified OTP for this user
        const storedOtp = await prisma.otp.findFirst({
            where: {
                userId: user.id,
                verified: false,
            },
            orderBy: { createdAt: "desc" },
        });

        if (!storedOtp) {
            return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });
        }

        // Check if OTP has expired
        if (new Date() > storedOtp.expiresAt) {
            await prisma.otp.delete({ where: { id: storedOtp.id } });
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // Check if OTP matches
        if (storedOtp.code !== otp) {
            return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
        }

        // Mark OTP as verified
        await prisma.otp.update({
            where: { id: storedOtp.id },
            data: { verified: true },
        });

        return NextResponse.json({
            success: true,
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
