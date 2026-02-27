// Fetch store owners' WhatsApp numbers (affected stores with missing images)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
    // Get all tenants with their owner phone numbers
    const { data: tenants, error } = await supabase
        .from('tenants')
        .select('id, name, slug, owner_phone, user_id')
        .order('name');

    if (error) { console.error(error); return; }

    // Get products to identify affected stores
    const { data: products } = await supabase
        .from('products')
        .select('tenant_id, image');

    // Get user emails via auth (if service role key available)
    let users = [];
    try {
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        users = authUsers?.users || [];
    } catch (e) {
        // No service role key, skip
    }

    console.log('=== AFFECTED STORE OWNERS (missing images) ===\n');
    console.log('Store Name | Slug | WhatsApp | Email');
    console.log('-'.repeat(80));

    const affected = [];
    for (const t of tenants) {
        const storeProducts = products?.filter(p => p.tenant_id === t.id) || [];
        const missing = storeProducts.filter(p => !p.image || p.image.trim() === '');
        
        if (missing.length > 0 && !t.slug?.includes('deleted') && !t.slug?.includes('test') && !t.slug?.includes('demo')) {
            const user = users.find(u => u.id === t.user_id);
            affected.push({
                name: t.name,
                slug: t.slug,
                phone: t.owner_phone || 'N/A',
                email: user?.email || 'N/A',
                total: storeProducts.length,
                missing: missing.length
            });
            console.log(`${t.name} | /${t.slug} | ${t.owner_phone || 'N/A'} | ${user?.email || 'N/A'} | ${missing.length}/${storeProducts.length} missing`);
        }
    }

    console.log('\n=== ALL ACTIVE STORE OWNERS ===\n');
    console.log('Store Name | Slug | WhatsApp | Email | Products');
    console.log('-'.repeat(90));

    for (const t of tenants) {
        if (t.slug?.includes('deleted')) continue; // skip deleted stores
        const storeProducts = products?.filter(p => p.tenant_id === t.id) || [];
        if (storeProducts.length === 0) continue; // skip empty stores
        const user = users.find(u => u.id === t.user_id);
        console.log(`${t.name} | /${t.slug} | ${t.owner_phone || 'N/A'} | ${user?.email || 'N/A'} | ${storeProducts.length} products`);
    }
}

main().catch(console.error);
