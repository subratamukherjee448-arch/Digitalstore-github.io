import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Orders" };

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, items: { include: { product: true } } },
    });

    return (
        <div className="section-padding py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl font-bold text-surface-900">Orders</h1>
                <Link href="/admin" className="btn-ghost text-sm">← Dashboard</Link>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-200 bg-surface-50">
                                <th className="text-left p-4 font-semibold text-surface-600">ID</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Customer</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Items</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Total</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Status</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Date</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-surface-100 hover:bg-surface-50">
                                    <td className="p-4 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{order.user.name}</div>
                                        <div className="text-xs text-surface-400">{order.user.email}</div>
                                    </td>
                                    <td className="p-4 text-surface-500 text-xs max-w-[200px] truncate">
                                        {order.items.map((i: any) => i.product.title).join(", ")}
                                    </td>
                                    <td className="p-4 font-semibold">₹{order.total}</td>
                                    <td className="p-4">
                                        <span className={`badge ${order.status === "PAID" ? "bg-green-100 text-green-700" :
                                            order.status === "REFUNDED" ? "bg-orange-100 text-orange-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-surface-400 text-xs" suppressHydrationWarning>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        {order.status === "PAID" && (
                                            <form action={`/api/admin/orders/${order.id}/refund`} method="POST">
                                                <button type="submit" className="text-orange-600 hover:text-orange-700 text-xs font-medium">
                                                    Refund
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={7} className="p-8 text-center text-surface-400">No orders yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
