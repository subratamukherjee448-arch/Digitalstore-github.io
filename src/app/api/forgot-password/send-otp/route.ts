import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
        }

        if (!user.phone) {
            return NextResponse.json(
                { error: "No mobile number registered with this account. Contact support." },
                { status: 400 }
            );
        }

        // Delete any existing OTPs for this user
        await prisma.otp.deleteMany({ where: { userId: user.id } });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-minute expiry
        await prisma.otp.create({
            data: {
                userId: user.id,
                code: otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            },
        });

        // Simulate sending SMS (in production, integrate Twilio / MSG91 / etc.)
        console.log(`\n📱 OTP for ${user.email} (${user.phone}): ${otp}\n`);

        // Mask phone number for response (show last 4 digits)
        const maskedPhone = user.phone.replace(/.(?=.{4})/g, "*");

        return NextResponse.json({
            success: true,
            maskedPhone,
            message: `OTP sent to ${maskedPhone}`,
            // Demo only: include OTP in response for testing (remove in production)
            _demoOtp: otp,
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
