"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedPage from "@/components/AnimatedPage";
import Link from "next/link";

interface ProductFormProps {
    product?: {
        id: string;
        title: string;
        author: string;
        description: string;
        price: number;
        format: string;
        category: string;
        coverUrl: string;
        filePath: string;
        sampleUrl: string;
        featured: boolean;
        active: boolean;
    };
}

export default function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const isEditing = !!product;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: product?.title || "",
        author: product?.author || "",
        description: product?.description || "",
        price: product?.price || 0,
        format: product?.format || "EBOOK",
        category: product?.category || "",
        coverUrl: product?.coverUrl || "/covers/placeholder.jpg",
        filePath: product?.filePath || "",
        sampleUrl: product?.sampleUrl || "",
        featured: product?.featured || false,
        active: product?.active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = isEditing ? `/api/admin/products/${product.id}` : "/api/admin/products";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save product");
            }

            router.push("/admin/products");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-10 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-display text-2xl font-bold text-surface-900">
                        {isEditing ? "Edit Product" : "New Product"}
                    </h1>
                    <Link href="/admin/products" className="btn-ghost text-sm">← Back</Link>
                </div>

                <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-surface-700 mb-1">Title *</label>
                            <input id="title" type="text" required value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="input-field" placeholder="Product title" />
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-surface-700 mb-1">Author *</label>
                            <input id="author" type="text" required value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                className="input-field" placeholder="Author name" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-surface-700 mb-1">Description *</label>
                        <textarea id="description" required rows={4} value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="input-field" placeholder="Product description" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-surface-700 mb-1">Price (₹) *</label>
                            <input id="price" type="number" required min={1} value={form.price}
                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                className="input-field" />
                        </div>
                        <div>
                            <label htmlFor="format" className="block text-sm font-medium text-surface-700 mb-1">Format *</label>
                            <select id="format" value={form.format}
                                onChange={(e) => setForm({ ...form, format: e.target.value })}
                                className="input-field">
                                <option value="EBOOK">Ebook</option>
                                <option value="AUDIOBOOK">Audiobook</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-surface-700 mb-1">Category *</label>
                            <input id="category" type="text" required value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="input-field" placeholder="e.g. Computer Science" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="coverUrl" className="block text-sm font-medium text-surface-700 mb-1">Cover Image URL</label>
                            <input id="coverUrl" type="text" value={form.coverUrl}
                                onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                                className="input-field" placeholder="/covers/my-book.jpg" />
                        </div>
                        <div>
                            <label htmlFor="filePath" className="block text-sm font-medium text-surface-700 mb-1">File Path *</label>
                            <input id="filePath" type="text" required value={form.filePath}
                                onChange={(e) => setForm({ ...form, filePath: e.target.value })}
                                className="input-field" placeholder="my-book.pdf" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="sampleUrl" className="block text-sm font-medium text-surface-700 mb-1">Sample URL (audio preview)</label>
                        <input id="sampleUrl" type="text" value={form.sampleUrl}
                            onChange={(e) => setForm({ ...form, sampleUrl: e.target.value })}
                            className="input-field" placeholder="/samples/preview.mp3" />
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.featured}
                                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
                            <span className="text-sm text-surface-700">Featured product</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.active}
                                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
                            <span className="text-sm text-surface-700">Active (visible in shop)</span>
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                        </button>
                        <Link href="/admin/products" className="btn-secondary">Cancel</Link>
                    </div>
                </form>
            </div>
        </AnimatedPage>
    );
}
