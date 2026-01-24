'use server';

import { getTenantRepository } from "@/lib/repository";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function registerTenant(formData: FormData) {
    const supabase = await createClient(); // Await the async createClient
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create a store." };
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const ownerPhone = formData.get('ownerPhone') as string;
    // Email is taken from the authenticated user
    const email = user.email!;

    if (!name || !slug || !ownerPhone) {
        return { error: "All fields are required" };
    }

    const repo = getTenantRepository();

    // Check if slug exists
    const existing = await repo.getTenantBySlug(slug);
    if (existing) {
        return { error: "Store URL is already taken. Please choose another one." };
    }

    try {
        // Create Tenant in DB (Active immediately)
        const tenant = await repo.createTenant({
            name,
            slug,
            email,
            password: '', // No longer managed here
            status: 'active', // FREE TIER IS ACTIVE
            currency: 'USD',
            themeColor: '#2563eb',
            ownerPhone,
            language: 'en',
            userId: user.id
        });

        // Send Welcome Email (Fire and forget)
        const { sendWelcomeEmail } = await import('@/lib/email');
        sendWelcomeEmail(email, name, slug).catch(console.error);

        return { success: true, tenantId: tenant.id, slug };

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Something went wrong. Please try again." };
    }
}
