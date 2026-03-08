'use client';

import { useEffect } from 'react';
import { autoDetectTimezone } from '@/app/actions/tenant-actions';

/**
 * Invisible component that silently auto-detects the store owner's timezone
 * from their browser and saves it if not already set.
 * 
 * Zero UI, zero clicks — just drop it in the admin dashboard.
 */
export default function TimezoneAutoDetect({ tenantId, slug, currentTimezone }: {
    tenantId: string;
    slug: string;
    currentTimezone?: string;
}) {
    useEffect(() => {
        // Already set — don't override
        if (currentTimezone) return;

        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz && tz !== 'UTC') {
                autoDetectTimezone(tenantId, slug, tz);
            }
        } catch {
            // Browser doesn't support — skip silently
        }
    }, [tenantId, slug, currentTimezone]);

    return null; // Invisible — renders nothing
}
