'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

import { verifyTenantOwnership } from "@/lib/auth/security";

export async function toggleStoreStatus(tenantId: string, slug: string, isOpen: boolean) {
    // Security Check
    await verifyTenantOwnership(slug);

    const repo = getTenantRepository();
    // In real app, verify user permission here

    // We update only the is_open field
    await repo.updateTenantSettings(tenantId, {
        isOpen
    });

    revalidatePath(`/store/${slug}/admin/settings`);

    return { success: true };
}

export async function deleteStore(slug: string, tenantId: string) {
    try {
        // Security Check
        await verifyTenantOwnership(slug);

        const supabase = await createClient();
        const repo = getTenantRepository(supabase);
        await repo.deleteTenant(tenantId);

        return { success: true };
    } catch (error: any) {
        console.error("DELETE STORE ERROR:", error);
        // Return error to client if we update the component to handle it, 
        // but for now this helps debugging in server logs.
        throw error;
    }
}

/**
 * Silently auto-detect and save the store's timezone from the owner's browser.
 * Only writes if no timezone is currently set — never overrides a manual choice.
 */
export async function autoDetectTimezone(tenantId: string, slug: string, detectedTimezone: string) {
    try {
        // Validate it's a real IANA timezone
        Intl.DateTimeFormat(undefined, { timeZone: detectedTimezone });
    } catch {
        return; // invalid timezone string, skip silently
    }

    try {
        await verifyTenantOwnership(slug);

        const supabase = await createClient();
        const repo = getTenantRepository(supabase);
        const tenant = await repo.getTenantById(tenantId);

        // Only set if not already configured (never override manual choice)
        if (tenant && !tenant.timezone) {
            await repo.updateTenantSettings(tenantId, {
                timezone: detectedTimezone
            });
            revalidatePath(`/store/${slug}`);
        }
    } catch {
        // Fail silently — this is a background enhancement, not critical
    }
}
