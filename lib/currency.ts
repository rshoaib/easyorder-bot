// Currency symbols map — used across storefront, admin, and emails
const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    CAD: 'CA$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    PKR: 'Rs.',
    MYR: 'RM',
    AED: 'AED',
    SAR: 'SAR',
    EGP: 'E£',
    MRU: 'UM',
    MUR: '₨',
    ZAR: 'R',
    NGN: '₦',
};

/**
 * Get the display symbol for a currency code.
 * Falls back to the code itself if unknown.
 */
export function getCurrencySymbol(currency?: string): string {
    if (!currency) return '$';
    return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
}

/**
 * Format a price with currency symbol.
 * Example: formatPrice(12.5, 'PKR') => "Rs. 12.50"
 */
export function formatPrice(amount: number, currency?: string): string {
    const symbol = getCurrencySymbol(currency);
    return `${symbol} ${amount.toFixed(2)}`;
}
