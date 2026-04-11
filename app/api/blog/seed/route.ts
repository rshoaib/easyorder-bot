import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

/**
 * POST /api/blog/seed
 * Programmatic blog post insertion using service role key.
 * Protected by a secret token in the Authorization header.
 *
 * Body: { slug, title, excerpt, date, author, category, cover_image?, content }
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
        const { slug, title, excerpt, date, author, category, cover_image, content } = body;

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

        // Auto-generate cover image if not provided
        let coverImageUrl = cover_image || null;
        if (!coverImageUrl) {
            coverImageUrl = await generateCoverImage(slug, title, supabase);
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
                cover_image: coverImageUrl,
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
            url: `https://orderviachat.com/blog/${data.slug}`,
            coverImage: coverImageUrl,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

async function generateCoverImage(
    slug: string,
    title: string,
    supabase: any
): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn('GEMINI_API_KEY not configured — skipping cover image generation');
        return null;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Create a professional, visually stunning blog cover image for an article titled: "${title}".
The image should be modern, clean, and suitable for a SaaS business blog about e-commerce and WhatsApp ordering.
Use a warm, inviting color palette. Photo-realistic style. Wide 16:9 aspect ratio.
Do NOT include any text, watermarks, or logos in the image.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: prompt,
            config: { responseModalities: ['Image'] },
        });

        let imageBuffer: Buffer | null = null;
        let mimeType = 'image/png';

        for (const part of response.candidates![0].content!.parts!) {
            if (part.inlineData) {
                imageBuffer = Buffer.from(part.inlineData.data!, 'base64');
                mimeType = part.inlineData.mimeType || 'image/png';
            }
        }

        if (!imageBuffer) return null;

        const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
        const filePath = `blog/${slug}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, imageBuffer, { contentType: mimeType, upsert: true });

        if (uploadError) {
            console.error('Cover image upload failed:', uploadError.message);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    } catch (err) {
        console.error('Cover image generation failed:', err);
        return null;
    }
}
