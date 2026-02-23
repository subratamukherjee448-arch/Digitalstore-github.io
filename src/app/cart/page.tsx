"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "@/components/AnimatedPage";
import { useState } from "react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, total, discount, couponCode, setCouponCode, setDiscount, itemCount } = useCart();
    const [couponInput, setCouponInput] = useState(couponCode);
    const [couponMsg, setCouponMsg] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        try {
            const res = await fetch(`/api/validate-coupon?code=${couponInput.trim().toUpperCase()}`);
            const data = await res.json();
            if (data.valid) {
                setCouponCode(couponInput.trim().toUpperCase());
                setDiscount(data.discountPercent);
                setCouponMsg(`🎉 ${data.discountPercent}% discount applied!`);
            } else {
                setCouponMsg(data.message || "Invalid coupon code");
                setDiscount(0);
            }
        } catch {
            setCouponMsg("Failed to validate coupon");
        } finally {
            setCouponLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <AnimatedPage>
                <div className="section-padding py-20 text-center">
                    <div className="text-7xl mb-6">🛒</div>
                    <h1 className="font-display text-3xl font-bold text-surface-900 mb-3">
                        Your cart is empty
                    </h1>
                    <p className="text-surface-500 mb-8">
                        Looks like you haven&apos;t added any products yet.
                    </p>
                    <Link href="/shop" className="btn-primary">
                        Browse Products
                    </Link>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="section-padding py-10">
                <h1 className="font-display text-3xl font-bold text-surface-900 mb-8">
                    Shopping Cart
                    <span className="text-lg font-normal text-surface-400 ml-3">
                        ({itemCount} item{itemCount !== 1 ? "s" : ""})
                    </span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="card p-4 flex gap-4"
                                >
                                    <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-surface-100 shrink-0">
                                        <Image
                                            src={item.coverUrl}
                                            alt={item.title}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-surface-900 truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-surface-400">{item.author}</p>
                                                <span className={`mt-1 inline-block ${item.format === "EBOOK" ? "badge-ebook" : "badge-audiobook"}`}>
                                                    {item.format === "EBOOK" ? "Ebook" : "Audiobook"}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-surface-900">
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-lg border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-50"
                                                    aria-label="Decrease quantity"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center font-medium text-surface-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-lg border border-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-50"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-sm text-red-500 hover:text-red-700 transition-colors"
                                                aria-label={`Remove ${item.title} from cart`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 lg:sticky lg:top-24">
                            <h2 className="font-display text-lg font-bold text-surface-900 mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-surface-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discount}%)</span>
                                        <span>−₹{Math.round(subtotal * (discount / 100))}</span>
                                    </div>
                                )}
                                <div className="border-t border-surface-200 pt-3 flex justify-between font-bold text-surface-900 text-base">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="mt-6">
                                <label htmlFor="coupon" className="text-sm font-medium text-surface-700 block mb-2">
                                    Coupon Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="coupon"
                                        type="text"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        placeholder="e.g. WELCOME10"
                                        className="input-field text-sm py-2 flex-1"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading}
                                        className="btn-secondary text-sm px-4 py-2"
                                    >
                                        {couponLoading ? "..." : "Apply"}
                                    </button>
                                </div>
                                {couponMsg && (
                                    <p className={`text-xs mt-2 ${discount > 0 ? "text-green-600" : "text-red-500"}`}>
                                        {couponMsg}
                                    </p>
                                )}
                            </div>

                            <Link
                                href="/checkout"
                                className="btn-primary w-full mt-6 text-center"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/shop"
                                className="block text-center text-sm text-surface-500 hover:text-surface-700 mt-3 transition-colors"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
