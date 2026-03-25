import { NextRequest, NextResponse } from 'next/server';
import { uploadPaymentSlip } from '@/lib/storage';

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

        const publicUrl = await uploadPaymentSlip(file, tenantId);

        if (!publicUrl) {
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error('[upload-payment-slip] Error:', error?.message);
        return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
    }
}
