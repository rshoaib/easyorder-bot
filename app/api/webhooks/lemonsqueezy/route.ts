import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getTenantRepository } from '@/lib/repository';

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();
        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '');
        const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(text);
        const eventName = payload.meta.event_name;
        const customData = payload.meta.custom_data || {};
        const tenantId = customData.tenant_id;

        if (!tenantId) {
            // Some events might not have tenant_id if not passed correctly or if it's a generic event
            console.warn('Webhook received without tenant_id:', eventName);
            return NextResponse.json({ message: 'No tenant_id, ignored' }, { status: 200 });
        }

        const repo = getTenantRepository();

        if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'order_created') {
            const attributes = payload.data.attributes;
            const customerId = attributes.customer_id;
            const subscriptionId = payload.data.id; // For subscription events, data.id is the sub ID
            const variantId = attributes.variant_id;
            const status = attributes.status; // active, past_due, etc.

            // Update Tenant
            await repo.updateTenantBilling(tenantId, {
                lemonsqueezy_customer_id: `${customerId}`,
                lemonsqueezy_subscription_id: `${subscriptionId}`,
                lemonsqueezy_variant_id: `${variantId}`,
                subscription_status: status,
            });

            console.log(`Updated tenant ${tenantId} subscription status to ${status}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('LemonSqueezy Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
