import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
    return (
        <div className="section-padding py-12 max-w-3xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-8">Terms of Service</h1>

            <div className="prose prose-surface max-w-none space-y-6 text-surface-600">
                <p><strong>Effective Date:</strong> January 1, 2024</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">1. Acceptance of Terms</h2>
                <p>By accessing or using College Digital Store, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">2. Products and Licensing</h2>
                <p>All digital products (ebooks and audiobooks) sold through our platform are licensed for personal, non-commercial use only. You may not redistribute, resell, or share purchased content without explicit written permission.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">3. Payments</h2>
                <p>All payments are processed securely through Razorpay. Prices are listed in Indian Rupees (₹). By completing a purchase, you authorize us to charge the listed amount.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">4. Download Access</h2>
                <p>Upon successful payment, you will receive time-limited download links. Links expire after 24 hours or 3 downloads, whichever comes first. If you experience issues, contact our support team.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">5. Intellectual Property</h2>
                <p>All content, including text, audio, graphics, and logos, is owned by the respective authors and College Digital Store. Unauthorized reproduction is prohibited.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">6. Account Responsibility</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">7. Limitation of Liability</h2>
                <p>College Digital Store is not liable for any indirect, incidental, or consequential damages arising from the use of our services or products.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">8. Changes to Terms</h2>
                <p>We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the revised terms.</p>

                <h2 className="font-display text-xl font-bold text-surface-900 mt-8">9. Contact</h2>
                <p>For questions about these terms, contact us at <a href="mailto:support@collegedigital.com" className="text-brand-600 hover:underline">support@collegedigital.com</a>.</p>
            </div>
        </div>
    );
}
