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
 * landing. The Supabase JS client *does* parse the hash on the client and
 * fires a PASSWORD_RECOVERY event, which we listen for here.
 *
 * We must wait for that event (or for getSession() to have parsed the hash)
 * before navigating away — otherwise router.replace strips the hash before
 * the client has stored the session, and the user lands on /reset-password
 * with no session and an "expired" message.
 */
export default function RecoveryRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/reset-password') return;

        const supabase = createClient();
        let unsub: (() => void) | undefined;
        let cancelled = false;

        const goToReset = () => {
            if (cancelled || pathname === '/reset-password') return;
            router.replace('/reset-password');
        };

        // 1) Subscribe to PASSWORD_RECOVERY events. Supabase's browser client
        //    parses the URL hash on init and fires this event when it finds
        //    `type=recovery`.
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') goToReset();
        });
        unsub = () => sub.subscription.unsubscribe();

        // 2) Belt-and-suspenders: if the page was loaded directly with a
        //    recovery hash, ensure the hash is parsed (getSession() forces
        //    detectSessionInUrl). After getSession resolves, the session
        //    has been persisted to storage, so we can safely redirect.
        if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
            (async () => {
                await supabase.auth.getSession().catch(() => undefined);
                goToReset();
            })();
        }

        return () => {
            cancelled = true;
            unsub?.();
        };
    }, [router, pathname]);

    return null;
}
