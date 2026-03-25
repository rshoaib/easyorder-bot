import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * POST /api/blog/seed
 * Programmatic blog post insertion using service role key.
 * Protected by a secret token in the Authorization header.
 * 
 * Body: { slug, title, excerpt, date, author, category, content }
 */
export async function POST(request: Request) {
    // Simple auth check — use SUPABASE_SERVICE_ROLE_KEY as the bearer token
    const authHeader = request.headers.get('Authorization');
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceKey) {
        return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${serviceKey}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { slug, title, excerpt, date, author, category, content } = body;

        if (!slug || !title || !content) {
            return NextResponse.json({ error: 'Missing required fields: slug, title, content' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceKey
        );

        // Check if slug already exists
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('slug')
            .eq('slug', slug)
            .single();

        if (existing) {
            return NextResponse.json({ error: `Article with slug "${slug}" already exists` }, { status: 409 });
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .insert({
                slug,
                title,
                excerpt: excerpt || '',
                date: date || new Date().toISOString().split('T')[0],
                author: author || 'OrderViaChat Team',
                category: category || 'Guides',
                content,
                is_published: true,
            })
            .select()
            .single();

        if (error) {
            console.error('Blog seed error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            slug: data.slug,
            url: `https://orderviachat.com/blog/${data.slug}` 
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
