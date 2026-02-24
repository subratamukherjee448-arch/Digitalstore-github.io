import Razorpay from "razorpay";

/**
 * Check if Razorpay is configured with real (non-placeholder) keys.
 */
export function isRazorpayConfigured(): boolean {
    const key = process.env.RAZORPAY_KEY_ID || "";
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    return (
        key.startsWith("rzp_") &&
        !key.includes("YOUR") &&
        !key.includes("placeholder") &&
        secret.length > 5 &&
        !secret.includes("YOUR")
    );
}

export function getRazorpayInstance() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
}

export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const crypto = require("crypto");
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");
    return expectedSignature === signature;
}
