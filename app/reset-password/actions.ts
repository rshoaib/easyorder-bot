'use server';

import { getTenantRepository } from '@/lib/repository';

/**
 * Server-side helper used by the reset-password client page to figure out
 * which store the user owns so we can redirect them to /store/<slug>/admin
 * after they've updated their password.
 *
 * Returns the tenant slug, or null if the user has no tenant.
 */
export async function getTenantBySlug(userId: string): Promise<string | null> {
    if (!userId) return null;
    try {
        const repo = getTenantRepository();
        const tenant = await repo.getTenantByUserId(userId);
        return tenant?.slug ?? null;
    } catch {
        return null;
    }
}
