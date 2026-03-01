/** @type {import('next').NextConfig} */

// Ensure DATABASE_URL has the correct protocol for SQLite on Vercel/Production
if (process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith('file:') &&
    !process.env.DATABASE_URL.includes('://')) {
    process.env.DATABASE_URL = `file:${process.env.DATABASE_URL}`;
}

const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**" },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
        outputFileTracingIncludes: {
            '/**/*': ['./prisma/**/*'],
        },
    },
};

module.exports = nextConfig;
