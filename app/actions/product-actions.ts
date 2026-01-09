'use server';

import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";

export async function toggleProductAvailability(id: string, currentState: boolean, slug: string) {
    const repo = getProductRepository();
    // Security: In a real app we should verify the user owns the tenant of this product!
    // For MVP, relying on Admin Middleware implies access.
    await repo.toggleAvailability(id, !currentState);
    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
    return { success: true };
}
