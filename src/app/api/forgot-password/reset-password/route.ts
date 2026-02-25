import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, newPassword } = await req.json();

        if (!email || !newPassword) {
            return NextResponse.json({ error: "Email and new password are required" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "No account found" }, { status: 404 });
        }

        // Check that there's a verified OTP for this user
        const verifiedOtp = await prisma.otp.findFirst({
            where: {
                userId: user.id,
                verified: true,
            },
            orderBy: { createdAt: "desc" },
        });

        if (!verifiedOtp) {
            return NextResponse.json(
                { error: "OTP not verified. Please complete OTP verification first." },
                { status: 400 }
            );
        }

        // Hash the new password and update user
        const hashedPassword = await hash(newPassword, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // Cleanup: delete all OTPs for this user
        await prisma.otp.deleteMany({ where: { userId: user.id } });

        return NextResponse.json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}
