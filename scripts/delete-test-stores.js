const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SLUGS_TO_DELETE = ['imtiazstore', 'alfatah', 'qiblatime'];

async function main() {
    for (const slug of SLUGS_TO_DELETE) {
        const { data: tenants } = await supabase.from('tenants').select('id, name, slug').ilike('slug', slug);
        if (!tenants || tenants.length === 0) { console.log(`⬜ /${slug} — not found`); continue; }
        const tenant = tenants[0];
        console.log(`🗑️  ${tenant.name} (/${tenant.slug})`);
        const { data: p } = await supabase.from('products').delete().eq('tenant_id', tenant.id).select('id');
        const { data: o } = await supabase.from('orders').delete().eq('tenant_id', tenant.id).select('id');
        await supabase.from('promo_codes').delete().eq('tenant_id', tenant.id);
        await supabase.from('social_posts').delete().eq('tenant_id', tenant.id);
        await supabase.from('integrations').delete().eq('tenant_id', tenant.id);
        const { error } = await supabase.from('tenants').delete().eq('id', tenant.id);
        console.log(`   ${error ? '❌ ' + error.message : '✅ Deleted!'} (${p?.length || 0} products, ${o?.length || 0} orders)`);
    }
}
main().catch(console.error);
