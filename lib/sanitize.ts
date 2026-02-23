/**
 * Input sanitization utilities for preventing XSS and data integrity issues.
 */

/** Strip HTML tags and trim whitespace from a string. */
export function sanitizeText(input: string | undefined | null): string {
    if (!input) return '';
    return input
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .replace(/[<>]/g, '')    // Remove any remaining angle brackets
        .trim();
}

/** Sanitize and validate a product name (max 200 chars). */
export function sanitizeProductName(name: string): string {
    const cleaned = sanitizeText(name);
    if (cleaned.length === 0) throw new Error('Product name is required');
    if (cleaned.length > 200) throw new Error('Product name is too long (max 200 characters)');
    return cleaned;
}

/** Sanitize and validate a product description (max 1000 chars). */
export function sanitizeDescription(desc: string): string {
    const cleaned = sanitizeText(desc);
    if (cleaned.length > 1000) throw new Error('Description is too long (max 1000 characters)');
    return cleaned;
}

/** Sanitize and validate a category name (max 100 chars). */
export function sanitizeCategory(category: string): string {
    const cleaned = sanitizeText(category);
    if (cleaned.length === 0) throw new Error('Category is required');
    if (cleaned.length > 100) throw new Error('Category name is too long (max 100 characters)');
    return cleaned;
}

/** Validate a price value. */
export function validatePrice(price: number): number {
    if (isNaN(price) || price < 0) throw new Error('Price must be a positive number');
    if (price > 999999.99) throw new Error('Price is too high');
    return Math.round(price * 100) / 100; // Round to 2 decimal places
}

/** Sanitize customer info fields. */
export function sanitizeCustomerInput(customer: { name: string; phone: string; address: string; email?: string }) {
    return {
        name: sanitizeText(customer.name).slice(0, 200),
        phone: (customer.phone || '').replace(/[^\d+\-() ]/g, '').slice(0, 20),
        address: sanitizeText(customer.address).slice(0, 500),
        email: customer.email ? customer.email.trim().slice(0, 254) : undefined
    };
}
