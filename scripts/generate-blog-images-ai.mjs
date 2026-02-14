/**
 * Generate AI Blog Cover Images using Gemini API
 * 
 * Usage: node scripts/generate-blog-images-ai.mjs [slug]
 * 
 * - If slug provided: generates image for that specific post only
 * - If no slug: generates images for all posts with broken/missing images
 * 
 * Requires: GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing env vars: GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Models to try in order of preference
const IMAGE_MODELS = [
    'gemini-2.5-flash-image',
    'imagen-4.0-fast-generate-001',
    'imagen-4.0-generate-001',
];

// Generate a prompt based on the blog post title
function createImagePrompt(title) {
    return `Create a professional, visually stunning blog cover image for an article titled: "${title}". 
The image should be modern, clean, and suitable for a SaaS business blog about e-commerce and WhatsApp ordering. 
Use a warm, inviting color palette. Photo-realistic style. Wide 16:9 aspect ratio.
Do NOT include any text, watermarks, or logos in the image.`;
}

// Try Gemini native image generation (gemini-2.5-flash-image)
async function generateWithGemini(title) {
    console.log(`  🎨 Trying gemini-2.5-flash-image...`);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: createImagePrompt(title),
        config: {
            responseModalities: ['Image'],
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const imageData = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const buffer = Buffer.from(imageData, 'base64');
            console.log(`  ✅ Generated ${(buffer.length / 1024).toFixed(0)}KB image (${mimeType})`);
            return { buffer, mimeType };
        }
    }
    throw new Error('No image data in Gemini response');
}

// Try Imagen 4.0 via REST API
async function generateWithImagen(title) {
    console.log(`  🎨 Trying imagen-4.0-fast-generate-001 via REST...`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${GEMINI_API_KEY}`;
    
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            instances: [{
                prompt: createImagePrompt(title)
            }],
            parameters: {
                sampleCount: 1,
                aspectRatio: '16:9'
            }
        })
    });

    if (!resp.ok) {
        const errBody = await resp.text();
        throw new Error(`Imagen API ${resp.status}: ${errBody.substring(0, 200)}`);
    }

    const data = await resp.json();
    if (data.predictions && data.predictions.length > 0) {
        const prediction = data.predictions[0];
        const imageData = prediction.bytesBase64Encoded;
        const mimeType = prediction.mimeType || 'image/png';
        const buffer = Buffer.from(imageData, 'base64');
        console.log(`  ✅ Generated ${(buffer.length / 1024).toFixed(0)}KB image (${mimeType})`);
        return { buffer, mimeType };
    }

    throw new Error('No image data in Imagen response');
}

// Try multiple models with fallback
async function generateImage(title) {
    // Try Gemini first
    try {
        return await generateWithGemini(title);
    } catch (err) {
        console.log(`  ⚠️  Gemini failed: ${err.message?.substring(0, 80)}`);
    }

    // Fall back to Imagen
    try {
        return await generateWithImagen(title);
    } catch (err) {
        console.log(`  ⚠️  Imagen failed: ${err.message?.substring(0, 80)}`);
    }

    throw new Error('All image generation models failed');
}

async function uploadToSupabase(slug, buffer, mimeType) {
    const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
    const filePath = `blog/${slug}.${ext}`;

    console.log(`  📤 Uploading to Supabase storage: ${filePath}`);

    const { error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true
        });

    if (error) {
        throw new Error('Upload failed: ' + error.message);
    }

    const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

    console.log(`  ✅ Uploaded: ${data.publicUrl}`);
    return data.publicUrl;
}

async function updateDatabase(slug, imageUrl) {
    const { error } = await supabase
        .from('blog_posts')
        .update({ cover_image: imageUrl })
        .eq('slug', slug);

    if (error) {
        throw new Error('DB update failed: ' + error.message);
    }
    console.log(`  ✅ Database updated`);
}

async function ensureBucketExists() {
    const { error } = await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

    if (error && !error.message.includes('already exists')) {
        console.error('⚠️  Could not create bucket:', error.message);
    } else {
        console.log('✅ blog-images bucket ready');
    }
}

async function main() {
    const targetSlug = process.argv[2];

    console.log('🚀 AI Blog Image Generator\n');
    await ensureBucketExists();

    let query = supabase
        .from('blog_posts')
        .select('slug, title, cover_image')
        .eq('is_published', true);

    if (targetSlug) {
        query = query.eq('slug', targetSlug);
    }

    const { data: posts, error } = await query.order('date', { ascending: false });

    if (error) {
        console.error('❌ Failed to get posts:', error.message);
        process.exit(1);
    }

    // When targeting a specific slug, always regenerate. Otherwise, only process broken ones.
    let postsToProcess = posts;
    if (!targetSlug) {
        console.log(`\n📋 Checking ${posts.length} posts for broken images...\n`);
        postsToProcess = [];
        for (const p of posts) {
            if (!p.cover_image) {
                postsToProcess.push(p);
                continue;
            }
            try {
                const resp = await fetch(p.cover_image, { method: 'HEAD', redirect: 'follow' });
                if (!resp.ok) postsToProcess.push(p);
            } catch {
                postsToProcess.push(p);
            }
        }
    }

    if (postsToProcess.length === 0) {
        console.log('🎉 All blog posts have working images! Nothing to do.');
        return;
    }

    console.log(`\n🖼️  Generating images for ${postsToProcess.length} post(s)...\n`);

    let success = 0;
    let failed = 0;

    for (const post of postsToProcess) {
        console.log(`\n📝 [${success + failed + 1}/${postsToProcess.length}] "${post.title}" (${post.slug})`);
        try {
            const { buffer, mimeType } = await generateImage(post.title);
            const imageUrl = await uploadToSupabase(post.slug, buffer, mimeType);
            await updateDatabase(post.slug, imageUrl);
            success++;

            if (postsToProcess.indexOf(post) < postsToProcess.length - 1) {
                console.log('  ⏳ Waiting 5s before next generation...');
                await new Promise(r => setTimeout(r, 5000));
            }
        } catch (err) {
            console.error(`  ❌ Failed: ${err.message}`);
            failed++;
        }
    }

    console.log('\n\n=== SUMMARY ===');
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed:  ${failed}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
