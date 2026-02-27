// Seed 8 additional demo products with AI-generated images
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ARTIFACT_DIR = path.join('C:', 'Users', 'Riz', '.gemini', 'antigravity', 'brain', 'a28a2dfa-8151-4a66-90c0-3500779727f7');

const NEW_PRODUCTS = [
    {
        name: 'BBQ Chicken Pizza',
        price: 15.99,
        category: 'Pizza',
        description: 'Smoky BBQ sauce topped with grilled chicken, red onions, cilantro, and a blend of mozzarella and cheddar.',
        imageFile: 'bbq_chicken_pizza_1772231504315.png',
    },
    {
        name: 'Garlic Bread',
        price: 5.99,
        category: 'Sides',
        description: 'Crispy golden bread with roasted garlic butter, topped with fresh parsley. Perfect as a starter.',
        imageFile: 'garlic_bread_1772231517770.png',
    },
    {
        name: 'Chicken Tenders',
        price: 9.99,
        category: 'Appetizers',
        description: 'Hand-breaded crispy chicken tenders served with honey mustard dipping sauce.',
        imageFile: 'chicken_tenders_1772231534935.png',
    },
    {
        name: 'Chocolate Milkshake',
        price: 6.99,
        category: 'Drinks',
        description: 'Thick and creamy chocolate milkshake topped with whipped cream and chocolate drizzle.',
        imageFile: 'milkshake_trio_1772231548809.png',
    },
    {
        name: 'Grilled Salmon',
        price: 18.99,
        category: 'Mains',
        description: 'Fresh Atlantic salmon fillet grilled to perfection with lemon butter sauce, served with asparagus and roasted potatoes.',
        imageFile: 'grilled_salmon_1772231585534.png',
    },
    {
        name: 'Mozzarella Sticks',
        price: 7.99,
        category: 'Appetizers',
        description: 'Golden-fried mozzarella sticks with a gooey cheese pull, served with marinara sauce.',
        imageFile: 'mozzarella_sticks_1772231602278.png',
    },
    {
        name: 'Iced Caramel Latte',
        price: 5.49,
        category: 'Drinks',
        description: 'Rich espresso over ice with velvety milk and sweet caramel drizzle. Refreshing and smooth.',
        imageFile: 'iced_coffee_1772231618427.png',
    },
    {
        name: 'Tiramisu',
        price: 9.49,
        category: 'Desserts',
        description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers, mascarpone cream, and cocoa powder.',
        imageFile: 'tiramisu_dessert_1772231632275.png',
    },
];

async function main() {
    console.log('=== ADDING 8 MORE DEMO PRODUCTS ===\n');

    // Get demo tenant
    const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', 'demo')
        .single();

    if (!tenant) { console.error('Demo store not found!'); return; }
    console.log(`Demo tenant ID: ${tenant.id}\n`);

    for (const product of NEW_PRODUCTS) {
        const imagePath = path.join(ARTIFACT_DIR, product.imageFile);
        
        if (!fs.existsSync(imagePath)) {
            console.error(`❌ Image not found: ${imagePath}`);
            continue;
        }

        // Upload image to Supabase Storage
        const imageBuffer = fs.readFileSync(imagePath);
        const storagePath = `${tenant.id}/${Date.now()}-${product.imageFile}`;
        
        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(storagePath, imageBuffer, {
                contentType: 'image/png',
                upsert: false,
            });

        if (uploadError) {
            console.error(`❌ Upload failed for ${product.name}:`, uploadError.message);
            continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(storagePath);

        const imageUrl = urlData.publicUrl;

        // Insert product
        const { error: insertError } = await supabase
            .from('products')
            .insert({
                id: crypto.randomUUID(),
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                image: imageUrl,
                tenant_id: tenant.id,
                is_available: true,
                type: 'physical',
            });

        if (insertError) {
            console.error(`❌ Insert failed for ${product.name}:`, insertError.message);
            continue;
        }

        console.log(`✅ ${product.name} — $${product.price} (${product.category})`);
    }

    // Verify total products
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id);

    console.log(`\n📦 Total products in demo store: ${count}`);
    console.log('\n=== DONE ===');
}

main().catch(console.error);
