import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getTenantRepository } from '@/lib/repository';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Missing store slug' }, { status: 400 });
        }

        // Auth check: support both cookie-based and Supabase Auth
        const cookieStore = await cookies();
        const hasCookieAuth = cookieStore.get('auth')?.value === 'true';
        const hasSuperAuth = cookieStore.get('super_auth')?.value === 'true';

        let isAuthorized = hasCookieAuth || hasSuperAuth;

        // Also check Supabase Auth
        if (!isAuthorized) {
            try {
                const supabase = await createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) isAuthorized = true;
            } catch {
                // ignore
            }
        }

        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const serviceClient = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const tenantRepo = getTenantRepository(serviceClient);
        const tenant = await tenantRepo.getTenantBySlug(slug);

        if (!tenant) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // Delete all orders for this tenant
        const { error } = await serviceClient
            .from('orders')
            .delete()
            .eq('tenant_id', tenant.id);

        if (error) {
            return NextResponse.json({ error: `Failed: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'All orders cleared' });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
    }
}
