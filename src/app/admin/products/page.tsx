import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = { title: "Manage Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

    return <ProductsClient products={JSON.parse(JSON.stringify(products))} />;
}
