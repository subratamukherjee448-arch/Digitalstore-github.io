import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "../ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add New Product" };

export default async function NewProductPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");
    return <ProductForm />;
}
