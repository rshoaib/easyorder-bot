import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/delete-stores
 * Body: { slugs: ["tasty-bites", "bee-buzz"] }
 * Deletes tenants and ALL related data (products, orders, promos, integrations, social_posts).
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

    const results: any[] = [];

    for (const slug of slugs) {
        const { data: tenant } = await supabaseAdmin
            .from('tenants')
            .select('id, name, slug')
            .eq('slug', slug)
            .single();

        if (!tenant) {
            results.push({ slug, status: 'NOT FOUND' });
            continue;
        }

        const errors: string[] = [];

        // Delete ALL dependent tables first (order matters for FK constraints)
        const tables = ['social_posts', 'integrations', 'promo_codes', 'order_items', 'orders', 'products'];
        const counts: Record<string, number> = {};

        for (const table of tables) {
            const { count, error } = await supabaseAdmin
                .from(table)
                .delete({ count: 'exact' })
                .eq('tenant_id', tenant.id);

            counts[table] = count || 0;
            if (error) errors.push(`${table}: ${error.message}`);
        }

        // Now delete the tenant itself
        const { error: tenantError } = await supabaseAdmin
            .from('tenants')
            .delete()
            .eq('id', tenant.id);

        if (tenantError) {
            errors.push(`tenants: ${tenantError.message}`);
        }

        results.push({
            slug,
            name: tenant.name,
            status: tenantError ? 'FAILED' : 'DELETED',
            deletedCounts: counts,
            errors: errors.length > 0 ? errors : undefined
        });
    }

    return NextResponse.json({ results });
}
