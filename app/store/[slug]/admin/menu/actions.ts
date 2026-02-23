'use server';

import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { Product } from "@/lib/repository/types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { verifyTenantOwnership } from "@/lib/auth/security";

export async function addProduct(slug: string, formData: FormData) {
    // Security Check
    await verifyTenantOwnership(slug);

    if (!slug) throw new Error("Slug is required");

    // Use authenticated server client for RLS compliance
    const supabase = await createClient();

    const tenantRepo = getTenantRepository(supabase);
    const tenant = await tenantRepo.getTenantBySlug(slug);
    if (!tenant) throw new Error("Tenant not found");

    const repo = getProductRepository(supabase);

    const id = Date.now().toString();

    const product: Product = {
        id,
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        image: formData.get('image') as string,
        description: formData.get('description') as string || '',
        tenantId: tenant.id,
        isAvailable: true,
        type: (formData.get('type') as 'physical' | 'digital' | 'service') || 'physical',
        digitalFileUrl: formData.get('digitalFileUrl') as string || undefined
    };

    await repo.addProduct(product);
    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
}

export async function deleteProduct(slug: string, id: string) {
    // Security Check
    await verifyTenantOwnership(slug);

    // Use authenticated server client for RLS compliance
    const supabase = await createClient();
    const repo = getProductRepository(supabase);
    await repo.deleteProduct(id);
    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
}

export async function importProducts(slug: string, products: Omit<Product, 'id' | 'tenantId'>[]) {
    // Security Check
    await verifyTenantOwnership(slug);

    // Use authenticated server client for RLS compliance
    const supabase = await createClient();

    const tenantRepo = getTenantRepository(supabase);
    const tenant = await tenantRepo.getTenantBySlug(slug);
    if (!tenant) throw new Error("Tenant not found");

    const repo = getProductRepository(supabase);

    for (const p of products) {
        const product: Product = {
            ...p,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            tenantId: tenant.id,
            type: 'physical'
        };
        await repo.addProduct(product);
    }

    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
}

export async function updateProduct(slug: string, productId: string, data: { name?: string; price?: number; category?: string; description?: string }) {
    // Security Check
    await verifyTenantOwnership(slug);

    const supabase = await createClient();
    const repo = getProductRepository(supabase);
    await repo.updateProduct(productId, data);
    revalidatePath(`/store/${slug}/admin/menu`);
    revalidatePath(`/store/${slug}`);
}
