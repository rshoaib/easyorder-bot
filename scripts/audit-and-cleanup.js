// Audit all stores for broken images + clean bee-buzz test data
// Run: node scripts/audit-and-cleanup.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('=== FULL IMAGE AUDIT ACROSS ALL STORES ===\n');

    // 1. Get all tenants
    const { data: tenants, error: tenantErr } = await supabase
        .from('tenants')
        .select('id, name, slug');

    if (tenantErr) { console.error('Tenant fetch error:', tenantErr); return; }
    console.log(`Total stores: ${tenants.length}\n`);

    // 2. Get ALL products
    const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('id, name, image, price, category, tenant_id, description');

    if (prodErr) { console.error('Product fetch error:', prodErr); return; }
    console.log(`Total products across all stores: ${products.length}\n`);

    // 3. Categorize image issues
    const blobUrls = products.filter(p => p.image && p.image.startsWith('blob:'));
    const emptyImages = products.filter(p => !p.image || p.image.trim() === '');
    const validImages = products.filter(p => p.image && !p.image.startsWith('blob:') && p.image.startsWith('http'));
    const otherImages = products.filter(p => p.image && !p.image.startsWith('blob:') && !p.image.startsWith('http') && p.image.trim() !== '');

    console.log('--- IMAGE STATUS ---');
    console.log(`✅ Valid URLs (http...):  ${validImages.length}`);
    console.log(`⬜ Empty / No image:     ${emptyImages.length}`);
    console.log(`❌ Blob URLs (broken):   ${blobUrls.length}`);
    console.log(`⚠️  Other (unknown):      ${otherImages.length}`);
    console.log('');

    if (blobUrls.length > 0) {
        console.log('--- PRODUCTS WITH BLOB URLS ---');
        blobUrls.forEach(p => {
            const tenant = tenants.find(t => t.id === p.tenant_id);
            console.log(`  Store: ${tenant?.name || 'unknown'} (${tenant?.slug}) | Product: ${p.name} | ${p.image.substring(0, 50)}...`);
        });
        console.log('');
    }

    if (otherImages.length > 0) {
        console.log('--- PRODUCTS WITH UNEXPECTED IMAGE FORMAT ---');
        otherImages.forEach(p => {
            const tenant = tenants.find(t => t.id === p.tenant_id);
            console.log(`  Store: ${tenant?.name || 'unknown'} (${tenant?.slug}) | Product: ${p.name} | Image: "${p.image}"`);
        });
        console.log('');
    }

    // 4. Per-store breakdown
    console.log('--- PER STORE BREAKDOWN ---');
    for (const tenant of tenants) {
        const storeProducts = products.filter(p => p.tenant_id === tenant.id);
        if (storeProducts.length === 0) continue;

        const withImage = storeProducts.filter(p => p.image && p.image.startsWith('http'));
        const noImage = storeProducts.filter(p => !p.image || p.image.trim() === '' || p.image.startsWith('blob:'));

        console.log(`  ${tenant.name} (/${tenant.slug}): ${storeProducts.length} products, ${withImage.length} with images, ${noImage.length} without`);
    }

    // ==========================================
    // 5. BEE-BUZZ CLEANUP
    // ==========================================
    console.log('\n=== BEE-BUZZ CLEANUP ===\n');

    const beeBuzz = tenants.find(t => t.slug === 'bee-buzz');
    if (!beeBuzz) { console.log('bee-buzz store not found'); return; }

    const bbProducts = products.filter(p => p.tenant_id === beeBuzz.id);
    console.log(`Bee buzz has ${bbProducts.length} products total\n`);

    // Identify junk: name starts with 'fsdf' or price is 0
    const junkProducts = bbProducts.filter(p => 
        p.name.startsWith('fsdf') || 
        p.price === 0 || 
        p.name === 'It combines stylish design with...' ||
        p.name === 'It features a 200MP camera system' ||
        p.name === 'It features a 200MP camera...' ||
        p.name === 'It offers a modern display' ||
        p.name.startsWith('It combines stylish') ||
        p.name.startsWith('It features a') ||
        p.name.startsWith('It offers a')
    );

    // Identify duplicates (same name)
    const nameCounts = {};
    bbProducts.forEach(p => {
        nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
    });
    const duplicateNames = Object.entries(nameCounts).filter(([_, count]) => count > 1);

    console.log(`Junk products (test data / $0 / sentence-names): ${junkProducts.length}`);
    console.log(`Duplicate product names: ${duplicateNames.length}`);
    duplicateNames.forEach(([name, count]) => console.log(`  "${name}" x${count}`));

    // Collect IDs to delete: junk + duplicate extras (keep first of each name)
    const idsToDelete = new Set();

    // Add all junk
    junkProducts.forEach(p => idsToDelete.add(p.id));

    // For duplicates (non-junk), keep the one with the longest description, delete rest
    for (const [name, count] of duplicateNames) {
        const dupes = bbProducts.filter(p => p.name === name && !idsToDelete.has(p.id));
        if (dupes.length <= 1) continue;
        
        // Sort by description length desc, keep the best one
        dupes.sort((a, b) => (b.description || '').length - (a.description || '').length);
        const toDelete = dupes.slice(1); // keep first (best description), delete rest
        toDelete.forEach(p => idsToDelete.add(p.id));
    }

    console.log(`\nTotal products to DELETE from bee-buzz: ${idsToDelete.size}`);
    const idsArray = [...idsToDelete];
    
    // List what we're keeping
    const keeping = bbProducts.filter(p => !idsToDelete.has(p.id));
    console.log(`Products to KEEP: ${keeping.length}`);
    keeping.forEach(p => console.log(`  ✅ ${p.name} — ${p.category} — Rs. ${p.price}`));

    // Actually delete
    if (idsArray.length > 0) {
        console.log(`\nDeleting ${idsArray.length} products...`);
        const { error: delErr } = await supabase
            .from('products')
            .delete()
            .in('id', idsArray);

        if (delErr) {
            console.error('Delete error:', delErr);
        } else {
            console.log(`✅ Deleted ${idsArray.length} junk/duplicate products from bee-buzz`);
        }
    }
}

main().catch(console.error);
