"use client";

import { useState, useRef, useEffect } from "react";
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

const SUGGESTED_CATEGORIES = [
    "Computer Science",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Digital Marketing",
    "Business & Finance",
    "Design & UX",
    "Self Help",
    "Fiction",
    "Non-Fiction",
    "Science",
    "Mathematics",
    "Engineering",
    "Productivity",
];

export default function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const isEditing = !!product;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
    const [coverError, setCoverError] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

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

    // Close category dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setShowCategorySuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCategories = SUGGESTED_CATEGORIES.filter((c) =>
        c.toLowerCase().includes(form.category.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

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

            setSuccess(isEditing ? "Product updated successfully!" : "Product created successfully!");
            setTimeout(() => {
                router.push("/admin/products");
                router.refresh();
            }, 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products" className="w-10 h-10 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-surface-900">
                                {isEditing ? "Edit Product" : "Add New Product"}
                            </h1>
                            <p className="text-sm text-surface-500">
                                {isEditing ? "Update product details below" : "Fill in the details to add a new product to your store"}
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/products" className="btn-ghost text-sm">← All Products</Link>
                </div>

                {/* Success / Error */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
                        <span className="text-green-600 text-xl">✓</span>
                        <p className="text-sm text-green-700 font-medium">{success}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-red-500 text-xl">✕</span>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column: Form */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section: Basic Info */}
                            <div className="card p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
                                        <span className="text-lg">📝</span>
                                    </div>
                                    <h2 className="font-display text-lg font-bold text-surface-900">Basic Information</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-surface-700 mb-1.5">
                                                Title <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                id="title"
                                                type="text"
                                                required
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                className="input-field"
                                                placeholder="e.g. Data Structures & Algorithms"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="author" className="block text-sm font-medium text-surface-700 mb-1.5">
                                                Author <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                id="author"
                                                type="text"
                                                required
                                                value={form.author}
                                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                                className="input-field"
                                                placeholder="Author name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="description" className="block text-sm font-medium text-surface-700">
                                                Description <span className="text-red-400">*</span>
                                            </label>
                                            <span className={`text-xs ${form.description.length > 500 ? "text-orange-500" : "text-surface-400"}`}>
                                                {form.description.length} / 500
                                            </span>
                                        </div>
                                        <textarea
                                            id="description"
                                            required
                                            rows={4}
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="input-field resize-none"
                                            placeholder="Describe the product — what readers will learn, key topics covered..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Pricing & Format */}
                            <div className="card p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                                        <span className="text-lg">💰</span>
                                    </div>
                                    <h2 className="font-display text-lg font-bold text-surface-900">Pricing & Format</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-surface-700 mb-1.5">
                                            Price (₹) <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-medium">₹</span>
                                            <input
                                                id="price"
                                                type="number"
                                                required
                                                min={1}
                                                value={form.price}
                                                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                                className="input-field pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="format" className="block text-sm font-medium text-surface-700 mb-1.5">
                                            Format <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, format: "EBOOK" })}
                                                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${form.format === "EBOOK"
                                                    ? "bg-brand-50 border-brand-300 text-brand-700 ring-2 ring-brand-200"
                                                    : "bg-white border-surface-300 text-surface-500 hover:border-surface-400"
                                                    }`}
                                            >
                                                📖 Ebook
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, format: "AUDIOBOOK" })}
                                                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${form.format === "AUDIOBOOK"
                                                    ? "bg-accent-50 border-accent-300 text-accent-700 ring-2 ring-accent-200"
                                                    : "bg-white border-surface-300 text-surface-500 hover:border-surface-400"
                                                    }`}
                                            >
                                                🎧 Audiobook
                                            </button>
                                        </div>
                                    </div>
                                    <div ref={categoryRef} className="relative">
                                        <label htmlFor="category" className="block text-sm font-medium text-surface-700 mb-1.5">
                                            Category <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="category"
                                            type="text"
                                            required
                                            value={form.category}
                                            onChange={(e) => {
                                                setForm({ ...form, category: e.target.value });
                                                setShowCategorySuggestions(true);
                                            }}
                                            onFocus={() => setShowCategorySuggestions(true)}
                                            className="input-field"
                                            placeholder="e.g. Computer Science"
                                            autoComplete="off"
                                        />
                                        {showCategorySuggestions && filteredCategories.length > 0 && (
                                            <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                                {filteredCategories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        type="button"
                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 hover:text-brand-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                                        onClick={() => {
                                                            setForm({ ...form, category: cat });
                                                            setShowCategorySuggestions(false);
                                                        }}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Media & Files */}
                            <div className="card p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <span className="text-lg">📁</span>
                                    </div>
                                    <h2 className="font-display text-lg font-bold text-surface-900">Media & Files</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="coverUrl" className="block text-sm font-medium text-surface-700 mb-1.5">Cover Image URL</label>
                                            <input
                                                id="coverUrl"
                                                type="text"
                                                value={form.coverUrl}
                                                onChange={(e) => {
                                                    setForm({ ...form, coverUrl: e.target.value });
                                                    setCoverError(false);
                                                }}
                                                className="input-field"
                                                placeholder="/covers/my-book.jpg"
                                            />
                                            <p className="text-xs text-surface-400 mt-1">Place images in <code className="px-1 py-0.5 bg-surface-100 rounded text-xs">/public/covers/</code></p>
                                        </div>
                                        <div>
                                            <label htmlFor="filePath" className="block text-sm font-medium text-surface-700 mb-1.5">
                                                Download File Path <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                id="filePath"
                                                type="text"
                                                required
                                                value={form.filePath}
                                                onChange={(e) => setForm({ ...form, filePath: e.target.value })}
                                                className="input-field"
                                                placeholder="my-ebook.pdf"
                                            />
                                            <p className="text-xs text-surface-400 mt-1">Place files in <code className="px-1 py-0.5 bg-surface-100 rounded text-xs">/storage/</code></p>
                                        </div>
                                    </div>

                                    {form.format === "AUDIOBOOK" && (
                                        <div>
                                            <label htmlFor="sampleUrl" className="block text-sm font-medium text-surface-700 mb-1.5">Audio Sample URL</label>
                                            <input
                                                id="sampleUrl"
                                                type="text"
                                                value={form.sampleUrl}
                                                onChange={(e) => setForm({ ...form, sampleUrl: e.target.value })}
                                                className="input-field"
                                                placeholder="/samples/preview.mp3"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Settings */}
                            <div className="card p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <span className="text-lg">⚙️</span>
                                    </div>
                                    <h2 className="font-display text-lg font-bold text-surface-900">Settings</h2>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-brand-200 hover:bg-brand-50/50 transition-all cursor-pointer flex-1">
                                        <input
                                            type="checkbox"
                                            checked={form.featured}
                                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                            className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-surface-900 block">⭐ Featured Product</span>
                                            <span className="text-xs text-surface-500">Show on homepage featured section</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-green-200 hover:bg-green-50/50 transition-all cursor-pointer flex-1">
                                        <input
                                            type="checkbox"
                                            checked={form.active}
                                            onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                            className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-surface-900 block">🟢 Active</span>
                                            <span className="text-xs text-surface-500">Visible in the shop</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center gap-4">
                                <button type="submit" disabled={loading} className="btn-primary px-8 py-3.5">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : isEditing ? "Update Product" : "Create Product"}
                                </button>
                                <Link href="/admin/products" className="btn-secondary">Cancel</Link>
                            </div>
                        </div>

                        {/* Right column: Live Preview */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Cover Preview */}
                                <div className="card p-5">
                                    <h3 className="text-sm font-semibold text-surface-600 mb-3 flex items-center gap-2">
                                        <span>🖼️</span> Cover Preview
                                    </h3>
                                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-100 border border-surface-200 relative">
                                        {form.coverUrl && !coverError ? (
                                            <img
                                                src={form.coverUrl}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                                onError={() => setCoverError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-surface-400">
                                                <svg className="w-12 h-12 mb-2 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">No cover image</span>
                                                <span className="text-xs mt-1">Enter a URL above</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Live Product Card Preview */}
                                <div className="card p-5">
                                    <h3 className="text-sm font-semibold text-surface-600 mb-3 flex items-center gap-2">
                                        <span>👁️</span> Shop Preview
                                    </h3>
                                    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                                        <div className="aspect-[3/4] bg-surface-100 relative overflow-hidden">
                                            {form.coverUrl && !coverError ? (
                                                <img
                                                    src={form.coverUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setCoverError(true)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-surface-300">
                                                    <span className="text-4xl">{form.format === "AUDIOBOOK" ? "🎧" : "📖"}</span>
                                                </div>
                                            )}
                                            {form.featured && (
                                                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                                    ⭐ Featured
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <span className={form.format === "EBOOK" ? "badge-ebook" : "badge-audiobook"}>
                                                    {form.format === "EBOOK" ? "📖 Ebook" : "🎧 Audio"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-display font-bold text-surface-900 text-sm leading-tight mb-1 truncate">
                                                {form.title || "Product Title"}
                                            </h4>
                                            <p className="text-xs text-surface-500 mb-2">
                                                by {form.author || "Author Name"}
                                            </p>
                                            <p className="text-xs text-surface-400 mb-3 line-clamp-2">
                                                {form.description || "Product description will appear here..."}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-display text-lg font-bold text-brand-600">
                                                    ₹{form.price || 0}
                                                </span>
                                                {form.category && (
                                                    <span className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full">
                                                        {form.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-surface-400 mt-3">
                                        This is how the product will appear in the shop
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AnimatedPage>
    );
}
