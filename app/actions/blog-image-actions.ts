'use server';

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function createImagePrompt(title: string) {
    return `Create a professional, visually stunning blog cover image for an article titled: "${title}". 
The image should be modern, clean, and suitable for a SaaS business blog about e-commerce and WhatsApp ordering. 
Use a warm, inviting color palette. Photo-realistic style. Wide 16:9 aspect ratio.
Do NOT include any text, watermarks, or logos in the image.`;
}

export async function generateBlogImage(slug: string, title: string) {
    if (!GEMINI_API_KEY) {
        return { success: false, error: 'GEMINI_API_KEY not configured' };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const supabase = await createClient();

        // Generate image with Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: createImagePrompt(title),
            config: {
                responseModalities: ['Image'],
            }
        });

        // Extract image data
        let imageBuffer: Buffer | null = null;
        let mimeType = 'image/png';

        for (const part of response.candidates![0].content!.parts!) {
            if (part.inlineData) {
                imageBuffer = Buffer.from(part.inlineData.data!, 'base64');
                mimeType = part.inlineData.mimeType || 'image/png';
            }
        }

        if (!imageBuffer) {
            return { success: false, error: 'No image generated' };
        }

        // Upload to Supabase storage
        const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
        const filePath = `blog/${slug}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, imageBuffer, {
                contentType: mimeType,
                upsert: true
            });

        if (uploadError) {
            return { success: false, error: 'Upload failed: ' + uploadError.message };
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
            return { success: false, error: 'Database update failed: ' + dbError.message };
        }

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);

        return { success: true, imageUrl: urlData.publicUrl };
    } catch (err: any) {
        console.error('Blog image generation error:', err);
        return { success: false, error: err.message || 'Unknown error' };
    }
}

export async function getAllBlogPosts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, title, cover_image, date, category')
        .eq('is_published', true)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }

    return data || [];
}
