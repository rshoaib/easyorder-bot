'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getTenantRepository } from '@/lib/repository';
import { cookies } from 'next/headers';

export async function clearStoreOrders(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (!slug) throw new Error('Missing store slug');

    // Verify the user is authenticated (cookie-based auth)
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('auth')?.value === 'true';

    if (!isAuth) {
        throw new Error('Unauthorized: Please log in first');
    }

    const serviceClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const tenantRepo = getTenantRepository(serviceClient);
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) throw new Error('Store not found');

    // Delete all orders for this tenant
    const { error } = await serviceClient
        .from('orders')
        .delete()
        .eq('tenant_id', tenant.id);

    if (error) throw new Error(`Failed to clear orders: ${error.message}`);

    revalidatePath(`/store/${slug}/admin/orders`);
}
