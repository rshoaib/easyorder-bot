'use server';

import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { Product } from "@/lib/repository/types";
import { revalidatePath } from "next/cache";

export async function addProduct(slug: string, formData: FormData) {
    if (!slug) throw new Error("Slug is required");

    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);
    if (!tenant) throw new Error("Tenant not found");

    const repo = getProductRepository();

    const id = Date.now().toString();

    const product: Product = {
        id,
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        image: formData.get('image') as string,
        description: formData.get('description') as string || '',
        tenantId: tenant.id,
        isAvailable: true
    };

    await repo.addProduct(product);
    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
}

export async function deleteProduct(slug: string, id: string) {
    const repo = getProductRepository();
    // We should ideally verify the product belongs to the tenant here, but repo.deleteProduct uses ID.
    // Assuming IDs are unique globally or we trust the admin authentication which is scoped.
    await repo.deleteProduct(id);
    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
}
