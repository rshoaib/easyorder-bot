'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

/**
 * RecoveryRedirect
 *
 * Mounted globally in the root layout. Catches the recovery flow that
 * lands a user on the site with `#access_token=...&type=recovery&...`
 * tokens in the URL hash, installs the session, and routes them to
 * /reset-password where they can choose a new password.
 *
 * Why this is non-trivial: Supabase's admin generate_link uses the
 * "implicit" flow — tokens come back as URL hash fragments, not as a
 * `?code=` query param. Hashes don't reach the Next.js server, AND
 * @supabase/ssr's createBrowserClient defaults to the "pkce" flow,
 * which means it does NOT auto-parse implicit hashes. So we have to:
 *
 *   1. Read the hash ourselves.
 *   2. Call supabase.auth.setSession({ access_token, refresh_token })
 *      to persist the session to cookies/localStorage.
 *   3. Clear the hash and navigate to /reset-password.
 *
 * Also still listens for PASSWORD_RECOVERY in case any other code path
 * (e.g. the implicit flow being explicitly enabled in future) populates
 * the session before us.
 */
export default function RecoveryRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/reset-password') return;
        const supabase = createClient();
        let cancelled = false;

        const goToReset = () => {
            if (cancelled || pathname === '/reset-password') return;
            router.replace('/reset-password');
        };

        // Listen for PASSWORD_RECOVERY in case Supabase's own hash detection
        // beats us to it (it won't with @supabase/ssr defaults, but the
        // listener is cheap and future-proof).
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') goToReset();
        });

        // Manually consume the implicit-flow recovery hash.
        if (typeof window !== 'undefined' && window.location.hash) {
            const params = new URLSearchParams(window.location.hash.slice(1));
            const type = params.get('type');
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (type === 'recovery' && accessToken && refreshToken) {
                (async () => {
                    try {
                        await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });
                    } catch {
                        // If setSession fails, /reset-password will surface
                        // the "invalid link" state and prompt a fresh
                        // request — fall through to the redirect anyway.
                    }
                    // Clean up the URL so a refresh on /reset-password
                    // doesn't replay the (now-consumed) hash.
                    if (typeof window !== 'undefined') {
                        history.replaceState(null, '', window.location.pathname + window.location.search);
                    }
                    goToReset();
                })();
            }
        }

        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
        };
    }, [router, pathname]);

    return null;
}
