import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login?callbackUrl=/account");

    const userId = (session.user as any).id;

    // Fetch complete user details and orders
    const [user, orders] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: true } },
                downloadTokens: true,
            },
            orderBy: { createdAt: "desc" },
        })
    ]);

    if (!user) redirect("/login");

    return (
        <div className="section-padding py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-surface-900">My Account</h1>
                    <p className="text-surface-500">Manage your profile and orders</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Profile Settings Section */}
                <div>
                    <ProfileForm user={user} />
                </div>
                <h2 className="font-display text-xl font-bold text-surface-900">
                    Order History
                </h2>

                {orders.length === 0 ? (
                    <div className="card p-8 text-center">
                        <div className="text-5xl mb-4">📦</div>
                        <p className="text-surface-500 mb-4">No orders yet.</p>
                        <Link href="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="card p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="font-semibold text-surface-900">
                                            Order #{order.id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-xs text-surface-400">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric", month: "long", day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${order.status === "PAID" ? "bg-green-100 text-green-700" :
                                            order.status === "REFUNDED" ? "bg-orange-100 text-orange-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold text-surface-900">₹{order.total}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-surface-600">{item.product.title}</span>
                                            <span className="font-medium">₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Download Links */}
                                {order.status === "PAID" && order.downloadTokens.length > 0 && (
                                    <div className="border-t border-surface-200 pt-4">
                                        <h4 className="text-sm font-semibold text-surface-700 mb-2">📥 Downloads</h4>
                                        <div className="space-y-2">
                                            {order.downloadTokens.map((token: any) => {
                                                const isExpired = new Date() > new Date(token.expiresAt);
                                                const isMaxed = token.downloadCount >= token.maxDownloads;
                                                const product = order.items.find(
                                                    (i: any) => i.productId === token.productId
                                                )?.product;
                                                return (
                                                    <div key={token.id} className="flex items-center justify-between">
                                                        {isExpired || isMaxed ? (
                                                            <span className="text-sm text-surface-400 line-through">
                                                                {(product as any)?.title || "Download"}
                                                            </span>
                                                        ) : (
                                                            <a
                                                                href={`/api/download?token=${token.token}`}
                                                                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                                                                download
                                                            >
                                                                {(product as any)?.title || "Download"}
                                                            </a>
                                                        )}
                                                        <span className="text-xs text-surface-400">
                                                            {isExpired ? "Expired" : isMaxed ? "Limit reached" :
                                                                `${token.maxDownloads - token.downloadCount} left • Expires ${new Date(token.expiresAt).toLocaleDateString()}`}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
