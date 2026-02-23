import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await prisma.product.findMany({
        where: { active: true },
        select: { id: true, updatedAt: true },
    });

    const productUrls = products.map((p) => ({
        url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/product/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [
        { url: process.env.NEXTAUTH_URL || "http://localhost:3000", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        ...productUrls,
    ];
}
