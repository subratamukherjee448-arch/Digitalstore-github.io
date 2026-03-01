import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("🔐 Auth attempt for:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.error("❌ Missing credentials");
                    throw new Error("Email and password are required");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        console.error("❌ No user found with email:", credentials.email);
                        throw new Error("No account found with this email");
                    }

                    const isValid = await compare(credentials.password, user.password);
                    if (!isValid) {
                        console.error("❌ Invalid password for:", credentials.email);
                        throw new Error("Invalid password");
                    }

                    console.log("✅ Auth successful for:", user.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error("❌ Auth system error:", error.message || error);
                    throw error;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};
