"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/AnimatedPage";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isRegister) {
            // Register new user
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Registration failed");
                    setLoading(false);
                    return;
                }
                // Auto sign in after registration
            } catch {
                setError("Registration failed");
                setLoading(false);
                return;
            }
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-16 max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                    </div>
                    <h1 className="font-display text-2xl font-bold text-surface-900">
                        {isRegister ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-surface-500 text-sm mt-1">
                        {isRegister ? "Sign up to start purchasing" : "Sign in to your account"}
                    </p>
                </div>

                <div className="card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isRegister}
                                    className="input-field"
                                    placeholder="Your name"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
                        </motion.button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => { setIsRegister(!isRegister); setError(""); }}
                            className="text-sm text-brand-600 hover:text-brand-700"
                        >
                            {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                        </button>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 rounded-xl bg-surface-50 border border-surface-200">
                        <p className="text-xs font-semibold text-surface-600 mb-2">Demo Accounts:</p>
                        <div className="space-y-1 text-xs text-surface-500">
                            <p><span className="font-medium">Buyer:</span> buyer@demo.com / buyer123</p>
                            <p><span className="font-medium">Admin:</span> admin@store.com / admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
