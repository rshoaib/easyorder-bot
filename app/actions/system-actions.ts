'use server';

import { getTenantRepository } from "@/lib/repository";

export async function checkSystemHealth() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const dbUrl = process.env.DATABASE_URL;
    const resendKey = process.env.RESEND_API_KEY;

    return {
        ai: !!geminiKey,
        database: !!dbUrl,
        email: !!resendKey,
        timestamp: new Date().toISOString()
    };
}
