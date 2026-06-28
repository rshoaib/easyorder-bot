import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { sendClosureNotice } from '@/lib/email';
import { DEMO_STORE_SLUG } from '@/lib/config';

/**
 * POST /api/admin/notify-closure
 *
 * Emails every store owner the permanent-closure notice. One-shot operation
 * for shutting the platform down. Authorized via the super-admin cookie or the
 * operator account (matching CLEANUP routes), so it can't be triggered publicly.
 *
 * Optional body: { dryRun: true } — returns the recipient list without sending.
 */
export async function POST(request: Request) {
    const supabase = await createClient();
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';
    if (!hasSuperAuth) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || (user.email !== 'segmentbi@gmail.com' && user.email !== 'segmentibi@gmail.com')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    let dryRun = false;
    try {
        const body = await request.json();
        dryRun = !!body?.dryRun;
    } catch { /* no body provided */ }

    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: tenants, error } = await supabaseAdmin
        .from('tenants')
        .select('slug, name, email');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // De-duplicate by email, skip the public demo store and empty addresses.
    const seen = new Set<string>();
    const recipients = (tenants || []).filter((t: any) => {
        if (!t.email || t.slug === DEMO_STORE_SLUG) return false;
        const key = t.email.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    if (dryRun) {
        return NextResponse.json({
            dryRun: true,
            count: recipients.length,
            recipients: recipients.map((t: any) => ({ email: t.email, name: t.name, slug: t.slug })),
        });
    }

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json(
            { error: 'RESEND_API_KEY not configured — cannot send emails.', wouldNotify: recipients.length },
            { status: 503 }
        );
    }

    const results: { email: string; status: 'sent' | 'failed' }[] = [];
    for (const t of recipients) {
        try {
            await sendClosureNotice(t.email, t.name);
            results.push({ email: t.email, status: 'sent' });
        } catch {
            results.push({ email: t.email, status: 'failed' });
        }
    }

    return NextResponse.json({
        total: recipients.length,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length,
        results,
    });
}
