import { NextRequest, NextResponse } from 'next/server';
import { getTenantRepository, getOrderRepository, getProductRepository } from '@/lib/repository';
import { Order, Product } from '@/lib/repository/types';
import { getCurrencySymbol } from '@/lib/currency';
import { sanitizeCustomerInput } from '@/lib/sanitize';

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
        // Rate limiting
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many orders. Please try again later.' }, { status: 429 });
        }

        const body = await req.json();
        const { items, total, customer, slug, promoCode, paymentMethod, notes } = body;

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
            const product = products.find((p) => p.id === item.id);
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

        // Overwrite total with calculated one
        const finalTotal = calculatedTotal;

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
            subtotal: finalTotal,
            deliveryFee: 0,
            discount: 0,
            promoCode,
            total: finalTotal,
            paymentMethod,
            status: 'pending',
            notes: notes ? String(notes).slice(0, 500) : undefined
        };

        const orderRepo = getOrderRepository();
        await orderRepo.saveOrder(order);

        // Construct WhatsApp Message
        const currencySymbol = getCurrencySymbol(tenant.currency);
        const itemsList = validatedItems.map((item: any) => `- ${item.quantity}x ${item.name} (${currencySymbol}${item.price})`).join('\n');
        const message = `*New Order #${orderId}*\n\n` +
            `*Customer:* ${customer.name}\n` +
            `*Phone:* ${customer.phone}\n` +
            (customer.email ? `*Email:* ${customer.email}\n` : '') +
            `*Address:* ${customer.address}\n\n` +
            `*Items:*\n${itemsList}\n\n` +
            `*Total:* ${currencySymbol}${finalTotal.toFixed(2)}\n` +
            `*Payment:* ${paymentMethod}\n` +
            (notes ? `\n*Notes:* ${notes}\n` : '') +
            (customer.locationLink ? `\n*Location:* ${customer.locationLink}` : '') +
            `\n\n*Track Order:* ${process.env.NEXT_PUBLIC_SITE_URL || 'https://easyorder-bot.vercel.app'}/store/${slug}/order/${orderId}`;

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

