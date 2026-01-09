'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";

export async function updateLanguage(slug: string, language: string) {
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) throw new Error("Tenant not found");

    await repo.updateTenantLanguage(tenant.id, language);
    revalidatePath(`/store/${slug}`);
    revalidatePath(`/store/${slug}/admin`);
}
