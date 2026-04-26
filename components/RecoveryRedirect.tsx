'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * RecoveryRedirect
 *
 * Mounted globally in the root layout. Watches for Supabase auth events
 * and redirects the user to /reset-password whenever a password-recovery
 * session lands.
 *
 * Why this exists: Supabase's recovery flow with /admin/generate_link uses
 * the "implicit" flow — the access/refresh tokens are appended to the URL
 * as a hash (`#access_token=...&type=recovery&...`). Hash fragments don't
 * reach the Next.js server, so server-side params can't detect a recovery
 * landing. The Supabase JS client *does* see the hash on the client,
 * parses it into a session, and emits a `PASSWORD_RECOVERY` event — that's
 * what we listen for here.
 *
 * We also do an opportunistic check on mount in case the event fires
 * before this component subscribes (e.g. on a hard reload of a URL that
 * still has the hash).
 */
export default function RecoveryRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Avoid loops if we're already on the reset page.
        if (pathname === '/reset-password') return;

        const supabase = createClient();

        // Opportunistic synchronous check: if the URL still carries
        // #type=recovery on initial load, jump immediately.
        if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
            router.replace('/reset-password');
            return;
        }

        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                router.replace('/reset-password');
            }
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, [router, pathname]);

    return null;
}
