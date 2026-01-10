import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

if (!process.env.LEMONSQUEEZY_API_KEY) {
    console.warn("LEMONSQUEEZY_API_KEY is missing. Billing features will fail.");
}

// Initialize the client once
lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
    onError: (error) => console.error("LemonSqueezy Error:", error),
});
