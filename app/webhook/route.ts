// Webhook is currently disabled for "Web-to-WhatsApp" mode.
// We keep the file to avoid 404s if Meta tries to ping us, but we process nothing.

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const challenge = searchParams.get('hub.challenge');

    // Always respond with challenge to pass verification if needed, or just 200.
    if (mode === 'subscribe' && challenge) {
        return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Webhook Disabled', { status: 200 });
}

export async function POST(req: NextRequest) {
    // Log but do nothing
    console.log('Webhook POST received (Bot mode disabled)');
    return new NextResponse('OK', { status: 200 });
}
