import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return { title: "Product Not Found" };
    return {
        title: product.title,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.slice(0, 160),
            images: [product.coverUrl],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product || !product.active) notFound();

    const related = await prisma.product.findMany({
        where: { category: product.category, id: { not: product.id }, active: true },
        take: 3,
    });

    return (
        <ProductDetailClient
            product={JSON.parse(JSON.stringify(product))}
            related={JSON.parse(JSON.stringify(related))}
        />
    );
}
