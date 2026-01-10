'use server';

import { getTenantRepository } from "@/lib/repository";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function registerTenant(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const ownerPhone = formData.get('ownerPhone') as string;

    if (!name || !slug || !email || !password || !ownerPhone) {
        return { error: "All fields are required" };
    }

    const repo = getTenantRepository();

    // Check if slug exists
    const existing = await repo.getTenantBySlug(slug);
    if (existing) {
        return { error: "Store URL is already taken. Please choose another one." };
    }

    try {
        // 1. Create Tenant in DB (Pending Payment)
        const tenant = await repo.createTenant({
            name,
            slug,
            email,
            password, // In a real app, HASH THIS PASSWORD!
            status: 'pending_payment',
            currency: 'USD', // Default
            themeColor: '#2563eb', // Default Blue
            ownerPhone,
            language: 'en'
        });

        // 2. Stripe Removed for Manual Payment Workflow
        // We now just return success, and the frontend will show payment instructions.

        // Send Welcome Email (Fire and forget)
        const { sendWelcomeEmail } = await import('@/lib/email');
        sendWelcomeEmail(email, name, slug).catch(console.error);

        return { success: true, pending: true };

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Something went wrong. Please try again." };
    }
}
