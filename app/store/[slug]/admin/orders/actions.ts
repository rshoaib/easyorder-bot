'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getTenantRepository } from '@/lib/repository';
import { cookies } from 'next/headers';

export async function clearStoreOrders(formData: FormData) {
    const slug = formData.get('slug') as string;
    if (!slug) throw new Error('Missing store slug');

    // Auth check: support both cookie-based and Supabase Auth
    const cookieStore = await cookies();
    const hasCookieAuth = cookieStore.get('auth')?.value === 'true';
    const hasSuperAuth = cookieStore.get('super_auth')?.value === 'true';

    let isAuthorized = hasCookieAuth || hasSuperAuth;

    // Also check Supabase Auth (store owners who log in via email/password)
    if (!isAuthorized) {
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) isAuthorized = true;
        } catch {
            // Supabase auth not available
        }
    }

    if (!isAuthorized) {
        throw new Error('Unauthorized: Please log in first');
    }

    const serviceClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const tenantRepo = getTenantRepository(serviceClient);
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) throw new Error('Store not found');

    // Delete all orders for this tenant
    const { error, count } = await serviceClient
        .from('orders')
        .delete()
        .eq('tenant_id', tenant.id);

    if (error) throw new Error(`Failed to clear orders: ${error.message}`);

    revalidatePath(`/store/${slug}/admin/orders`);
    revalidatePath(`/store/${slug}/admin`);
}
