import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
    return (
        <div className="section-padding py-12 max-w-3xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-8">Privacy Policy</h1>

            <div className="prose prose-surface max-w-none space-y-6 text-surface-600">
                <p><strong>Effective Date:</strong> January 1, 2024</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">1. Information We Collect</h2>
                <p>We collect information you provide directly: name, email address, and payment information (processed by Razorpay). We also automatically collect usage data such as pages visited and device information.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Process your purchases and deliver products</li>
                    <li>Send order confirmations and download links</li>
                    <li>Provide customer support</li>
                    <li>Improve our services</li>
                </ul>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">3. Payment Security</h2>
                <p>We do not store your credit card or banking information. All payments are processed securely through Razorpay&apos;s PCI-compliant infrastructure.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">4. Data Sharing</h2>
                <p>We do not sell or share your personal information with third parties, except as required to process payments (Razorpay) or comply with legal obligations.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">5. Cookies</h2>
                <p>We use essential cookies for session management and authentication. No third-party tracking cookies are used.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">6. Your Rights</h2>
                <p>You may request access to, correction of, or deletion of your personal data by contacting us at <a href="mailto:support@collegedigital.com" className="text-brand-600 hover:underline">support@collegedigital.com</a>.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">7. Changes</h2>
                <p>We may update this policy from time to time. We will notify registered users of significant changes via email.</p>
            </div>
        </div>
    );
}
