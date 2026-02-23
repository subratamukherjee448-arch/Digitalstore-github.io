import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Failed" };

interface Props {
    searchParams: { orderId?: string; reason?: string };
}

export default function CheckoutFailurePage({ searchParams }: Props) {
    return (
        <div className="section-padding py-20 max-w-xl mx-auto text-center">
            <div className="text-7xl mb-6">😔</div>
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-3">
                Payment Failed
            </h1>
            <p className="text-surface-500 mb-4">
                {searchParams.reason || "Your payment could not be processed. No amount has been charged."}
            </p>
            {searchParams.orderId && (
                <p className="text-xs text-surface-400 mb-8">
                    Reference: #{searchParams.orderId.slice(-8).toUpperCase()}
                </p>
            )}
            <div className="flex gap-4 justify-center">
                <Link href="/cart" className="btn-primary">
                    Try Again
                </Link>
                <Link href="/contact" className="btn-secondary">
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
