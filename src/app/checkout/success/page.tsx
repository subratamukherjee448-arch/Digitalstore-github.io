import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed" };

interface Props {
    searchParams: { orderId?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
    const orderId = searchParams.orderId;
    let order = null;

    if (orderId) {
        order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { product: true } },
                downloadTokens: true,
            },
        });
    }

    return (
        <div className="section-padding py-20 max-w-2xl mx-auto text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-3">
                Payment Successful!
            </h1>
            <p className="text-surface-500 mb-8">
                Thank you for your purchase. Your downloads are ready below.
            </p>

            {order && (
                <div className="card p-6 text-left mb-8">
                    <h2 className="font-semibold text-surface-900 mb-4">
                        Order #{order.id.slice(-8).toUpperCase()}
                    </h2>

                    <div className="space-y-3 mb-6">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-surface-600">{item.product.title}</span>
                                <span className="font-medium">₹{item.price}</span>
                            </div>
                        ))}
                        <div className="border-t border-surface-200 pt-2 flex justify-between font-bold">
                            <span>Total Paid</span>
                            <span>₹{order.total}</span>
                        </div>
                    </div>

                    {order.downloadTokens.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-surface-900 mb-3">📥 Download Links</h3>
                            <div className="space-y-2">
                                {order.downloadTokens.map((token: any) => {
                                    const product = order!.items.find(
                                        (i: any) => i.productId === token.productId
                                    )?.product;
                                    return (
                                        <a
                                            key={token.id}
                                            href={`/api/download?token=${token.token}`}
                                            className="flex items-center justify-between p-3 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors"
                                            download
                                        >
                                            <span className="text-sm font-medium text-brand-700">
                                                {product?.title || "Download"}
                                            </span>
                                            <span className="text-xs text-brand-500" suppressHydrationWarning>
                                                Expires: {new Date(token.expiresAt).toLocaleDateString()} •{" "}
                                                {token.maxDownloads - token.downloadCount} downloads left
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-surface-400 mt-3">
                                Links also sent to your email. Each link expires after{" "}
                                {process.env.DOWNLOAD_EXPIRY_HOURS || 24} hours or{" "}
                                {process.env.DOWNLOAD_MAX_COUNT || 3} downloads.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-4 justify-center">
                <Link href="/account" className="btn-secondary">
                    View Orders
                </Link>
                <Link href="/shop" className="btn-primary">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
