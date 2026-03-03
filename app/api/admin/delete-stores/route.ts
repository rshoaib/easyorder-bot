import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/delete-stores
 * Body: { slugs: ["tasty-bites", "bee-buzz"] }
 * Deletes tenants and all related data (products, orders).
 */
export async function POST(request: Request) {
    const supabase = await createClient();
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';
    if (!hasSuperAuth) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== 'segmentibi@gmail.com') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { slugs } = await request.json();
    if (!slugs || !Array.isArray(slugs)) {
        return NextResponse.json({ error: 'slugs array required' }, { status: 400 });
    }

    const results: { slug: string; status: string; deleted?: any }[] = [];

    for (const slug of slugs) {
        // Find tenant
        const { data: tenant } = await supabaseAdmin
            .from('tenants')
            .select('id, name, slug')
            .eq('slug', slug)
            .single();

        if (!tenant) {
            results.push({ slug, status: 'NOT FOUND' });
            continue;
        }

        // Delete products
        const { count: prodCount } = await supabaseAdmin
            .from('products')
            .delete({ count: 'exact' })
            .eq('tenant_id', tenant.id);

        // Delete orders
        const { count: orderCount } = await supabaseAdmin
            .from('orders')
            .delete({ count: 'exact' })
            .eq('tenant_id', tenant.id);

        // Delete tenant
        await supabaseAdmin
            .from('tenants')
            .delete()
            .eq('id', tenant.id);

        results.push({
            slug,
            status: 'DELETED',
            deleted: { name: tenant.name, products: prodCount, orders: orderCount }
        });
    }

    return NextResponse.json({ results });
}
