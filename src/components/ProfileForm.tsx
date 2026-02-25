"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string | null;
        role: string;
    };
    isAdminLayout?: boolean;
}

export default function ProfileForm({ user, isAdminLayout = false }: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone || "");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setFeedback({ type: "success", message: "Profile updated successfully!" });
            router.refresh();
        } catch (err: any) {
            setFeedback({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`card ${isAdminLayout ? "p-8 max-w-2xl mx-auto" : "p-6"}`}>
            {!isAdminLayout && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-surface-900 leading-tight">Profile Info</h2>
                        <p className="text-sm text-surface-500">Manage your personal details</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email (Read Only) */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
                            <span>📧</span> Email Address
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="input-field bg-surface-50 text-surface-500 cursor-not-allowed border-surface-200"
                        />
                        <p className="text-xs text-surface-400 mt-1">Email cannot be changed.</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
                            <span>👤</span> Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Your Name"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
                            <span>📱</span> Mobile Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field"
                            placeholder="10-digit mobile number"
                            pattern="[0-9]{10}"
                            title="Enter a valid 10-digit mobile number"
                        />
                    </div>
                </div>

                {/* Feedback Message */}
                {feedback && (
                    <div className={`p-3 rounded-xl flex items-center gap-2 text-sm animate-fadeIn ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        <span>{feedback.type === "success" ? "✅" : "❌"}</span>
                        {feedback.message}
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || (name === user.name && phone === (user.phone || ""))}
                        className="btn-primary"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving...
                            </span>
                        ) : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
