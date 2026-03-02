import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendOrderConfirmation } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;
        console.log("🛡️ [VERIFY_PAYMENT] Verifying order:", orderId, "Razorpay Order:", razorpay_order_id);

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            console.error("❌ [VERIFY_PAYMENT] Invalid Razorpay signature for order:", orderId);
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }
        console.log("🛡️ [VERIFY_PAYMENT] Signature valid.");

        // Fetch order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: true } },
                user: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status === "PAID") {
            return NextResponse.json({ message: "Order already verified" });
        }

        // Calculate expiry
        const expiryHours = parseInt(process.env.DOWNLOAD_EXPIRY_HOURS || "24");
        const maxDownloads = parseInt(process.env.DOWNLOAD_MAX_COUNT || "3");
        const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

        // Create download tokens for each product
        const downloadTokens = await Promise.all(
            order.items.map(async (item) => {
                const token = uuidv4();
                return prisma.downloadToken.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        token,
                        expiresAt,
                        maxDownloads,
                    },
                });
            })
        );

        // Update order status
        console.log("🛡️ [VERIFY_PAYMENT] Updating order status to PAID...");
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                razorpayPaymentId: razorpay_payment_id,
            },
        });
        console.log("✅ [VERIFY_PAYMENT] Order status updated.");

        // Update coupon usage
        if (order.couponCode) {
            await prisma.coupon.update({
                where: { code: order.couponCode },
                data: { usageCount: { increment: 1 } },
            });
        }

        // Send email
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        try {
            await sendOrderConfirmation({
                to: order.user.email,
                customerName: order.user.name,
                orderId: order.id,
                items: order.items.map((i) => ({
                    title: i.product.title,
                    price: i.price,
                })),
                total: order.total,
                downloadLinks: downloadTokens.map((dt) => ({
                    title: order.items.find((i) => i.productId === dt.productId)?.product.title || "Download",
                    url: `${baseUrl}/api/download?token=${dt.token}`,
                    expiresAt: dt.expiresAt.toLocaleDateString(),
                })),
            });
        } catch (emailErr) {
            console.error("Email send failed:", emailErr);
            // Don't fail the payment verification if email fails
        }

        console.log(`✅ Payment verified for order ${orderId}`);

        return NextResponse.json({
            success: true,
            downloadTokens: downloadTokens.map((dt) => ({
                token: dt.token,
                productId: dt.productId,
                expiresAt: dt.expiresAt.toISOString(),
            })),
        });
    } catch (error: any) {
        console.error("Verify payment error:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
