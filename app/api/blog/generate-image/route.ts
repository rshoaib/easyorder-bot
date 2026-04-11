import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

/**
 * POST /api/blog/generate-image
 * Generates a cover image for an existing blog post that lacks one.
 * Protected by service role key in the Authorization header.
 *
 * Body: { slug }
 */
export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization');
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
        return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${serviceKey}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    try {
        const { slug } = await request.json();
        if (!slug) {
            return NextResponse.json({ error: 'Missing required field: slug' }, { status: 400 });
        }

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

        // Fetch the post
        const { data: post, error: fetchError } = await supabase
            .from('blog_posts')
            .select('slug, title, cover_image')
            .eq('slug', slug)
            .single();

        if (fetchError || !post) {
            return NextResponse.json({ error: `Post "${slug}" not found` }, { status: 404 });
        }

        if (post.cover_image) {
            return NextResponse.json({ success: true, imageUrl: post.cover_image, message: 'Already has cover image' });
        }

        // Generate image with Gemini
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Create a professional, visually stunning blog cover image for an article titled: "${post.title}".
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

        if (!imageBuffer) {
            return NextResponse.json({ error: 'No image generated' }, { status: 500 });
        }

        // Upload to Supabase storage
        const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
        const filePath = `blog/${slug}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, imageBuffer, { contentType: mimeType, upsert: true });

        if (uploadError) {
            return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
        }

        const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        // Update database
        const { error: dbError } = await supabase
            .from('blog_posts')
            .update({ cover_image: urlData.publicUrl })
            .eq('slug', slug);

        if (dbError) {
            return NextResponse.json({ error: 'Database update failed: ' + dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, imageUrl: urlData.publicUrl });
    } catch (err: any) {
        console.error('Blog image generation error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
