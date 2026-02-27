// Check what's actually in the product-images Supabase Storage bucket
// and try to match files back to products to restore their URLs
// Run: node scripts/restore-images.js

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
    console.log('=== CHECKING SUPABASE STORAGE: product-images BUCKET ===\n');

    // 1. List all tenant folders in the bucket
    const { data: folders, error: folderErr } = await supabase.storage
        .from('product-images')
        .list('', { limit: 100 });

    if (folderErr) {
        console.error('Error listing bucket:', folderErr);
        return;
    }

    if (!folders || folders.length === 0) {
        console.log('❌ The product-images bucket is EMPTY. No files to recover.');
        return;
    }

    console.log(`Found ${folders.length} items in bucket root:\n`);

    // 2. Get all tenants for mapping
    const { data: tenants } = await supabase.from('tenants').select('id, name, slug');
    
    // 3. Get all products with missing images
    const { data: products } = await supabase
        .from('products')
        .select('id, name, image, tenant_id, category')
        .or('image.is.null,image.eq.');

    console.log(`Products with missing images: ${products?.length || 0}\n`);

    // 4. List files per tenant folder
    const allFiles = [];
    for (const folder of folders) {
        // Each folder is typically a tenant ID
        const tenantId = folder.name;
        const tenant = tenants?.find(t => t.id === tenantId);
        
        const { data: files, error: fileErr } = await supabase.storage
            .from('product-images')
            .list(tenantId, { limit: 100 });

        if (fileErr) {
            console.log(`  Error listing ${tenantId}: ${fileErr.message}`);
            continue;
        }

        if (files && files.length > 0) {
            console.log(`📁 ${tenant?.name || tenantId} (${tenant?.slug || '?'}): ${files.length} image(s)`);
            
            for (const file of files) {
                const filePath = `${tenantId}/${file.name}`;
                const { data: urlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                
                console.log(`   📸 ${file.name} → ${urlData.publicUrl}`);
                allFiles.push({
                    tenantId,
                    tenantName: tenant?.name,
                    tenantSlug: tenant?.slug,
                    fileName: file.name,
                    filePath,
                    publicUrl: urlData.publicUrl,
                    createdAt: file.created_at
                });
            }
        } else {
            // Might be a file itself, not a folder
            if (folder.metadata) {
                console.log(`📸 Root file: ${folder.name}`);
            }
        }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total images in storage: ${allFiles.length}`);

    if (allFiles.length === 0) {
        console.log('No images found in storage to restore.');
        return;
    }

    // 5. Try to auto-assign images to products with missing images
    console.log(`\n=== AUTO-RESTORE ATTEMPT ===\n`);

    // Group files by tenant
    const filesByTenant = {};
    allFiles.forEach(f => {
        if (!filesByTenant[f.tenantId]) filesByTenant[f.tenantId] = [];
        filesByTenant[f.tenantId].push(f);
    });

    for (const [tenantId, files] of Object.entries(filesByTenant)) {
        const missingProducts = products?.filter(p => p.tenant_id === tenantId) || [];
        const tenant = tenants?.find(t => t.id === tenantId);

        if (missingProducts.length === 0) {
            console.log(`✅ ${tenant?.name || tenantId}: No missing images (already has URLs)`);
            continue;
        }

        console.log(`\n🔧 ${tenant?.name || tenantId} (${tenant?.slug}):`);
        console.log(`   ${files.length} image(s) in storage, ${missingProducts.length} product(s) missing images`);

        // Sort both by creation time to try best-effort matching
        files.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        if (files.length >= missingProducts.length) {
            // We have enough images — assign them in order
            for (let i = 0; i < missingProducts.length; i++) {
                const product = missingProducts[i];
                const file = files[i];
                
                console.log(`   📎 "${product.name}" ← ${file.fileName} (${file.publicUrl})`);
                
                // Actually update the product
                const { error: updateErr } = await supabase
                    .from('products')
                    .update({ image: file.publicUrl })
                    .eq('id', product.id);
                
                if (updateErr) {
                    console.log(`   ❌ Failed to update: ${updateErr.message}`);
                } else {
                    console.log(`   ✅ Restored!`);
                }
            }
        } else {
            // Fewer images than products — assign what we can
            console.log(`   ⚠️ Only ${files.length} images for ${missingProducts.length} products — assigning what we can`);
            for (let i = 0; i < files.length; i++) {
                const product = missingProducts[i];
                const file = files[i];
                
                console.log(`   📎 "${product.name}" ← ${file.fileName}`);
                
                const { error: updateErr } = await supabase
                    .from('products')
                    .update({ image: file.publicUrl })
                    .eq('id', product.id);
                
                if (updateErr) {
                    console.log(`   ❌ Failed: ${updateErr.message}`);
                } else {
                    console.log(`   ✅ Restored!`);
                }
            }
            const remaining = missingProducts.length - files.length;
            console.log(`   ⬜ ${remaining} product(s) still need images (no files in storage)`);
        }
    }

    console.log('\n=== DONE ===');
}

main().catch(console.error);
