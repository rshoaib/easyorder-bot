import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { getTenantRepository } from '@/lib/repository';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { variantId, tenantId } = body;

        // Use environment variant ID if not provided (default plan)
        const finalVariantId = variantId || process.env.LEMONSQUEEZY_VARIANT_ID;

        if (!finalVariantId || !tenantId) {
            return NextResponse.json({ error: 'Missing variantId or tenantId' }, { status: 400 });
        }

        const repo = getTenantRepository();
        const tenant = await repo.getTenantById(tenantId);
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        if (!storeId) {
            return NextResponse.json({ error: 'Store ID not configured' }, { status: 500 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`;

        // If ID is a UUID (long string), it's likely a Checkout Link hash, not a Variant ID
        // We can just construct the URL manually with query params
        if (finalVariantId.length > 20 && finalVariantId.includes('-')) {
            const checkoutUrl = new URL(`https://store.lemonsqueezy.com/checkout/buy/${finalVariantId}`);
            checkoutUrl.searchParams.append('checkout[custom][tenant_id]', tenantId);
            // checkoutUrl.searchParams.append('checkout[email]', '...'); // Optional

            // Custom redirect after success
            checkoutUrl.searchParams.append('checkout[product_options][redirect_url]', `${baseUrl}/admin/dashboard?success=true`);

            return NextResponse.json({ url: checkoutUrl.toString() });
        }

        // Otherwise, assume it's an integer Variant ID and use the SDK
        const checkout = await createCheckout(
            storeId,
            finalVariantId,
            {
                checkoutData: {
                    custom: {
                        tenant_id: tenantId // Pass tenant ID to webhook
                    },
                    email: 'user@example.com', // In real app, pass user's email if known
                },
                productOptions: {
                    redirectUrl: `${baseUrl}/admin/dashboard?success=true`,
                }
            }
        );

        // Check if data exists (LemonSqueezy SDK returns wrapper object)
        if (!checkout.data?.data?.attributes?.url) {
            console.error("LemonSqueezy Response:", checkout);
            return NextResponse.json({ error: 'Failed to create checkout URL' }, { status: 500 });
        }

        return NextResponse.json({ url: checkout.data.data.attributes.url });

    } catch (error: any) {
        console.error('LemonSqueezy Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
