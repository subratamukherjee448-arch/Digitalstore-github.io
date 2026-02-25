"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
    productId: string;
    productTitle: string;
}

export default function DeleteButton({ productId, productTitle }: DeleteButtonProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setShowModal(false);
            router.refresh();
        } catch {
            alert("Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                title="Delete product"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !loading && setShowModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>

                        <h3 className="font-display text-lg font-bold text-surface-900 text-center mb-2">
                            Delete Product?
                        </h3>
                        <p className="text-sm text-surface-500 text-center mb-6">
                            Are you sure you want to deactivate <strong className="text-surface-700">&quot;{productTitle}&quot;</strong>? This will hide it from the shop.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
