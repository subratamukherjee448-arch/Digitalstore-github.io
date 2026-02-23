import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import ProductForm from "../../ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product" };

interface Props {
    params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) notFound();

    return <ProductForm product={JSON.parse(JSON.stringify(product))} />;
}
