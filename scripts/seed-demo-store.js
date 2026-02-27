// Seed a full demo store with products and upload images to Supabase Storage
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DEMO_STORE = {
    slug: 'demo',
    name: 'Pizza Palace 🍕',
    ownerPhone: '',
    storeType: 'restaurant',
    currency: 'USD',
    isOpen: true,
};

const PRODUCTS = [
    {
        name: 'Margherita Pizza',
        price: 12.99,
        category: 'Pizza',
        description: 'Classic Italian pizza with fresh mozzarella, San Marzano tomato sauce, and fragrant basil leaves on a crispy thin crust.',
        image_file: 'margherita_pizza.png',
        type: 'physical',
    },
    {
        name: 'Classic Smash Burger',
        price: 10.99,
        category: 'Burgers',
        description: 'Juicy double-smashed beef patty with melted cheddar, crisp lettuce, fresh tomato, and house-made pickles on a toasted brioche bun.',
        image_file: 'classic_burger.png',
        type: 'physical',
    },
    {
        name: 'Pasta Carbonara',
        price: 14.50,
        category: 'Pasta',
        description: 'Creamy spaghetti carbonara with crispy pancetta, egg yolk, aged parmesan, and a generous crack of black pepper.',
        image_file: 'pasta_carbonara.png',
        type: 'physical',
    },
    {
        name: 'Caesar Salad',
        price: 9.99,
        category: 'Salads',
        description: 'Crisp romaine lettuce, crunchy garlic croutons, shaved parmesan, and grilled chicken strips tossed in our signature Caesar dressing.',
        image_file: 'caesar_salad.png',
        type: 'physical',
    },
    {
        name: 'Buffalo Wings',
        price: 11.99,
        category: 'Appetizers',
        description: 'Crispy fried chicken wings tossed in spicy buffalo sauce, served with cool blue cheese dip and crunchy celery sticks.',
        image_file: 'chicken_wings.png',
        type: 'physical',
    },
    {
        name: 'Loaded Cheese Fries',
        price: 7.99,
        category: 'Sides',
        description: 'Golden crispy fries loaded with melted cheddar, smoky bacon bits, and sliced jalapeños. The ultimate comfort side.',
        image_file: 'loaded_fries.png',
        type: 'physical',
    },
    {
        name: 'Chocolate Lava Cake',
        price: 8.99,
        category: 'Desserts',
        description: 'Warm chocolate cake with a gooey molten center, served with a scoop of vanilla bean ice cream and fresh raspberries.',
        image_file: 'chocolate_cake.png',
        type: 'physical',
    },
    {
        name: 'Fresh Lemonade',
        price: 4.99,
        category: 'Drinks',
        description: 'Freshly squeezed lemonade with a hint of mint, served ice-cold. The perfect refreshing companion to any meal.',
        image_file: 'fresh_lemonade.png',
        type: 'physical',
    },
];

async function uploadImage(filePath, tenantId) {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1);
    const fileName = `${tenantId}/${Math.random().toString(36).substring(2)}.${ext}`;

    const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, fileBuffer, {
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
            upsert: true,
        });

    if (error) {
        console.error(`   ❌ Upload failed for ${path.basename(filePath)}: ${error.message}`);
        return null;
    }

    const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

    return data.publicUrl;
}

async function main() {
    console.log('=== SEEDING DEMO STORE ===\n');

    // 1. Check if demo store already exists
    const { data: existing } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', DEMO_STORE.slug)
        .single();

    let tenantId;

    if (existing) {
        console.log('Demo store already exists, reusing...');
        tenantId = existing.id;
    } else {
        // Create tenant
        const { data: tenant, error: tenantErr } = await supabase
            .from('tenants')
            .insert({
                name: DEMO_STORE.name,
                slug: DEMO_STORE.slug,
                owner_phone: DEMO_STORE.ownerPhone,
                store_type: DEMO_STORE.storeType,
                currency: DEMO_STORE.currency,
                is_open: DEMO_STORE.isOpen,
            })
            .select()
            .single();

        if (tenantErr) {
            console.error('Failed to create tenant:', tenantErr);
            return;
        }

        tenantId = tenant.id;
        console.log(`✅ Created store: ${DEMO_STORE.name} (ID: ${tenantId})\n`);
    }

    // 2. Delete existing products for clean slate
    await supabase.from('products').delete().eq('tenant_id', tenantId);
    console.log('Cleared existing products\n');

    // 3. Create products and upload images
    const imagesDir = path.join(__dirname, '..', 'public', 'demo-images');

    for (const product of PRODUCTS) {
        console.log(`📦 ${product.name}...`);

        // Upload image
        let imageUrl = '';
        const imagePath = path.join(imagesDir, product.image_file);
        if (fs.existsSync(imagePath)) {
            const url = await uploadImage(imagePath, tenantId);
            if (url) {
                imageUrl = url;
                console.log(`   📸 Image uploaded`);
            }
        } else {
            console.log(`   ⚠️ Image file not found: ${product.image_file}`);
        }

        // Insert product
        const { error: prodErr } = await supabase
            .from('products')
            .insert({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                tenant_id: tenantId,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                image: imageUrl,
                is_available: true,
                type: product.type,
            });

        if (prodErr) {
            console.log(`   ❌ Insert failed: ${prodErr.message}`);
        } else {
            console.log(`   ✅ Product created`);
        }

        // Small delay to ensure unique IDs
        await new Promise(r => setTimeout(r, 50));
    }

    console.log(`\n=== DONE! Visit /store/${DEMO_STORE.slug} ===`);
}

main().catch(console.error);
