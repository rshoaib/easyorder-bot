const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const s = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
    const { data, error } = await s
        .from('blog_posts')
        .select('slug, title, cover_image')
        .eq('is_published', true)
        .order('date', { ascending: false });

    if (error) { console.error(error); return; }

    let lines = [];
    let broken = [];

    for (const p of data) {
        if (!p.cover_image) {
            broken.push(p.slug + ' | ' + p.title);
            lines.push('MISSING | ' + p.slug);
            continue;
        }

        try {
            const resp = await fetch(p.cover_image, { method: 'HEAD', redirect: 'follow' });
            if (resp.ok) {
                lines.push('OK ' + resp.status + ' | ' + p.slug);
            } else {
                broken.push(p.slug + ' | ' + p.title);
                lines.push('BROKEN ' + resp.status + ' | ' + p.slug);
            }
        } catch (e) {
            broken.push(p.slug + ' | ' + p.title);
            lines.push('ERROR | ' + p.slug);
        }
    }

    lines.push('');
    lines.push('BROKEN COUNT: ' + broken.length);
    broken.forEach(b => lines.push('  ' + b));

    fs.writeFileSync('image_results.txt', lines.join('\n'), 'utf8');
    console.log('Done. Check image_results.txt');
})();
