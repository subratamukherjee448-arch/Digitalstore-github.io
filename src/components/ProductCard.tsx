"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/product/${product.id}`} className="group block">
                <div className="card overflow-hidden">
                    {/* Cover Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 to-transparent z-10" />
                        <Image
                            src={product.coverUrl}
                            alt={`Cover of ${product.title} by ${product.author}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Format Badge */}
                        <span className={`absolute top-3 left-3 z-20 ${product.format === "EBOOK" ? "badge-ebook" : "badge-audiobook"
                            }`}>
                            {product.format === "EBOOK" ? "📖 Ebook" : "🎧 Audiobook"}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">
                            {product.category}
                        </p>
                        <h3 className="font-display font-semibold text-surface-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
                            {product.title}
                        </h3>
                        <p className="text-sm text-surface-500 mb-3">
                            by {product.author}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-surface-900">
                                ₹{product.price}
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
                                aria-label={`Add ${product.title} to cart`}
                            >
                                Add to Cart
                            </motion.button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
