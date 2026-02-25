"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/AnimatedPage";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // If already logged in, show logged-in state
    if (status === "loading") {
        return (
            <div className="section-padding py-20 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
            </div>
        );
    }

    if (session?.user) {
        const isAdmin = (session.user as any).role === "ADMIN";
        return (
            <AnimatedPage>
                <div className="section-padding py-16 max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="font-display text-2xl font-bold text-surface-900">Already Logged In</h1>
                        <p className="text-surface-500 text-sm mt-1">
                            You are signed in as <strong className="text-surface-700">{session.user.name}</strong>
                        </p>
                    </div>

                    <div className="card p-6 space-y-4">
                        <div className="bg-surface-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Name</span>
                                <span className="font-medium text-surface-900">{session.user.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Email</span>
                                <span className="font-medium text-surface-900">{session.user.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-500">Role</span>
                                <span className={`badge ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                    {isAdmin ? "Admin" : "User"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Link href={isAdmin ? "/admin" : "/shop"} className="btn-primary text-sm text-center">
                                {isAdmin ? "Go to Dashboard" : "Browse Shop"}
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="btn-secondary text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isRegister) {
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name, phone }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Registration failed");
                    setLoading(false);
                    return;
                }
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
                            <>
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
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-surface-700 mb-1">
                                        Mobile Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input-field"
                                        placeholder="9876543210"
                                        pattern="[0-9]{10}"
                                        title="Enter a valid 10-digit mobile number"
                                    />
                                    <p className="text-xs text-surface-400 mt-1">Required for password recovery via OTP</p>
                                </div>
                            </>
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

                        {!isRegister && (
                            <div className="text-right -mt-2">
                                <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

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


                </div>
            </div>
        </AnimatedPage>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="section-padding py-20 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
