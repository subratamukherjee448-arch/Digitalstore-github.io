import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
    title: "Shop",
    description: "Browse our collection of premium ebooks and audiobooks.",
};

interface ShopPageProps {
    searchParams: { format?: string; category?: string; sort?: string; q?: string };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const { format, category, sort, q } = searchParams;

    const where: any = { active: true };
    if (format) where.format = format;
    if (category) where.category = category;
    if (q) {
        where.OR = [
            { title: { contains: q } },
            { author: { contains: q } },
            { description: { contains: q } },
        ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "title") orderBy = { title: "asc" };

    const products = await prisma.product.findMany({ where, orderBy });

    const categories = await prisma.product.findMany({
        where: { active: true },
        select: { category: true },
        distinct: ["category"],
    });

    return (
        <ShopClient
            products={JSON.parse(JSON.stringify(products))}
            categories={categories.map((c) => c.category)}
            currentFormat={format || ""}
            currentCategory={category || ""}
            currentSort={sort || "newest"}
            currentQuery={q || ""}
        />
    );
}
