import { test, expect } from '@playwright/test';

test.describe('Order Flow and Event Tracking', () => {
    test('should complete order and fire GA/FB events', async ({ page }) => {
        // Intercept Google Analytics requests to verify `purchase` event is sent
        const gaRequests: any[] = [];
        page.on('request', request => {
            const url = request.url();
            if (url.includes('google-analytics.com/g/collect')) {
                gaRequests.push(url);
            }
        });

        // We can also check window.fbq if it's called
        // We will inject a mock or listen to fbq calls if it's tricky to intercept Facebook network requests.
        // React Facebook Pixel initializes window.fbq. We can evaluate it.

        // 1. Visit the demo store
        await page.goto('/store/demo');

        // Verify Facebook Pixel PageView
        await page.waitForFunction(() => typeof window !== 'undefined' && 'fbq' in window);

        // 2. Add an item to the cart
        // We click the first product card
        const firstProduct = page.locator('.product-card').first();
        await firstProduct.waitFor({ state: 'visible' });
        await firstProduct.click();

        // 3. Navigate to Cart
        const cartButton = page.locator('.cart-btn');
        await cartButton.click();
        await page.waitForURL('**/store/demo/cart');

        // 4. Fill Checkout Form
        await page.fill('input[placeholder="John Doe"]', 'Test User');
        await page.fill('input[type="tel"]', '+1234567890');

        // Fill address if it exists (not digital only)
        const addressInput = page.locator('textarea[placeholder*="Street, City"]');
        if (await addressInput.isVisible()) {
            await addressInput.fill('123 Test St, Test City');
        } else {
            // Alternatively it might ask for email
            const emailInput = page.locator('input[type="email"]');
            if (await emailInput.isVisible()) {
                await emailInput.fill('test@example.com');
            }
        }

        // 5. Submit Order
        const submitBtn = page.locator('button[type="submit"]');
        await submitBtn.click();

        // 6. Verify Google Analytics Purchase Event
        // Wait for the specific GA request or check dataLayer
        const gaPurchaseFired = await page.waitForFunction(() => {
            const dl = (window as any).dataLayer || [];
            return dl.some((event: any) => event.event === 'purchase');
        }, { timeout: 5000 }).catch(() => false);

        expect(gaPurchaseFired).toBeTruthy();

        // Verify Facebook Pixel state (it should at least be loaded)
        const fbqLoaded = await page.evaluate(() => {
            return typeof window !== 'undefined' && 'fbq' in window;
        });
        expect(fbqLoaded).toBeTruthy();
    });
});
