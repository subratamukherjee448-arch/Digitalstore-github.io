"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import AnimatedPage from "@/components/AnimatedPage";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, total, subtotal, discount, couponCode, clearCart } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rawError, setRawError] = useState<any>(null);
    const [demoMode, setDemoMode] = useState<boolean | null>(null);

    // Detect whether Razorpay is configured (live) or not (demo)
    useEffect(() => {
        fetch("/api/config-status")
            .then((res) => res.json())
            .then((data) => {
                setDemoMode(data.demoMode);
                if (data.database.status !== "Connected") {
                    setError(`Database Search Error: ${data.database.status}`);
                }
                if (!data.session.active) {
                    setError("Session Error: You appear to be logged out. Please log in again.");
                }
            })
            .catch(() => setDemoMode(true)); // fallback to demo
    }, []);

    if (items.length === 0) {
        return (
            <AnimatedPage>
                <div className="section-padding py-20 text-center">
                    <h1 className="font-display text-2xl font-bold text-surface-900 mb-4">
                        No items to checkout
                    </h1>
                    <Link href="/shop" className="btn-primary">Go to Shop</Link>
                </div>
            </AnimatedPage>
        );
    }

    if (status === "loading") {
        return (
            <AnimatedPage>
                <div className="section-padding py-20 text-center">
                    <div className="animate-spin h-10 w-10 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
                    <p className="text-surface-500 mt-4">Loading...</p>
                </div>
            </AnimatedPage>
        );
    }

    if (!session) {
        return (
            <AnimatedPage>
                <div className="section-padding py-20 text-center">
                    <div className="text-6xl mb-6">🔐</div>
                    <h1 className="font-display text-2xl font-bold text-surface-900 mb-3">
                        Please sign in to continue
                    </h1>
                    <p className="text-surface-500 mb-6">
                        You need an account to complete your purchase.
                    </p>
                    <Link href="/login?callbackUrl=/checkout" className="btn-primary">Sign In</Link>
                </div>
            </AnimatedPage>
        );
    }

    const handleCheckout = async () => {
        console.log("🚀 [CHECKOUT] Starting handleCheckout...");
        setLoading(true);
        setError("");

        try {
            console.log("🚀 [CHECKOUT] Creating order on server...", items.length, "items");
            // 1. Create order on server
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
                    couponCode: couponCode || undefined,
                }),
            });

            console.log("🚀 [CHECKOUT] Create order response status:", res.status);
            if (!res.ok) {
                let errorData;
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await res.json();
                } else {
                    const text = await res.text();
                    errorData = {
                        error: "Server Error",
                        details: text.slice(0, 1000), // Show first 1000 chars of HTML if it's a crash page
                        isHtml: contentType?.includes("html")
                    };
                }

                console.error("❌ [CHECKOUT] Create order failed:", errorData);
                setRawError(errorData);
                throw new Error(errorData.details || errorData.error || "Failed to create order");
            }

            const orderData = await res.json();
            console.log("🚀 [CHECKOUT] Order data received:", orderData.orderId, "DemoMode:", orderData.demoMode);

            // DEMO MODE: order is already paid, go to success
            if (orderData.demoMode) {
                console.log("🚀 [CHECKOUT] Demo mode detected, clearing cart and redirecting...");
                clearCart();
                router.push(`/checkout/success?orderId=${orderData.orderId}`);
                return;
            }

            // LIVE MODE: Open Razorpay checkout
            console.log("🚀 [CHECKOUT] Live mode - loading Razorpay...");
            const loadRazorpay = (): Promise<boolean> => {
                return new Promise((resolve) => {
                    if (window.Razorpay) { resolve(true); return; }
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const loaded = await loadRazorpay();
            if (!loaded) {
                console.error("❌ [CHECKOUT] Razorpay failed to load");
                setError("Failed to load payment gateway.");
                setLoading(false);
                return;
            }

            console.log("🚀 [CHECKOUT] Opening Razorpay modal...");
            const options = {
                key: orderData.razorpayKeyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "College Digital Store",
                description: `Order #${orderData.orderId.slice(-8).toUpperCase()}`,
                order_id: orderData.razorpayOrderId,
                prefill: {
                    name: session.user?.name || "",
                    email: session.user?.email || "",
                },
                theme: { color: "#4f46e5" },
                handler: async function (response: any) {
                    console.log("🚀 [CHECKOUT] Razorpay payment successful, verifying...", response.razorpay_payment_id);
                    try {
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderData.orderId,
                            }),
                        });
                        console.log("🚀 [CHECKOUT] Verify payment status:", verifyRes.status);
                        if (verifyRes.ok) {
                            console.log("✅ [CHECKOUT] Payment verified, redirecting to success");
                            clearCart();
                            router.push(`/checkout/success?orderId=${orderData.orderId}`);
                        } else {
                            console.error("❌ [CHECKOUT] Payment verification failed at API");
                            router.push(`/checkout/failure?orderId=${orderData.orderId}`);
                        }
                    } catch (err) {
                        console.error("❌ [CHECKOUT] Exception during verification:", err);
                        router.push(`/checkout/failure?orderId=${orderData.orderId}`);
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log("🚀 [CHECKOUT] Razorpay modal dismissed");
                        setLoading(false);
                    }
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", (resp: any) => {
                console.error("❌ [CHECKOUT] Razorpay payment failed event:", resp.error.description);
                router.push(`/checkout/failure?reason=${resp.error.description}`);
            });
            razorpay.open();
        } catch (err: any) {
            console.error("❌ [CHECKOUT] handleCheckout caught error:", err);
            setError(err.message || "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-10 max-w-2xl mx-auto">
                <h1 className="font-display text-3xl font-bold text-surface-900 mb-8">
                    Checkout
                </h1>

                <div className="card p-6 mb-6">
                    <h2 className="font-semibold text-surface-900 mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-surface-600">
                                    {item.title} × {item.quantity}
                                </span>
                                <span className="font-medium text-surface-900">
                                    ₹{item.price * item.quantity}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-surface-200 pt-3 space-y-2">
                            <div className="flex justify-between text-sm text-surface-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount ({discount}%)</span>
                                    <span>−₹{Math.round(subtotal * discount / 100)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg text-surface-900 pt-2">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-6 mb-6">
                    <h2 className="font-semibold text-surface-900 mb-2">Payment Details</h2>
                    <p className="text-sm text-surface-500 mb-1">
                        Paying as: <strong>{session.user?.email}</strong>
                    </p>

                    {/* Dynamic Demo / Live Razorpay Banner */}
                    {demoMode === null ? (
                        <div className="mt-3 p-3 rounded-lg bg-surface-50 border border-surface-200 animate-pulse">
                            <p className="text-xs text-surface-400 font-medium">Checking payment gateway...</p>
                        </div>
                    ) : demoMode ? (
                        <div className="mt-3 p-3 rounded-lg bg-brand-50 border border-brand-200">
                            <p className="text-xs text-brand-700 font-medium">
                                🎓 Demo Mode — Payment will be simulated for demonstration purposes.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <p className="text-xs text-green-700 font-medium">
                                    Secured by Razorpay — Your payment is protected with 256-bit encryption.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-red-700 font-semibold mb-2">{error}</p>
                        {rawError && (
                            <div className="mt-2 p-3 bg-red-100/50 rounded-lg border border-red-200 overflow-auto max-h-60">
                                <p className="text-[10px] font-mono whitespace-pre-wrap text-red-900">
                                    {JSON.stringify(rawError, null, 2)}
                                </p>
                            </div>
                        )}
                        <p className="text-[10px] text-red-600 mt-2 italic">
                            Tip: If you see "Unauthorized", please try logging out and back in.
                        </p>
                    </div>
                )}

                <button
                    id="purchase-btn"
                    onClick={handleCheckout}
                    disabled={loading || demoMode === null}
                    className="btn-primary w-full text-base py-4"
                >
                    {loading ? (
                        <span className="flex items-center gap-2 justify-center">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                        </span>
                    ) : demoMode ? (
                        `Complete Purchase — ₹${total}`
                    ) : (
                        `Pay with Razorpay — ₹${total}`
                    )}
                </button>

                <p className="text-xs text-center text-surface-400 mt-4">
                    By completing this purchase, you agree to our{" "}
                    <Link href="/legal/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/legal/refund" className="text-brand-600 hover:underline">Refund Policy</Link>.
                </p>
            </div>
        </AnimatedPage>
    );
}

