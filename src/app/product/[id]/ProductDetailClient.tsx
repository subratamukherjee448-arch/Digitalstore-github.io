"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import AnimatedPage from "@/components/AnimatedPage";
import type { Product } from "@/types";

interface Props {
    product: Product;
    related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            title: product.title,
            author: product.author,
            price: product.price,
            format: product.format,
            coverUrl: product.coverUrl,
        });
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-surface-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-surface-600 transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-surface-600">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Cover Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-100 shadow-2xl"
                    >
                        <Image
                            src={product.coverUrl}
                            alt={`Cover of ${product.title}`}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Format Badge */}
                        <span className={product.format === "EBOOK" ? "badge-ebook" : "badge-audiobook"}>
                            {product.format === "EBOOK" ? "📖 Ebook" : "🎧 Audiobook"}
                        </span>

                        <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 mt-4 mb-2">
                            {product.title}
                        </h1>

                        <p className="text-lg text-surface-500 mb-6">
                            by <span className="text-surface-700 font-medium">{product.author}</span>
                        </p>

                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl font-bold text-surface-900">₹{product.price}</span>
                            <span className="text-sm text-surface-400">One-time purchase</span>
                        </div>

                        {/* Description */}
                        <div className="prose prose-surface mb-8">
                            <p className="text-surface-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Audio Sample */}
                        {product.sampleUrl && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-surface-700 mb-3">🎵 Audio Preview</h3>
                                <audio controls className="w-full" preload="none">
                                    <source src={product.sampleUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                className="btn-primary text-base px-8 py-4"
                            >
                                Add to Cart
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </motion.button>

                            <Link href="/cart" onClick={handleAddToCart} className="btn-secondary text-base px-8 py-4 text-center">
                                Buy Now
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="card p-5 space-y-3">
                            {[
                                { icon: "⚡", text: "Instant download after payment" },
                                { icon: "🔒", text: "Secure, encrypted delivery" },
                                { icon: "📱", text: "Read on any device" },
                                { icon: "🔄", text: "Lifetime access to your purchases" },
                            ].map((f) => (
                                <div key={f.text} className="flex items-center gap-3 text-sm text-surface-600">
                                    <span>{f.icon}</span>
                                    {f.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="mt-20">
                        <h2 className="font-display text-2xl font-bold text-surface-900 mb-6">
                            You might also like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AnimatedPage>
    );
}
