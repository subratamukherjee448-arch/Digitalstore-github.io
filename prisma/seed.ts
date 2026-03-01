import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// Ensure DATABASE_URL has the correct protocol for SQLite
if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:") &&
    !process.env.DATABASE_URL.includes("://")
) {
    process.env.DATABASE_URL = `file:${process.env.DATABASE_URL}`;
}

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminPassword = await hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@store.com" },
        update: {},
        create: {
            email: "admin@store.com",
            password: adminPassword,
            name: "Admin",
            phone: "9876543210",
            role: "ADMIN",
        },
    });
    console.log("✅ Admin user created:", admin.email);

    // Create demo buyer
    const buyerPassword = await hash("buyer123", 12);
    const buyer = await prisma.user.upsert({
        where: { email: "buyer@demo.com" },
        update: {},
        create: {
            email: "buyer@demo.com",
            password: buyerPassword,
            name: "Demo Buyer",
            role: "USER",
        },
    });
    console.log("✅ Demo buyer created:", buyer.email);

    // Create sample products
    const products = [
        {
            title: "Razorpay Test Item",
            author: "Test Store",
            description:
                "This is a ₹1 test product for verifying Razorpay payment integration. Use this to confirm that the payment gateway is working correctly.",
            price: 1,
            format: "EBOOK",
            category: "Test",
            coverUrl: "/covers/data-structures.jpg",
            filePath: "test-item.pdf",
            sampleUrl: "",
            featured: true,
        },
        {
            title: "Canva Design Templates Pack",
            author: "Digital Store",
            description:
                "50+ premium Canva templates for social media posts, stories, presentations, and marketing materials. Ready-to-use, fully customizable designs for Instagram, LinkedIn, and more.",
            price: 2,
            format: "EBOOK",
            category: "Design",
            coverUrl: "/covers/digital-marketing.jpg",
            filePath: "canva-templates.pdf",
            sampleUrl: "",
            featured: true,
        },
        {
            title: "Data Structures for Interviews",
            author: "Priya Sharma",
            description:
                "Concise guide with 30+ code examples covering arrays, trees, graphs, and dynamic programming. Perfect for technical interview preparation. Includes audiobook version for learning on the go.",
            price: 299,
            format: "EBOOK",
            category: "Computer Science",
            coverUrl: "/covers/data-structures.jpg",
            filePath: "data-structures.pdf",
            sampleUrl: "",
            featured: true,
        },
        {
            title: "The Art of Digital Marketing",
            author: "Rahul Mehta",
            description:
                "Master social media, SEO, email campaigns, and analytics. Real-world case studies from Indian startups. Updated for 2024 with AI-powered marketing strategies.",
            price: 199,
            format: "EBOOK",
            category: "Business",
            coverUrl: "/covers/digital-marketing.jpg",
            filePath: "digital-marketing.pdf",
            sampleUrl: "",
            featured: true,
        },
        {
            title: "Machine Learning Fundamentals",
            author: "Dr. Ankit Verma",
            description:
                "From linear regression to neural networks — a hands-on guide with Python code. Each chapter includes exercises and real datasets. Covers scikit-learn, TensorFlow, and PyTorch.",
            price: 399,
            format: "EBOOK",
            category: "Computer Science",
            coverUrl: "/covers/ml-fundamentals.jpg",
            filePath: "ml-fundamentals.pdf",
            sampleUrl: "",
            featured: true,
        },
        {
            title: "Mindful Productivity",
            author: "Sneha Kapoor",
            description:
                "Audio guide to building sustainable work habits without burnout. Combines mindfulness techniques with practical productivity systems used by top performers.",
            price: 149,
            format: "AUDIOBOOK",
            category: "Self Help",
            coverUrl: "/covers/mindful-productivity.jpg",
            filePath: "mindful-productivity.mp3",
            sampleUrl: "/samples/mindful-preview.mp3",
            featured: false,
        },
        {
            title: "Startup Stories India",
            author: "Vikram Patel",
            description:
                "Listen to 10 founders share their journey — failures, pivots, and breakthroughs. Features founders from Zerodha, Razorpay, CRED, and more. Narrated by the author.",
            price: 249,
            format: "AUDIOBOOK",
            category: "Business",
            coverUrl: "/covers/startup-stories.jpg",
            filePath: "startup-stories.mp3",
            sampleUrl: "/samples/startup-preview.mp3",
            featured: true,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.title.toLowerCase().replace(/\s+/g, "-") },
            update: product,
            create: {
                id: product.title.toLowerCase().replace(/\s+/g, "-"),
                ...product,
            },
        });
    }
    console.log(`✅ ${products.length} products created`);

    // Create sample coupons
    await prisma.coupon.upsert({
        where: { code: "WELCOME10" },
        update: {},
        create: {
            code: "WELCOME10",
            discountPercent: 10,
            active: true,
            usageLimit: 100,
        },
    });
    await prisma.coupon.upsert({
        where: { code: "STUDENT20" },
        update: {},
        create: {
            code: "STUDENT20",
            discountPercent: 20,
            active: true,
            usageLimit: 50,
        },
    });
    console.log("✅ Coupons created: WELCOME10, STUDENT20");

    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
