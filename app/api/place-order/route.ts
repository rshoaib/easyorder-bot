import { NextRequest, NextResponse } from 'next/server';
import { getTenantRepository, getOrderRepository } from '@/lib/repository';
import { Order } from '@/lib/repository/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, total, customer, slug, promoCode, paymentMethod } = body;

        const tenantRepo = getTenantRepository();
        const tenant = await tenantRepo.getTenantBySlug(slug);

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        // Generate Order ID (simple unique ID)
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        const order: Order = {
            id: orderId,
            tenantId: tenant.id,
            date: new Date().toISOString(),
            customer,
            items,
            subtotal: total, // Approximate, client passes total. In real app, recalculate.
            deliveryFee: 0, // Should fetch from config
            discount: 0,
            promoCode,
            total: total,
            paymentMethod,
            status: 'pending'
        };

        const orderRepo = getOrderRepository();
        await orderRepo.saveOrder(order);

        // Construct WhatsApp Message
        const itemsList = items.map((item: any) => `- ${item.quantity}x ${item.name} ($${item.price})`).join('\n');
        const message = `*New Order #${orderId}*\n\n` +
            `*Customer:* ${customer.name}\n` +
            `*Phone:* ${customer.phone}\n` +
            `*Address:* ${customer.address}\n\n` +
            `*Items:*\n${itemsList}\n\n` +
            `*Total:* $${total.toFixed(2)}\n` +
            `*Payment:* ${paymentMethod}\n` +
            (customer.locationLink ? `\n*Location:* ${customer.locationLink}` : '');

        // Generate WhatsApp Link
        // Use tenant.ownerPhone if available, otherwise fallback (or error?)
        // For now, if no ownerPhone, we might fail or send to a default?
        // Let's assume the user MUST set it up.

        let whatsappNumber = tenant.ownerPhone;
        // Clean number
        if (whatsappNumber) {
            whatsappNumber = whatsappNumber.replace(/[^\d]/g, '');
        }

        return NextResponse.json({
            success: true,
            orderId,
            whatsappNumber,
            message: encodeURIComponent(message)
        });

    } catch (error: any) {
        console.error('Available Place Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
