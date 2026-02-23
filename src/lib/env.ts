import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
    RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required"),
    RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
    SMTP_HOST: z.string().optional().default(""),
    SMTP_PORT: z.string().optional().default("587"),
    SMTP_USER: z.string().optional().default(""),
    SMTP_PASS: z.string().optional().default(""),
    EMAIL_FROM: z.string().optional().default("store@collegedigital.com"),
    STORAGE_PATH: z.string().optional().default("./storage"),
    DOWNLOAD_EXPIRY_HOURS: z.string().optional().default("24"),
    DOWNLOAD_MAX_COUNT: z.string().optional().default("3"),
});

function validateEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("❌ Invalid environment variables:");
        parsed.error.issues.forEach((issue) => {
            console.error(`  ${issue.path.join(".")}: ${issue.message}`);
        });
        // Don't throw in build mode
        if (process.env.NODE_ENV !== "production") {
            console.warn("⚠️  Some features may not work without proper env vars.");
        }
        return process.env as unknown as z.infer<typeof envSchema>;
    }
    return parsed.data;
}

export const env = validateEnv();
