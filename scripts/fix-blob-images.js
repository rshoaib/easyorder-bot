// Quick script to clean up blob: URLs from product images
// Run: node scripts/fix-blob-images.js

const { createClient } = require('@supabase/supabase-js');

// Load env from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Find all products with blob: image URLs
    const { data: blobProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name, image, tenant_id')
        .like('image', 'blob:%');

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        process.exit(1);
    }

    console.log(`Found ${blobProducts.length} products with blob: URLs:`);
    blobProducts.forEach(p => console.log(`  - [${p.tenant_id}] ${p.name}: ${p.image?.substring(0, 60)}...`));

    if (blobProducts.length === 0) {
        console.log('No broken images found. All good!');
        return;
    }

    // Clear the broken blob URLs (set to empty string so fallback placeholder kicks in)
    const { data, error: updateError } = await supabase
        .from('products')
        .update({ image: '' })
        .like('image', 'blob:%')
        .select('id, name');

    if (updateError) {
        console.error('Error updating:', updateError);
        process.exit(1);
    }

    console.log(`\n✅ Cleaned ${data.length} products. They will now show the placeholder image.`);
    console.log('Store owners can re-upload images from their admin panel.');
}

main();
