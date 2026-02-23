"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Coupon {
    id: string;
    code: string;
    discountPercent: number;
    active: boolean;
    usageLimit: number;
    usageCount: number;
}

export default function CouponActions({ coupons: initialCoupons }: { coupons: Coupon[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [percent, setPercent] = useState(10);
    const [limit, setLimit] = useState(100);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await fetch("/api/admin/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code.toUpperCase(), discountPercent: percent, usageLimit: limit }),
        });
        setCode("");
        setPercent(10);
        setLimit(100);
        setLoading(false);
        router.refresh();
    };

    const toggleCoupon = async (id: string, active: boolean) => {
        await fetch(`/api/admin/coupons/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: !active }),
        });
        router.refresh();
    };

    return (
        <div>
            {/* Create Form */}
            <form onSubmit={handleCreate} className="card p-5 mb-8">
                <h2 className="font-semibold text-surface-900 mb-4">Create New Coupon</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
                        placeholder="CODE" required className="input-field text-sm" />
                    <input type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))}
                        min={1} max={100} required className="input-field text-sm" placeholder="Discount %" />
                    <input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))}
                        min={1} required className="input-field text-sm" placeholder="Usage limit" />
                    <button type="submit" disabled={loading} className="btn-primary text-sm">
                        {loading ? "..." : "Create"}
                    </button>
                </div>
            </form>

            {/* Coupon List */}
            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-surface-200 bg-surface-50">
                            <th className="text-left p-4 font-semibold text-surface-600">Code</th>
                            <th className="text-left p-4 font-semibold text-surface-600">Discount</th>
                            <th className="text-left p-4 font-semibold text-surface-600">Usage</th>
                            <th className="text-left p-4 font-semibold text-surface-600">Status</th>
                            <th className="text-left p-4 font-semibold text-surface-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialCoupons.map((coupon) => (
                            <tr key={coupon.id} className="border-b border-surface-100">
                                <td className="p-4 font-mono font-bold">{coupon.code}</td>
                                <td className="p-4">{coupon.discountPercent}%</td>
                                <td className="p-4 text-surface-500">{coupon.usageCount} / {coupon.usageLimit}</td>
                                <td className="p-4">
                                    <span className={`badge ${coupon.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {coupon.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => toggleCoupon(coupon.id, coupon.active)}
                                        className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                                        {coupon.active ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
