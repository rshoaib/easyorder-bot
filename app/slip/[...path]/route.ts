import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Short redirect: /slip/tenantId/filename.ext → full Supabase storage URL
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    
    if (!path || path.length < 2) {
        return NextResponse.json({ error: 'Invalid slip URL' }, { status: 404 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const fullPath = path.join('/');
    const storageUrl = `${supabaseUrl}/storage/v1/object/public/payment-slips/${fullPath}`;

    return NextResponse.redirect(storageUrl, 302);
}
