/**
 * Global runtime configuration for OrderViaChat.
 *
 * DEMO_MODE converts the whole platform into a read-only demo / portfolio piece:
 *   - New store creation, signup and all auth/login flows are disabled.
 *   - Existing store owners are notified the service is permanently closed.
 *   - Only the public landing page, the blog, legal pages and the demo store
 *     (`/store/demo`) remain accessible. Ordering is disabled everywhere and
 *     shows a "contact us" message instead.
 *
 * To turn the platform back on, set DEMO_MODE to `false`.
 */
export const DEMO_MODE = true;

/** Contact email shown across the demo experience. */
export const CONTACT_EMAIL = 'segmentbi@gmail.com';

/** Slug of the single store that stays fully browsable as a showcase. */
export const DEMO_STORE_SLUG = 'demo';

/** Permanent closure notice shown to existing store owners. */
export const CLOSURE_MESSAGE =
    'This service has been permanently closed. Your store will no longer be accessible to customers. Thank you for using OrderViaChat.';

/** Message shown when a visitor tries to order from the demo store. */
export const DEMO_ORDER_MESSAGE =
    `This is a demo store — orders are disabled. Contact us at ${CONTACT_EMAIL} to get your own store.`;

/** mailto: link used by every "Contact Us" call-to-action. */
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'OrderViaChat — Interested in a store like this'
)}`;
