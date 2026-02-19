const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const s = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// These are verified working Unsplash URLs (using photo IDs that are known to be permanent)
const replacements = [
    {
        slug: 'digital-menu-for-restaurants',
        // Restaurant with tablet/digital ordering 
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    },
    {
        slug: 'how-to-customize-store-branding',
        // Design/branding workspace
        url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80'
    },
    {
        slug: 'simplify-orders-home-food-business',
        // Home cooking/food preparation
        url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80'
    }
];

async function verifyAndUpdate() {
    console.log('Verifying replacement URLs first...\n');

    for (const r of replacements) {
        // Verify URL works
        const resp = await fetch(r.url, { method: 'HEAD', redirect: 'follow' });
        if (!resp.ok) {
            console.log('SKIP ' + r.slug + ' - URL returned ' + resp.status);
            continue;
        }
        console.log('OK   ' + r.slug + ' - URL verified (' + resp.status + ')');

        // Update database
        const { error } = await s
            .from('blog_posts')
            .update({ cover_image: r.url })
            .eq('slug', r.slug);

        if (error) {
            console.log('  DB ERROR: ' + error.message);
        } else {
            console.log('  DB UPDATED successfully');
        }
    }

    console.log('\nDone!');
}

verifyAndUpdate();
