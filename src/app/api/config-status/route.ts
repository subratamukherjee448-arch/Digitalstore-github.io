import { NextResponse } from "next/server";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function GET() {
    const configured = isRazorpayConfigured();
    return NextResponse.json({
        demoMode: !configured,
        razorpayConfigured: configured,
    });
}
