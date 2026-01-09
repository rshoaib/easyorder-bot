import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { getOrderRepository, getTenantRepository } from '@/lib/repository';
import { Order } from '@/lib/repository/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, customer, slug, promoCode } = body;

        // 0. Get Tenant
        const tenantRepo = getTenantRepository();
        // Use slug from request, fallback to default if not provided (legacy support)
        const targetSlug = slug || 'default';
        const tenant = await tenantRepo.getTenantBySlug(targetSlug);

        if (!tenant) {
            return new NextResponse(`Store '${targetSlug}' not found`, { status: 404 });
        }

        // Validate inputs
        if (!items || !customer || !customer.phone) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // 1. Generate Order ID
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;

        // 2. Prepare Order Object
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const deliveryFee = parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE || "0");

        // Calculate Discount
        let discount = 0;
        if (promoCode) {
            const { getPromoCodeRepository } = await import('@/lib/repository');
            const promoRepo = getPromoCodeRepository();
            const promo = await promoRepo.getPromo(promoCode, tenant.id);

            if (promo && promo.isActive) {
                if (promo.discountType === 'percent') {
                    discount = subtotal * (promo.value / 100);
                } else {
                    discount = promo.value;
                }
                // Increment usage (fire and forget)
                promoRepo.incrementUsage(promo.id);
            }
        }

        const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

        const newOrder: Order = {
            id: orderId,
            tenantId: tenant.id,
            date: new Date().toISOString(),
            customer: {
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                locationLink: customer.locationLink
            },
            items,
            subtotal,
            deliveryFee,
            discount,
            promoCode: discount > 0 ? promoCode : undefined,
            total: finalTotal,
            status: 'pending'
        };

        // 3. Save Order FIRST (so it exists for the invoice link)
        try {
            const repo = getOrderRepository();
            await repo.saveOrder(newOrder);
        } catch (saveError) {
            console.error('Failed to save order:', saveError);
            return new NextResponse('Failed to save order', { status: 500 });
        }

        // 4. Generate Invoice Link
        // Use the deployed Vercel URL
        const baseUrl = 'https://easyorder-bot.vercel.app';
        // Ideally we should point to /store/[slug]/invoice/[id] or keep api link
        const invoiceLink = `${baseUrl}/api/invoice/${orderId}`;

        // 4. Format Items for Message
        const itemSummary = items.map((item: any) =>
            `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`
        ).join('\n');

        // 5. Construct WhatsApp Message for Customer
        const customerMessage = `🧾 *Order Confirmation ${orderId}*

Hello ${customer.name}, we received your order!

*Items:*
${itemSummary}

*Total:* $${finalTotal.toFixed(2)}
${discount > 0 ? `(Discount: -$${discount.toFixed(2)})` : ''}
*Delivery Address:* ${customer.address}

📄 *Invoice:* ${invoiceLink}

We will confirm your delivery shortly.`;

        // 6. Send Message to Customer
        const cleanPhone = customer.phone.replace(/\D/g, '');
        await sendWhatsAppMessage(cleanPhone, customerMessage);

        // 7. Send Email Notification to Owner (if they have email)
        if (tenant.email) {
            const { sendOrderNotification } = await import('@/lib/email');
            // Fire and forget email to not slow down response
            sendOrderNotification(tenant.email, orderId, finalTotal, customer.name).catch(console.error);
        }

        // 8. Send WhatsApp to Owner
        const ownerPhone = process.env.OWNER_PHONE_NUMBER;
        if (ownerPhone) {
            const ownerMessage = `🔔 *New Order Received!*
            
📦 *Order:* ${orderId}
👤 *Customer:* ${customer.name} (${customer.phone})
💰 *Total:* $${finalTotal.toFixed(2)} ${discount > 0 ? `(Saved $${discount.toFixed(2)})` : ''}

See full details in Admin Dashboard:
https://easyorder-bot.vercel.app/admin`;

            // Clean owner phone just in case
            const cleanOwnerPhone = ownerPhone.replace(/\D/g, '');
            await sendWhatsAppMessage(cleanOwnerPhone, ownerMessage);
        }

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error('Checkout API error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
