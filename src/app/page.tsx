import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
    try {
        return await prisma.product.findMany({
            where: { featured: true, active: true },
            orderBy: { createdAt: "desc" },
            take: 4,
        });
    } catch (error) {
        console.error("Failed to fetch featured products:", error);
        return [];
    }
}

export default async function HomePage() {
    const featured = await getFeaturedProducts();

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-surface-900 to-brand-900" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative section-padding py-24 sm:py-32 lg:py-40">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-200 text-sm font-medium mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                            Now available — new releases every week
                        </div>

                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Learn faster.{" "}
                            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                                Read anywhere.
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-surface-300 leading-relaxed mb-10 max-w-2xl">
                            Premium ebooks &amp; audiobooks — instant, secure downloads.
                            From data structures to digital marketing, level up your skills today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/shop" className="btn-primary text-base px-8 py-4 rounded-2xl">
                                Browse Ebooks
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link href="/shop?format=AUDIOBOOK" className="btn-ghost text-white border border-white/20 text-base px-8 py-4 rounded-2xl hover:bg-white/10">
                                🎧 Audiobooks
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mt-14 pt-8 border-t border-white/10">
                            {[
                                { value: "100+", label: "Digital Titles" },
                                { value: "₹149", label: "Starting Price" },
                                { value: "24/7", label: "Instant Access" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-surface-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding py-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-surface-900 mb-2">
                            Featured Picks
                        </h2>
                        <p className="text-surface-500">Hand-picked titles our readers love</p>
                    </div>
                    <Link href="/shop" className="btn-ghost text-brand-600 font-semibold">
                        View all →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featured.length > 0 ? (
                        featured.map((product, i) => (
                            <ProductCard key={product.id} product={product as any} index={i} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-surface-200 rounded-3xl bg-surface-50">
                            <p className="text-surface-500 font-medium">No featured products available at the moment.</p>
                            <Link href="/shop" className="text-brand-600 font-semibold mt-2 inline-block hover:underline">
                                Browse all products instead →
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="section-padding py-20 bg-surface-100/50">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl font-bold text-surface-900 mb-2">
                        Browse by Format
                    </h2>
                    <p className="text-surface-500">Find the perfect format for your learning style</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Link href="/shop?format=EBOOK" className="group">
                        <div className="card p-8 text-center hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100">
                            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">📖</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-surface-900 mb-2">Ebooks</h3>
                            <p className="text-surface-500 text-sm">PDF &amp; EPUB formats. Read on any device.</p>
                        </div>
                    </Link>

                    <Link href="/shop?format=AUDIOBOOK" className="group">
                        <div className="card p-8 text-center hover:border-accent-300 hover:shadow-lg hover:shadow-accent-100">
                            <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🎧</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-surface-900 mb-2">Audiobooks</h3>
                            <p className="text-surface-500 text-sm">High-quality audio. Learn on the go.</p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* How It Works */}
            <section className="section-padding py-20">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl font-bold text-surface-900 mb-2">
                        How It Works
                    </h2>
                    <p className="text-surface-500">Get your books in 3 simple steps</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            step: "01",
                            title: "Browse & Choose",
                            desc: "Explore our curated collection of ebooks and audiobooks.",
                            icon: "🔍",
                        },
                        {
                            step: "02",
                            title: "Secure Checkout",
                            desc: "Pay safely with Razorpay. UPI, cards, net banking supported.",
                            icon: "🔒",
                        },
                        {
                            step: "03",
                            title: "Instant Download",
                            desc: "Get your secure download link immediately after payment.",
                            icon: "⚡",
                        },
                    ].map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">{item.icon}</span>
                            </div>
                            <div className="text-sm font-bold text-brand-600 mb-2">Step {item.step}</div>
                            <h3 className="font-display text-lg font-bold text-surface-900 mb-2">{item.title}</h3>
                            <p className="text-surface-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding py-20 bg-surface-100/50">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl font-bold text-surface-900 mb-2">
                        What Our Readers Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        {
                            name: "Arjun K.",
                            role: "CS Student, IIT Delhi",
                            text: "The Data Structures book helped me crack my Google interview. Clear explanations and great practice problems!",
                            rating: 5,
                        },
                        {
                            name: "Meera S.",
                            role: "Marketing Manager",
                            text: "Loved the Digital Marketing ebook. The case studies were super relevant to the Indian market.",
                            rating: 5,
                        },
                        {
                            name: "Rohan P.",
                            role: "Freelancer",
                            text: "The audiobook on productivity changed how I work. Great narration and practical tips.",
                            rating: 4,
                        },
                    ].map((t) => (
                        <div key={t.name} className="card p-6">
                            <div className="flex mb-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < t.rating ? "text-yellow-400" : "text-surface-200"}`}
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-surface-600 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                            <div>
                                <div className="font-semibold text-surface-900 text-sm">{t.name}</div>
                                <div className="text-xs text-surface-400">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding py-20">
                <div className="card bg-gradient-to-br from-brand-600 to-brand-800 border-0 p-12 text-center">
                    <h2 className="font-display text-3xl font-bold text-white mb-4">
                        Ready to start learning?
                    </h2>
                    <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                        Join thousands of students who&apos;ve upgraded their skills with our digital library.
                    </p>
                    <Link href="/shop" className="inline-flex items-center px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-brand-50 transition-colors shadow-lg">
                        Browse All Products
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </>
    );
}
