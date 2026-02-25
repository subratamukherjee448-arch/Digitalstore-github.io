"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AnimatedPage from "@/components/AnimatedPage";

type Step = "email" | "otp" | "reset" | "success";

function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [maskedPhone, setMaskedPhone] = useState("");
    const [demoOtp, setDemoOtp] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    // Auto-focus first OTP input when entering OTP step
    useEffect(() => {
        if (step === "otp") {
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }
    }, [step]);

    // Step 1: Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setMaskedPhone(data.maskedPhone);
            setDemoOtp(data._demoOtp || "");
            setCountdown(30);
            setStep("otp");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtp(newOtp);
        if (pasted.length > 0) {
            otpRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/forgot-password/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpString }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setStep("reset");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/forgot-password/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setStep("success");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setDemoOtp(data._demoOtp || "");
            setOtp(["", "", "", "", "", ""]);
            setCountdown(30);
            otpRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-16 max-w-md mx-auto">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[
                        { key: "email", label: "Email", icon: "📧" },
                        { key: "otp", label: "Verify OTP", icon: "📱" },
                        { key: "reset", label: "New Password", icon: "🔑" },
                    ].map((s, i) => {
                        const steps: Step[] = ["email", "otp", "reset"];
                        const currentIdx = steps.indexOf(step === "success" ? "reset" : step);
                        const isActive = i <= currentIdx;
                        const isCurrent = steps[i] === step;

                        return (
                            <div key={s.key} className="flex items-center">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isCurrent
                                        ? "bg-brand-100 text-brand-700 ring-2 ring-brand-200"
                                        : isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-surface-100 text-surface-400"
                                    }`}>
                                    <span>{isActive && !isCurrent ? "✓" : s.icon}</span>
                                    <span className="hidden sm:inline">{s.label}</span>
                                </div>
                                {i < 2 && (
                                    <div className={`w-8 h-0.5 mx-1 ${isActive && i < currentIdx ? "bg-green-300" : "bg-surface-200"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
                        <span className="text-2xl">
                            {step === "email" ? "🔐" : step === "otp" ? "📱" : step === "reset" ? "🔑" : "✅"}
                        </span>
                    </div>
                    <h1 className="font-display text-2xl font-bold text-surface-900">
                        {step === "email" && "Forgot Password?"}
                        {step === "otp" && "Verify OTP"}
                        {step === "reset" && "Set New Password"}
                        {step === "success" && "Password Reset!"}
                    </h1>
                    <p className="text-surface-500 text-sm mt-1">
                        {step === "email" && "Enter your registered email to receive an OTP"}
                        {step === "otp" && `Enter the 6-digit OTP sent to ${maskedPhone}`}
                        {step === "reset" && "Choose a strong new password for your account"}
                        {step === "success" && "Your password has been changed successfully"}
                    </p>
                </div>

                <div className="card p-6">
                    {/* Step 1: Email */}
                    {step === "email" && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="admin@store.com"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 animate-fadeIn">
                                    <span className="text-red-500">✕</span>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : "Send OTP to Mobile"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            {/* OTP Input Boxes */}
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-3 text-center">
                                    Enter 6-digit OTP
                                </label>
                                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => { otpRefs.current[i] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-surface-300 bg-white text-surface-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Demo OTP hint */}
                            {demoOtp && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                                    <p className="text-xs text-blue-600 font-medium">📱 Demo Mode — OTP sent to console</p>
                                    <p className="text-lg font-bold font-mono text-blue-800 mt-1 tracking-widest">{demoOtp}</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 animate-fadeIn">
                                    <span className="text-red-500">✕</span>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary w-full">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : "Verify OTP"}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <p className="text-xs text-surface-400 mb-1">Didn&apos;t receive the OTP?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0 || loading}
                                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 disabled:text-surface-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-surface-700 mb-1.5">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                                <p className="text-xs text-surface-400 mt-1">At least 6 characters</p>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`input-field ${confirmPassword && newPassword !== confirmPassword ? "border-red-400 focus:ring-red-200 focus:border-red-400" : ""}`}
                                    placeholder="••••••••"
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 animate-fadeIn">
                                    <span className="text-red-500">✕</span>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loading || (!!confirmPassword && newPassword !== confirmPassword)} className="btn-primary w-full">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Resetting...
                                    </span>
                                ) : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === "success" && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-display text-lg font-bold text-surface-900 mb-2">All done!</h3>
                            <p className="text-sm text-surface-500 mb-6">
                                Your password has been reset successfully. You can now log in with your new password.
                            </p>
                            <Link href="/login" className="btn-primary w-full">
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Back to login */}
                {step !== "success" && (
                    <div className="text-center mt-6">
                        <Link href="/login" className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={
            <div className="section-padding py-20 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
            </div>
        }>
            <ForgotPasswordForm />
        </Suspense>
    );
}
