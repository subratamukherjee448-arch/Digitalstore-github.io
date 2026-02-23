import Link from "next/link";

export default function NotFound() {
    return (
        <div className="section-padding py-20 text-center">
            <div className="text-8xl mb-6">404</div>
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-3">
                Page Not Found
            </h1>
            <p className="text-surface-500 mb-8 max-w-md mx-auto">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex gap-4 justify-center">
                <Link href="/" className="btn-primary">Go Home</Link>
                <Link href="/shop" className="btn-secondary">Browse Shop</Link>
            </div>
        </div>
    );
}
