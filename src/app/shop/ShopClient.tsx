"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import AnimatedPage from "@/components/AnimatedPage";
import type { Product } from "@/types";

interface ShopClientProps {
    products: Product[];
    categories: string[];
    currentFormat: string;
    currentCategory: string;
    currentSort: string;
    currentQuery: string;
}

export default function ShopClient({
    products,
    categories,
    currentFormat,
    currentCategory,
    currentSort,
    currentQuery,
}: ShopClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState(currentQuery);

    function updateFilter(key: string, value: string) {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/shop?${params.toString()}`);
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        updateFilter("q", search);
    }

    return (
        <AnimatedPage>
            <div className="section-padding py-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 mb-2">
                        Shop
                    </h1>
                    <p className="text-surface-500">
                        {products.length} product{products.length !== 1 ? "s" : ""} available
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="card p-5 space-y-6 lg:sticky lg:top-24">
                            {/* Search */}
                            <form onSubmit={handleSearch}>
                                <label htmlFor="search" className="text-sm font-semibold text-surface-700 block mb-2">
                                    Search
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search titles..."
                                        className="input-field text-sm py-2"
                                    />
                                </div>
                            </form>

                            {/* Format Filter */}
                            <div>
                                <h3 className="text-sm font-semibold text-surface-700 mb-2">Format</h3>
                                <div className="space-y-1">
                                    {[
                                        { value: "", label: "All Formats" },
                                        { value: "EBOOK", label: "📖 Ebooks" },
                                        { value: "AUDIOBOOK", label: "🎧 Audiobooks" },
                                        { value: "WALLPAPER", label: "🖼️ Wallpapers" },
                                        { value: "CANVAS_TEMPLATE", label: "🎨 Canvas Templates" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateFilter("format", opt.value)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${currentFormat === opt.value
                                                    ? "bg-brand-50 text-brand-700 font-medium"
                                                    : "text-surface-600 hover:bg-surface-50"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h3 className="text-sm font-semibold text-surface-700 mb-2">Category</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => updateFilter("category", "")}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${!currentCategory
                                                ? "bg-brand-50 text-brand-700 font-medium"
                                                : "text-surface-600 hover:bg-surface-50"
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => updateFilter("category", cat)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${currentCategory === cat
                                                    ? "bg-brand-50 text-brand-700 font-medium"
                                                    : "text-surface-600 hover:bg-surface-50"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label htmlFor="sort" className="text-sm font-semibold text-surface-700 block mb-2">
                                    Sort By
                                </label>
                                <select
                                    id="sort"
                                    value={currentSort}
                                    onChange={(e) => updateFilter("sort", e.target.value)}
                                    className="input-field text-sm py-2"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="title">Title A–Z</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="font-display text-xl font-bold text-surface-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-surface-500 mb-6">
                                    Try adjusting your filters or search terms.
                                </p>
                                <button onClick={() => router.push("/shop")} className="btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product, i) => (
                                    <ProductCard key={product.id} product={product} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
