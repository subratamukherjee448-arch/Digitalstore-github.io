/** @type {import('next').NextConfig} */
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
