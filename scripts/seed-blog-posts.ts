/**
 * Seed Blog Posts to Supabase
 * 
 * Usage: npx tsx scripts/seed-blog-posts.ts
 * 
 * This reads all hardcoded posts from lib/blog.ts and inserts them into
 * the Supabase blog_posts table. Existing posts (by slug) are skipped.
 * 
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 * The service role key bypasses RLS for INSERT operations.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load env vars from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing env vars. Need:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    console.error('');
    console.error('Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.');
    console.error('Find it in: Supabase Dashboard > Settings > API > service_role key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// All blog posts data - extracted from lib/blog.ts
// We import programmatically to avoid circular deps
async function getBlogPosts() {
    // Dynamic import to get the hardcoded posts
    const blogModule = await import('../lib/blog');
    // Access the raw blogPosts array (the hardcoded fallback)
    return (blogModule as any).blogPosts || [];
}

interface BlogPostData {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    coverImage?: string;
    content: string;
}

async function seedBlogPosts() {
    console.log('🚀 Starting blog posts seed...\n');

    const posts: BlogPostData[] = await getBlogPosts();

    if (posts.length === 0) {
        console.error('❌ No posts found in lib/blog.ts');
        process.exit(1);
    }

    console.log(`📝 Found ${posts.length} posts to seed\n`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const post of posts) {
        // Check if already exists
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('slug')
            .eq('slug', post.slug)
            .single();

        if (existing) {
            console.log(`⏭️  Skipped (exists): ${post.slug}`);
            skipped++;
            continue;
        }

        const { error } = await supabase
            .from('blog_posts')
            .insert({
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                date: post.date,
                author: post.author,
                category: post.category,
                cover_image: post.coverImage || null,
                content: post.content,
                is_published: true,
            });

        if (error) {
            console.error(`❌ Error inserting "${post.slug}":`, error.message);
            errors++;
        } else {
            console.log(`✅ Inserted: ${post.slug}`);
            inserted++;
        }
    }

    console.log('\n--- Summary ---');
    console.log(`✅ Inserted: ${inserted}`);
    console.log(`⏭️  Skipped:  ${skipped}`);
    console.log(`❌ Errors:   ${errors}`);
    console.log(`📊 Total:    ${posts.length}`);
}

seedBlogPosts().catch(console.error);
