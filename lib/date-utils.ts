/**
 * Timezone-aware date formatting utilities for OrderViaChat.
 * All functions accept an optional IANA timezone string (e.g. 'Africa/Johannesburg')
 * to ensure dates display in the store's local time instead of UTC.
 */

/**
 * Format an ISO date string as a localized date (e.g. "Mar 8, 2026").
 */
export function formatOrderDate(isoDate: string, timezone?: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(timezone ? { timeZone: timezone } : {}),
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format an ISO date string as a localized time (e.g. "02:30 PM").
 */
export function formatOrderTime(isoDate: string, timezone?: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(timezone ? { timeZone: timezone } : {}),
    };
    return date.toLocaleTimeString('en-US', options);
}

/**
 * Format an ISO date string as full date + time (e.g. "Mar 8, 2026, 02:30 PM").
 * Used in invoices and email receipts.
 */
export function formatOrderDateTime(isoDate: string, timezone?: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...(timezone ? { timeZone: timezone } : {}),
    };
    return date.toLocaleString('en-US', options);
}

/**
 * Format an ISO date string as a full date with weekday (e.g. "Sat, Mar 8, 2026").
 * Used in order tracking pages.
 */
export function formatOrderDateFull(isoDate: string, timezone?: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...(timezone ? { timeZone: timezone } : {}),
    };
    return date.toLocaleDateString('en-US', options);
}
