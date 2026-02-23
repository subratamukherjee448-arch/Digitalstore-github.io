"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "/contact", label: "Contact" },
    ];

    const isAdmin = (session?.user as any)?.role === "ADMIN";

    return (
        <header className="sticky top-0 z-50 glass border-b border-surface-200/50">
            <div className="section-padding">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        </div>
                        <span className="font-display font-bold text-lg text-surface-900 group-hover:text-brand-600 transition-colors">
                            Digital<span className="text-brand-600">Store</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${pathname === link.href
                                        ? "text-brand-700 bg-brand-50"
                                        : "text-surface-600 hover:text-surface-900 hover:bg-surface-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative btn-ghost p-2"
                            aria-label={`Shopping cart with ${itemCount} items`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Account / Auth */}
                        {session ? (
                            <div className="hidden md:flex items-center gap-2">
                                {isAdmin && (
                                    <Link href="/admin" className="btn-ghost text-sm">
                                        Admin
                                    </Link>
                                )}
                                <Link href="/account" className="btn-ghost text-sm">
                                    Account
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="btn-ghost text-sm text-surface-500"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:inline-flex btn-secondary text-sm px-4 py-2">
                                Sign In
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden btn-ghost p-2"
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden border-t border-surface-200"
                            aria-label="Mobile navigation"
                        >
                            <div className="py-3 space-y-1">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`block px-4 py-2 rounded-lg text-sm font-medium
                      ${pathname === link.href
                                                ? "text-brand-700 bg-brand-50"
                                                : "text-surface-600 hover:bg-surface-100"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {session ? (
                                    <>
                                        {isAdmin && (
                                            <Link href="/admin" onClick={() => setMobileOpen(false)}
                                                className="block px-4 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link href="/account" onClick={() => setMobileOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100">
                                            My Account
                                        </Link>
                                        <button onClick={() => { signOut(); setMobileOpen(false); }}
                                            className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-surface-500 hover:bg-surface-100">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-2 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50">
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
