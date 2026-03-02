import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    console.log("📊 [ADMIN_DASHBOARD] User session:", session?.user?.email, "Role:", (session?.user as any)?.role);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        redirect("/login");
    }

    const [productCount, orderCount, paidOrders, userCount] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.findMany({ where: { status: "PAID" } }),
        prisma.user.count(),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true, items: { include: { product: true } } },
    });

    return (
        <div className="section-padding py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-surface-900">Admin Dashboard</h1>
                    <p className="text-surface-500">Manage your digital store</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    + Add Product
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "bg-green-50 text-green-700" },
                    { label: "Orders", value: orderCount, icon: "📦", color: "bg-blue-50 text-blue-700" },
                    { label: "Products", value: productCount, icon: "📚", color: "bg-purple-50 text-purple-700" },
                    { label: "Users", value: userCount, icon: "👥", color: "bg-orange-50 text-orange-700" },
                ].map((stat) => (
                    <div key={stat.label} className="card p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`badge ${stat.color}`}>{stat.label}</span>
                        </div>
                        <div className="font-display text-2xl font-bold text-surface-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <Link href="/admin/products" className="card p-5 hover:border-brand-300 transition-colors">
                    <h3 className="font-semibold text-surface-900 mb-1">📚 Manage Products</h3>
                    <p className="text-sm text-surface-500">Add, edit, or remove products</p>
                </Link>
                <Link href="/admin/orders" className="card p-5 hover:border-brand-300 transition-colors">
                    <h3 className="font-semibold text-surface-900 mb-1">📦 Manage Orders</h3>
                    <p className="text-sm text-surface-500">View orders and process refunds</p>
                </Link>
                <Link href="/admin/coupons" className="card p-5 hover:border-brand-300 transition-colors">
                    <h3 className="font-semibold text-surface-900 mb-1">🏷️ Manage Coupons</h3>
                    <p className="text-sm text-surface-500">Create and manage discount codes</p>
                </Link>
                <Link href="/admin/settings" className="card p-5 hover:border-brand-300 transition-colors">
                    <h3 className="font-semibold text-surface-900 mb-1">⚙️ Profile Settings</h3>
                    <p className="text-sm text-surface-500">Update admin details and mobile</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <h2 className="font-display text-xl font-bold text-surface-900 mb-4">Recent Orders</h2>
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-200 bg-surface-50">
                                <th className="text-left p-4 font-semibold text-surface-600">Order ID</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Customer</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Items</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Total</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Status</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-surface-100 hover:bg-surface-50">
                                    <td className="p-4 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                                    <td className="p-4">{order.user.name}</td>
                                    <td className="p-4 text-surface-500">
                                        {order.items.map((i: any) => i.product?.title || "Unknown Product (Deleted)").join(", ")}
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
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-surface-400">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
