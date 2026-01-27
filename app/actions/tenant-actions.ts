'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";

export async function toggleStoreStatus(tenantId: string, slug: string, isOpen: boolean) {
    const repo = getTenantRepository();
    // In real app, verify user permission here

    // We update only the is_open field
    // Since updateTenantSettings takes all args, we might need a specific method or just pass undefined for others if the repo supports partial updates (which it seems to, based on previous edits).
    // Let's check supabase-repo implementation again. It allows undefined.

    await repo.updateTenantSettings(
        tenantId,
        undefined, // ownerPhone
        undefined, // instagram
        undefined, // facebook
        undefined, // pixel
        undefined, // currency
        undefined, // themeColor
        undefined, // logoUrl
        isOpen
    );

    revalidatePath(`/store/${slug}`);
    revalidatePath(`/store/${slug}/admin`);
    revalidatePath(`/store/${slug}/admin/settings`);

    return { success: true };
}
