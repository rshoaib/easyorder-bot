'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";

export async function updateDomain(slug: string, domain: string) {
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) throw new Error("Tenant not found");

    // Clean domain
    const cleanDomain = domain.toLowerCase().trim();

    // Check if taken (simple check, DB constraint will also catch it)
    const existing = await repo.getTenantByDomain(cleanDomain);
    if (existing && existing.id !== tenant.id) {
        throw new Error("Domain is already taken by another store.");
    }

    try {
        await repo.updateTenantDomain(tenant.id, cleanDomain);
        revalidatePath(`/store/${slug}`);
        revalidatePath(`/store/${slug}/admin`);
    } catch (e: any) {
        throw new Error("Failed to update domain. It might be taken.");
    }
}
