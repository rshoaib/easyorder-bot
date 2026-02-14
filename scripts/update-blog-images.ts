
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const blogImages = [
    { slug: 'how-to-create-your-store-step-by-step', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200' },
    { slug: 'guide-promote-your-store', url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200' },
    { slug: 'guide-adding-products-categories', url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200' },
    { slug: 'whatsapp-business-food-delivery', url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200' },
    { slug: 'digital-menu-for-restaurants', url: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=1200' },
    { slug: 'free-whatsapp-ordering-system', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200' },
    { slug: 'how-to-upsell-whatsapp', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200' },
    { slug: 'hidden-cost-paper-menus', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200' },
    { slug: '10-second-store-ai', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200' },
    { slug: 'from-dm-to-dollar-instagram-sales', url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200' },
    { slug: 'zero-commission-manifesto', url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200' },
    { slug: 'whatsapp-vs-website-conversion-rate', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200' },
    { slug: 'automate-service-appointments-whatsapp', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200' },
    { slug: 'start-instagram-thrift-store', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200' },
    { slug: 'sell-digital-products-whatsapp', url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200' },
    { slug: 'why-cafe-needs-qr-menu', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200' },
    { slug: 'build-menu-seconds-ai-generator', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200' },
    { slug: 'stop-paying-commission-fees', url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200' },
    { slug: 'how-to-customize-store-branding', url: 'https://images.unsplash.com/photo-1493612276216-9c4804700b71?auto=format&fit=crop&w=1200' },
    { slug: 'simplify-orders-home-food-business', url: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=1200' }
];

async function updateImages() {
    console.log('🖼️ Updating blog images using high-quality Unsplash URLs...');

    for (const item of blogImages) {
        const { error } = await supabase
            .from('blog_posts')
            .update({ cover_image: item.url })
            .eq('slug', item.slug);

        if (error) {
            console.error(`❌ Failed to update ${item.slug}:`, error.message);
        } else {
            console.log(`✅ Updated ${item.slug}`);
        }
    }
    console.log('✨ All done!');
}

updateImages();
