import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isRazorpayConfigured, getRazorpayInstance } from "@/lib/razorpay";
import { v4 as uuidv4 } from "uuid";


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        console.log("🛒 [CREATE_ORDER] Request from user:", session?.user?.email, "ID:", (session?.user as any)?.id);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        // Verify user exists in current DB (SQLite on Vercel is ephemeral)
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            console.error("❌ [CREATE_ORDER] User not found in DB:", userId);
            return NextResponse.json({
                error: "Session Mismatch",
                details: "Your account was not found in the current database. Please log out and sign up again or sign in with a fresh account."
            }, { status: 401 });
        }

        const body = await req.json();
        const { items, couponCode } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Fetch products and calculate total
        const productIds = items.map((i: any) => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds }, active: true },
        });
        console.log("🛒 [CREATE_ORDER] Found products:", products.length, "/", productIds.length);

        if (products.length !== productIds.length) {
            return NextResponse.json({ error: "Some products are unavailable" }, { status: 400 });
        }

        let subtotal = 0;
        const orderItems = items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId)!;
            const itemTotal = product.price * (item.quantity || 1);
            subtotal += itemTotal;
            return { productId: product.id, price: itemTotal };
        });

        // Apply coupon
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            if (coupon && coupon.active && coupon.usageCount < coupon.usageLimit) {
                discountAmount = Math.round(subtotal * (coupon.discountPercent / 100));
            }
        }

        const total = Math.max(subtotal - discountAmount, 1);
        const demoMode = !isRazorpayConfigured();

        if (demoMode) {
            // DEMO MODE: skip Razorpay, create order directly as PAID
            const demoRazorpayId = `demo_order_${Date.now()}`;

            const order = await prisma.order.create({
                data: {
                    userId,
                    total,
                    status: "PAID",
                    razorpayOrderId: demoRazorpayId,
                    razorpayPaymentId: `demo_pay_${Date.now()}`,
                    couponCode: couponCode || null,
                    discountAmount,
                    items: { create: orderItems },
                },
                include: { items: true },
            });

            // Create download tokens
            const expiryHours = parseInt(process.env.DOWNLOAD_EXPIRY_HOURS || "24");
            const maxDownloads = parseInt(process.env.DOWNLOAD_MAX_COUNT || "3");
            const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

            for (const item of order.items) {
                await prisma.downloadToken.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        token: uuidv4(),
                        expiresAt,
                        maxDownloads,
                    },
                });
            }

            // Update coupon usage
            if (couponCode) {
                await prisma.coupon.update({
                    where: { code: couponCode },
                    data: { usageCount: { increment: 1 } },
                }).catch(() => { });
            }

            console.log(`✅ [DEMO] Order ${order.id} created and marked PAID`);

            return NextResponse.json({
                orderId: order.id,
                demoMode: true,
                amount: total * 100,
                currency: "INR",
            });
        }

        console.log("🛒 [CREATE_ORDER] Live Mode - Creating Razorpay order...");
        try {
            const razorpay = getRazorpayInstance();
            const amount = Math.round(total * 100);
            console.log("🛒 [CREATE_ORDER] Total:", total, "Amount (paise):", amount);

            const razorpayOrder = await razorpay.orders.create({
                amount,
                currency: "INR",
                receipt: `order_${Date.now()}`,
            });
            console.log("🛒 [CREATE_ORDER] Razorpay order created:", razorpayOrder.id);

            console.log("🛒 [CREATE_ORDER] Saving PENDING order to DB...");
            const order = await prisma.order.create({
                data: {
                    userId,
                    total,
                    status: "PENDING",
                    razorpayOrderId: razorpayOrder.id,
                    couponCode: couponCode || null,
                    discountAmount,
                    items: { create: orderItems },
                },
                include: { items: true },
            });
            console.log("✅ [CREATE_ORDER] Order saved successfully:", order.id);

            return NextResponse.json({
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                razorpayKeyId: process.env.RAZORPAY_KEY_ID,
                amount,
                currency: "INR",
                demoMode: false,
            });
        } catch (rzpErr: any) {
            console.error("❌ [CREATE_ORDER] Razorpay/DB Error:", rzpErr);
            throw rzpErr;
        }
    } catch (error: any) {
        console.error("❌ [CREATE_ORDER] Top-level error:", error);
        return NextResponse.json(
            {
                error: "Failed to create order",
                details: error.message,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
