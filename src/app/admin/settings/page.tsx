import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Settings" };

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        redirect("/login");
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) redirect("/login");

    return (
        <div className="section-padding py-10">
            <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                <h1 className="font-display text-2xl font-bold text-surface-900">Profile Settings</h1>
                <Link href="/admin" className="btn-ghost text-sm">← Back to Dashboard</Link>
            </div>

            <ProfileForm user={{
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }} isAdminLayout={true} />
        </div>
    );
}
