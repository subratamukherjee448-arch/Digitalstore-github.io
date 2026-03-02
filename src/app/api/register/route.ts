import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password, name, phone } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 12);
        const adminEmails = ["somanshu737@gmail.com", "priyobratamukherjee223@gmail.com"];
        const role = adminEmails.includes(email) ? "ADMIN" : "USER";
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, phone: phone || null, role },
        });

        return NextResponse.json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
