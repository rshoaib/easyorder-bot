import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Simple rate limiter
const uploadLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: NextRequest) {
    try {
        // Rate limit: max 5 uploads per 15 min per IP
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
        const now = Date.now();
        const entry = uploadLimitMap.get(ip);
        if (entry && now < entry.resetTime && entry.count >= 5) {
            return NextResponse.json({ error: 'Too many uploads. Try again later.' }, { status: 429 });
        }
        if (!entry || now > (entry?.resetTime || 0)) {
            uploadLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
        } else {
            entry.count++;
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const tenantId = formData.get('tenantId') as string;

        if (!file || !tenantId) {
            return NextResponse.json({ error: 'Missing file or tenantId' }, { status: 400 });
        }

        // Validate file type (server-side double check)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only images allowed.' }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
        }

        // Use service role key to bypass RLS on storage (server-side only)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, serviceKey);

        const fileExt = file.name.split('.').pop();
        const randomHash = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        const filePath = `${tenantId}/${randomHash}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('payment-slips')
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            console.error('[upload-payment-slip] Storage error:', uploadError.message);
            return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
        }

        // Return short URL instead of full Supabase storage URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orderviachat.com';
        const shortUrl = `${siteUrl}/slip/${filePath}`;

        return NextResponse.json({ success: true, url: shortUrl });
    } catch (error: any) {
        console.error('[upload-payment-slip] Error:', error?.message);
        return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
    }
}
