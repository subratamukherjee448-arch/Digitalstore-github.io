"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedPage from "@/components/AnimatedPage";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate form submission (in production, send to an API)
        await new Promise((r) => setTimeout(r, 1000));
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <AnimatedPage>
            <div className="section-padding py-12 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">Contact Us</h1>
                    <p className="text-surface-500">Have a question? We&apos;d love to hear from you.</p>
                </div>

                {status === "sent" ? (
                    <div className="card p-8 text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h2 className="font-display text-xl font-bold text-surface-900 mb-2">
                            Message Sent!
                        </h2>
                        <p className="text-surface-500 mb-6">
                            We&apos;ll get back to you within 24 hours.
                        </p>
                        <button onClick={() => setStatus("idle")} className="btn-secondary">
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
                                <input id="name" type="text" required value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input-field" placeholder="Your name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">Email *</label>
                                <input id="email" type="email" required value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="input-field" placeholder="you@example.com" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-surface-700 mb-1">Subject *</label>
                            <input id="subject" type="text" required value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="input-field" placeholder="How can we help?" />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-surface-700 mb-1">Message *</label>
                            <textarea id="message" rows={5} required value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="input-field" placeholder="Your message..." />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={status === "sending"}
                            className="btn-primary w-full"
                        >
                            {status === "sending" ? "Sending..." : "Send Message"}
                        </motion.button>
                    </form>
                )}

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: "📧", title: "Email", detail: "support@collegedigital.com" },
                        { icon: "💬", title: "Response Time", detail: "Within 24 hours" },
                        { icon: "📍", title: "Location", detail: "India" },
                    ].map((item) => (
                        <div key={item.title} className="card p-5">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <h3 className="font-semibold text-surface-900 text-sm">{item.title}</h3>
                            <p className="text-sm text-surface-500">{item.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
}
