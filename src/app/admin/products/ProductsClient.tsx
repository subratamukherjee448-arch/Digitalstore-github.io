"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

interface Product {
    id: string;
    title: string;
    author: string;
    price: number;
    format: string;
    category: string;
    coverUrl: string;
    featured: boolean;
    active: boolean;
    createdAt: string;
}

interface ProductsClientProps {
    products: Product[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
    const [search, setSearch] = useState("");
    const [filterFormat, setFilterFormat] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filtered = products.filter((p) => {
        const matchesSearch =
            !search ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        const matchesFormat = !filterFormat || p.format === filterFormat;
        const matchesStatus =
            !filterStatus ||
            (filterStatus === "active" && p.active) ||
            (filterStatus === "inactive" && !p.active);
        return matchesSearch && matchesFormat && matchesStatus;
    });

    const activeCount = products.filter((p) => p.active).length;
    const inactiveCount = products.filter((p) => !p.active).length;
    const ebookCount = products.filter((p) => p.format === "EBOOK").length;
    const audiobookCount = products.filter((p) => p.format === "AUDIOBOOK").length;

    return (
        <div className="section-padding py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="w-10 h-10 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-surface-900">Products</h1>
                        <p className="text-sm text-surface-500">{products.length} total products</p>
                    </div>
                </div>
                <Link href="/admin/products/new" className="btn-primary text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="card p-4 hover:shadow-sm">
                    <div className="text-xs text-surface-500 mb-1">Total</div>
                    <div className="font-display text-xl font-bold text-surface-900">{products.length}</div>
                </div>
                <div className="card p-4 hover:shadow-sm">
                    <div className="text-xs text-green-600 mb-1">Active</div>
                    <div className="font-display text-xl font-bold text-green-700">{activeCount}</div>
                </div>
                <div className="card p-4 hover:shadow-sm">
                    <div className="text-xs text-brand-600 mb-1">Ebooks</div>
                    <div className="font-display text-xl font-bold text-brand-700">{ebookCount}</div>
                </div>
                <div className="card p-4 hover:shadow-sm">
                    <div className="text-xs text-accent-600 mb-1">Audiobooks</div>
                    <div className="font-display text-xl font-bold text-accent-700">{audiobookCount}</div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10 py-2.5"
                        />
                    </div>
                    <select
                        value={filterFormat}
                        onChange={(e) => setFilterFormat(e.target.value)}
                        className="input-field py-2.5 w-full sm:w-40"
                    >
                        <option value="">All Formats</option>
                        <option value="EBOOK">Ebook</option>
                        <option value="AUDIOBOOK">Audiobook</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-field py-2.5 w-full sm:w-40"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            {filtered.length > 0 ? (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200 bg-surface-50">
                                    <th className="text-left p-4 font-semibold text-surface-600">Product</th>
                                    <th className="text-left p-4 font-semibold text-surface-600">Format</th>
                                    <th className="text-left p-4 font-semibold text-surface-600">Category</th>
                                    <th className="text-left p-4 font-semibold text-surface-600">Price</th>
                                    <th className="text-left p-4 font-semibold text-surface-600">Status</th>
                                    <th className="text-left p-4 font-semibold text-surface-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((product) => (
                                    <tr key={product.id} className="border-b border-surface-100 hover:bg-surface-50/70 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 rounded-lg overflow-hidden bg-surface-100 border border-surface-200 flex-shrink-0">
                                                    <img
                                                        src={product.coverUrl}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = "none";
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-surface-900">{product.title}</div>
                                                    <div className="text-xs text-surface-400">by {product.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={product.format === "EBOOK" ? "badge-ebook" : "badge-audiobook"}>
                                                {product.format === "EBOOK" ? "📖 Ebook" : "🎧 Audio"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-surface-500">{product.category}</td>
                                        <td className="p-4 font-semibold text-surface-900">₹{product.price}</td>
                                        <td className="p-4">
                                            <span className={`badge ${product.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {product.active ? "Active" : "Inactive"}
                                            </span>
                                            {product.featured && (
                                                <span className="ml-1 text-xs" title="Featured">⭐</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <DeleteButton productId={product.id} productTitle={product.title} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📚</span>
                    </div>
                    {products.length === 0 ? (
                        <>
                            <h3 className="font-display text-lg font-bold text-surface-900 mb-2">No products yet</h3>
                            <p className="text-sm text-surface-500 mb-6">Get started by adding your first product</p>
                            <Link href="/admin/products/new" className="btn-primary text-sm">
                                + Add Your First Product
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="font-display text-lg font-bold text-surface-900 mb-2">No results found</h3>
                            <p className="text-sm text-surface-500">Try adjusting your search or filters</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
