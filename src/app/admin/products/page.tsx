import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Products" };

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div className="section-padding py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl font-bold text-surface-900">Products</h1>
                <div className="flex gap-3">
                    <Link href="/admin" className="btn-ghost text-sm">← Dashboard</Link>
                    <Link href="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-200 bg-surface-50">
                                <th className="text-left p-4 font-semibold text-surface-600">Product</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Format</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Category</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Price</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Featured</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Status</th>
                                <th className="text-left p-4 font-semibold text-surface-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-surface-100 hover:bg-surface-50">
                                    <td className="p-4">
                                        <div className="font-medium text-surface-900">{product.title}</div>
                                        <div className="text-xs text-surface-400">by {product.author}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={product.format === "EBOOK" ? "badge-ebook" : "badge-audiobook"}>
                                            {product.format}
                                        </span>
                                    </td>
                                    <td className="p-4 text-surface-500">{product.category}</td>
                                    <td className="p-4 font-semibold">₹{product.price}</td>
                                    <td className="p-4">{product.featured ? "⭐" : "—"}</td>
                                    <td className="p-4">
                                        <span className={`badge ${product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {product.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Link href={`/admin/products/${product.id}/edit`}
                                            className="text-brand-600 hover:text-brand-700 font-medium text-sm">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
