import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
    return (
        <div className="section-padding py-12 max-w-3xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-8">Refund Policy</h1>

            <div className="prose prose-surface max-w-none space-y-6 text-surface-600">
                <p><strong>Effective Date:</strong> January 1, 2024</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">Overview</h2>
                <p>Since our products are digital goods (ebooks and audiobooks) delivered instantly, refund requests are handled on a case-by-case basis.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">Eligible for Refund</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Duplicate purchases (same product purchased twice)</li>
                    <li>Technical issues preventing download within the allowed window</li>
                    <li>Product significantly differs from the description</li>
                </ul>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">Not Eligible</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Change of mind after purchase</li>
                    <li>Product already downloaded successfully</li>
                    <li>Request made after 7 days of purchase</li>
                </ul>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">How to Request a Refund</h2>
                <p>Email us at <a href="mailto:support@collegedigital.com" className="text-brand-600 hover:underline">support@collegedigital.com</a> with:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Your order ID</li>
                    <li>Email used for purchase</li>
                    <li>Reason for refund</li>
                </ul>
                <p>We will process eligible refunds within 5–7 business days. Refunds are credited back to the original payment method.</p>
            </div>
        </div>
    );
}
