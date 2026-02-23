import Link from "next/link";

const footerLinks = {
    shop: [
        { href: "/shop?format=EBOOK", label: "Ebooks" },
        { href: "/shop?format=AUDIOBOOK", label: "Audiobooks" },
        { href: "/shop", label: "All Products" },
    ],
    support: [
        { href: "/contact", label: "Contact Us" },
        { href: "/account", label: "My Account" },
    ],
    legal: [
        { href: "/legal/terms", label: "Terms of Service" },
        { href: "/legal/privacy", label: "Privacy Policy" },
        { href: "/legal/refund", label: "Refund Policy" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-surface-900 text-surface-300 mt-20">
            <div className="section-padding py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                            </div>
                            <span className="font-display font-bold text-lg text-white">
                                Digital<span className="text-brand-400">Store</span>
                            </span>
                        </div>
                        <p className="text-sm text-surface-400 leading-relaxed">
                            Premium ebooks &amp; audiobooks for students and professionals.
                            Instant, secure downloads.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-surface-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-surface-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-surface-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-surface-500">
                        © {new Date().getFullYear()} College Digital Store. All rights reserved.
                    </p>
                    <p className="text-xs text-surface-600">
                        Built with Next.js, Tailwind CSS &amp; ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
}
