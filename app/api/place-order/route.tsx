import { NextRequest, NextResponse } from 'next/server';
import { getTenantRepository, getOrderRepository, getProductRepository, getPromoCodeRepository } from '@/lib/repository';
import { Order } from '@/lib/repository/types';
import { getCurrencySymbol } from '@/lib/currency';
import { getDictionary, type Locale } from '@/lib/i18n/dictionaries';
import { sanitizeCustomerInput } from '@/lib/sanitize';
import { DEMO_MODE, DEMO_ORDER_MESSAGE } from '@/lib/config';

export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter (resets on deploy/restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max orders per window
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX) return false;
    entry.count++;
    return true;
}

export async function POST(req: NextRequest) {
    try {
        // Demo-only mode: ordering is permanently disabled across every store.
        if (DEMO_MODE) {
            return NextResponse.json({ error: DEMO_ORDER_MESSAGE }, { status: 403 });
        }

        // Rate limiting
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many orders. Please try again later.' }, { status: 429 });
        }

        const body = await req.json();
        const { items, total, customer, slug, promoCode, paymentMethod, fulfillmentMethod, notes, paymentSlipUrl } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Missing store slug' }, { status: 400 });
        }

        const tenantRepo = getTenantRepository();
        const tenant = await tenantRepo.getTenantBySlug(slug);

        if (!tenant) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const productRepo = getProductRepository();
        const products = await productRepo.getProducts(tenant.id);

        let calculatedTotal = 0;
        const validatedItems = [];

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
        }

        for (const item of items) {
            const product = products.find((p: any) => p.id === item.id);
            if (!product) {
                return NextResponse.json({ error: `Product "${item.name}" is no longer available. Please refresh and try again.` }, { status: 400 });
            }

            // Verify price
            const price = product.price;
            const quantity = parseInt(item.quantity) || 0;

            if (quantity <= 0) continue;

            calculatedTotal += price * quantity;

            validatedItems.push({
                ...item,
                price: price, // Enforce server price
                name: product.name, // Enforce server name
                digitalFileUrl: product.digitalFileUrl
            });
        }

        if (validatedItems.length === 0) {
            return NextResponse.json({ error: 'No valid items in your order' }, { status: 400 });
        }

        // Overwrite total with calculated one, then apply promo if valid
        let discount = 0;
        let validatedPromoCode: string | undefined = undefined;

        if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
            const promoRepo = getPromoCodeRepository();
            const promo = await promoRepo.getPromo(promoCode.trim().toUpperCase(), tenant.id);
            if (promo && promo.isActive) {
                if (promo.discountType === 'percent') {
                    discount = calculatedTotal * (promo.value / 100);
                } else {
                    discount = promo.value;
                }
                // Ensure discount doesn't exceed the total
                discount = Math.min(discount, calculatedTotal);
                validatedPromoCode = promo.code;
                // Increment usage count
                await promoRepo.incrementUsage(promo.id);
            }
        }

        const deliveryFeeSetting = tenant.deliveryFee || 0;
        const finalTotal = Math.max(0, calculatedTotal + deliveryFeeSetting - discount);

        // Generate Order ID (simple unique ID)
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        // Sanitize customer input
        const safeCustomer = sanitizeCustomerInput(customer);

        const order: Order = {
            id: orderId,
            tenantId: tenant.id,
            date: new Date().toISOString(),
            customer: safeCustomer,
            items: validatedItems,
            subtotal: calculatedTotal,
            deliveryFee: deliveryFeeSetting,
            discount,
            promoCode: validatedPromoCode,
            total: finalTotal,
            paymentMethod,
            fulfillmentMethod: fulfillmentMethod || 'delivery',
            status: 'pending',
            notes: notes ? String(notes).slice(0, 500) : undefined,
            paymentSlipUrl: paymentSlipUrl || undefined
        };

        const orderRepo = getOrderRepository();
        await orderRepo.saveOrder(order);

        // Construct WhatsApp Message — translated to the customer's locale
        // (passed in the request body) or the merchant's default if none.
        const requestedLocale = (body?.locale as string | undefined) || tenant.language || 'en';
        const locale: Locale = (['en','es','fr','ar','pt','id'].includes(requestedLocale) ? requestedLocale : 'en') as Locale;
        const t = getDictionary(locale);

        const fulfillmentLabels: Record<string, string> = {
            delivery: `🚗 ${t.fulfillmentDelivery}`,
            pickup:   `🏪 ${t.fulfillmentPickup}`,
            meetup:   `🤝 ${t.fulfillmentDinein}`,
            post:     `📦 ${t.fulfillmentPost}`,
        };
        const fulfillmentLabel = fulfillmentLabels[fulfillmentMethod || 'delivery'] || fulfillmentLabels.delivery;
        const currencySymbol = getCurrencySymbol(tenant.currency);
        const itemsList = validatedItems.map((item: any, i: number) => {
            const sizeLabel = item.selectedSize ? ` (${item.selectedSize})` : '';
            return `  ${i + 1}. ${item.name}${sizeLabel} × ${item.quantity}  —  ${currencySymbol}${(item.price * item.quantity).toFixed(2)}`;
        }).join('\n');

        const message =
            `🛒 *${t.newOrder}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📋 *${t.orderLabel} #${orderId}*\n` +
            `🏪 ${tenant.name}\n\n` +
            `👤 *${t.customerDetails}*\n` +
            `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n` +
            `   ${customer.name}\n` +
            `📞 ${customer.phone}\n` +
            (customer.email ? `📧 ${customer.email}\n` : '') +
            `📍 ${customer.address}\n` +
            (customer.locationLink ? `🗺️ ${customer.locationLink}\n` : '') +
            `${fulfillmentLabel}\n` +
            `\n` +
            `🍽️ *${t.orderItems}*\n` +
            `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n` +
            `${itemsList}\n\n` +
            `   ${t.subtotal}: ${currencySymbol}${calculatedTotal.toFixed(2)}\n` +
            (deliveryFeeSetting > 0 ?
                `   🚗 ${t.delivery}: ${currencySymbol}${deliveryFeeSetting.toFixed(2)}\n`
                : '') +
            (discount > 0 ?
                `   🏷️ ${t.discount}${validatedPromoCode ? ` (${validatedPromoCode})` : ''}: -${currencySymbol}${discount.toFixed(2)}\n`
                : '') +
            `━━━━━━━━━━━━━━━━\n` +
            `💰 *${t.total.toUpperCase()}: ${currencySymbol}${finalTotal.toFixed(2)}*\n` +
            `💳 ${t.paymentLabel}: ${paymentMethod}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            (notes ? `\n📝 *${t.notesLabel}:* ${notes}\n` : '') +
            (paymentSlipUrl ? `\n📎 *${t.paymentSlipLabel}:* ${paymentSlipUrl}\n` : '') +
            `\n🔗 *${t.trackLabel}:* ${process.env.NEXT_PUBLIC_SITE_URL || 'https://easyorder-bot.vercel.app'}/store/${slug}/order/${orderId}\n` +
            `\n_${t.poweredBy} OrderViaChat.com_`;

        // --- Send Email Receipt (non-blocking) ---
        if (customer.email && process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend');
                const { OrderReceiptEmail } = await import('@/components/email/OrderReceiptEmail');
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'EasyOrder <orders@resend.dev>',
                    to: customer.email,
                    subject: `Order Receipt #${orderId} - ${tenant.name}`,
                    react: (
                        <OrderReceiptEmail
                            orderId={orderId}
                            customerName={customer.name}
                            items={validatedItems.map((i: any) => ({ name: i.name, quantity: parseInt(i.quantity), price: i.price, digitalFileUrl: i.digitalFileUrl }))}
                            total={finalTotal}
                            date={order.date}
                            storeName={tenant.name}
                            currency={tenant.currency}
                            timezone={tenant.timezone}
                        />
                    )
                });
                console.log(`Email receipt sent to ${customer.email}`);
            } catch (emailError) {
                console.error('Failed to send email receipt:', emailError);
                // Don't fail the request, just log it
            }
        }

        // Generate WhatsApp Link
        let whatsappNumber = tenant.ownerPhone;

        // DEV: Fallback for demo store testing
        if (!whatsappNumber && slug === 'demo') {
            whatsappNumber = '923224609117';
        }

        // Clean number
        if (whatsappNumber) {
            whatsappNumber = whatsappNumber.replace(/[^\d]/g, '');
        }

        return NextResponse.json({
            success: true,
            orderId,
            whatsappNumber,
            message: encodeURIComponent(message),
            trackingUrl: `/store/${slug}/order/${orderId}`
        });

    } catch (error: any) {
        console.error('Place Order Error:', error?.message, error?.stack);
        return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
    }
}
