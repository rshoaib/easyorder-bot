'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getTenantRepository } from '@/lib/repository';

export async function clearStoreOrders(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (!slug) throw new Error('Missing store slug');

    // Get tenant to verify ownership
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const serviceClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const tenantRepo = getTenantRepository(serviceClient);
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) throw new Error('Store not found');

    // Verify the logged-in user owns this store
    if (!user || tenant.userId !== user.id) {
        throw new Error('Unauthorized: You do not own this store');
    }

    // Delete all orders for this tenant
    const { error } = await serviceClient
        .from('orders')
        .delete()
        .eq('tenant_id', tenant.id);

    if (error) throw new Error(`Failed to clear orders: ${error.message}`);

    revalidatePath(`/store/${slug}/admin/orders`);
}
