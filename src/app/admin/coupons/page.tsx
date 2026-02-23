import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import CouponActions from "./CouponActions";

export const metadata: Metadata = { title: "Manage Coupons" };

export default async function AdminCouponsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

    const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

    return (
        <div className="section-padding py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-2xl font-bold text-surface-900">Coupons</h1>
                <Link href="/admin" className="btn-ghost text-sm">← Dashboard</Link>
            </div>

            <CouponActions coupons={JSON.parse(JSON.stringify(coupons))} />
        </div>
    );
}
