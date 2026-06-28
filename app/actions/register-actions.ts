'use server';

import { getTenantRepository } from "@/lib/repository";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DEMO_MODE, CLOSURE_MESSAGE } from "@/lib/config";

export async function registerTenant(formData: FormData) {
    // Demo-only mode: new store creation is permanently disabled.
    if (DEMO_MODE) {
        return { error: CLOSURE_MESSAGE };
    }

    const supabase = await createClient(); // Await the async createClient
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create a store." };
    }

    const repo = getTenantRepository(supabase);

    // Block duplicate stores — one store per account
    const existingTenant = await repo.getTenantByUserId(user.id);
    if (existingTenant) {
        return { error: "You already have a store. Only one store per account is allowed.", slug: existingTenant.slug };
    }

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const ownerPhone = formData.get('ownerPhone') as string;
    const storePreset = (formData.get('storePreset') as string) || 'pizza';
    // Email is taken from the authenticated user
    const email = user.email!;

    if (!name || !slug || !ownerPhone) {
        return { error: "All fields are required" };
    }

    // Check if slug exists
    const existing = await repo.getTenantBySlug(slug);
    if (existing) {
        return { error: "Store URL is already taken. Please choose another one." };
    }

    try {
        // Resolve store type from preset
        const { PRESET_MENUS } = await import('@/lib/presets');
        const preset = PRESET_MENUS[storePreset as keyof typeof PRESET_MENUS];
        const storeType = preset?.storeType || 'restaurant';

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

        // Auto-seed store with preset products (Fix 1: skip OnboardingWizard)
        if (preset) {
            try {
                const { getProductRepository } = await import('@/lib/repository');
                const productRepo = getProductRepository(supabase);
                for (const item of preset.products) {
                    await productRepo.addProduct({
                        id: crypto.randomUUID(),
                        tenantId: tenant.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                        category: item.category,
                        isAvailable: true,
                        type: item.type || 'physical'
                    });
                }
                // Set store type on tenant
                const tenantRepo = getTenantRepository(supabase);
                await tenantRepo.updateTenantSettings(tenant.id, {
                    storeType: storeType as "restaurant" | "retail" | "service" | "digital"
                });
            } catch (seedErr) {
                console.error("Auto-seed warning (non-fatal):", seedErr);
                // Non-fatal: store is created, user can still add products manually
            }
        }

        // Send Welcome Email (Fire and forget)
        const { sendWelcomeEmail } = await import('@/lib/email');
        sendWelcomeEmail(email, name, slug).catch(console.error);

        return { success: true, tenantId: tenant.id, slug };

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Something went wrong. Please try again." };
    }
}

export async function checkSlugAvailability(slug: string) {
    if (!slug || slug.length < 2) {
        return { available: false, error: 'Slug must be at least 2 characters' };
    }

    const supabase = await createClient();
    const repo = getTenantRepository(supabase);
    const existing = await repo.getTenantBySlug(slug);

    return { available: !existing };
}
