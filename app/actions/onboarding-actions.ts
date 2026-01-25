'use server';

import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { PRESET_MENUS, PresetType } from "@/lib/presets";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function seedStore(slug: string, type: PresetType) {
    // 1. Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const tenantRepo = getTenantRepository(supabase);
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) {
        return { error: "Store not found" };
    }

    // Verify ownership
    if (tenant.userId && tenant.userId !== user.id) {
        return { error: "Unauthorized" };
    }

    const preset = PRESET_MENUS[type];
    if (!preset) {
        return { error: "Invalid preset type" };
    }

    const productRepo = getProductRepository(supabase);

    try {
        // 2. Insert Products
        for (const item of preset.products) {
            // Generate simple ID
            const productId = crypto.randomUUID();

            await productRepo.addProduct({
                id: productId,
                tenantId: tenant.id,
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                category: item.category,
                isAvailable: true
            });
        }

        revalidatePath(`/store/${slug}/admin`);
        revalidatePath(`/store/${slug}/menu`);

        return { success: true };
    } catch (error: any) {
        console.error("Seeding error:", error);
        return { error: "Failed to seed menu. Please try manually adding items." };
    }
}
