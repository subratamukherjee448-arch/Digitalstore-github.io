import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
    title: {
        default: "College Digital Store — Premium Ebooks & Audiobooks",
        template: "%s | College Digital Store",
    },
    description:
        "Discover premium ebooks and audiobooks for students and professionals. Instant, secure downloads with the best prices.",
    keywords: ["ebooks", "audiobooks", "digital store", "college", "textbooks", "study materials"],
    openGraph: {
        type: "website",
        locale: "en_IN",
        siteName: "College Digital Store",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://checkout.razorpay.com" />
            </head>
            <body className="min-h-screen flex flex-col">
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
