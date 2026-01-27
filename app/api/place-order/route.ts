import { NextRequest, NextResponse } from 'next/server';
import { getTenantRepository, getOrderRepository, getProductRepository } from '@/lib/repository';
import { Order, Product } from '@/lib/repository/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, total, customer, slug, promoCode, paymentMethod } = body;

        const tenantRepo = getTenantRepository();
        const tenant = await tenantRepo.getTenantBySlug(slug);

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const productRepo = getProductRepository();
        const products = await productRepo.getProducts(tenant.id);

        let calculatedTotal = 0;
        const validatedItems = [];

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Invalid items in order' }, { status: 400 });
        }

        for (const item of items) {
            const product = products.find((p) => p.id === item.id);
            if (!product) {
                // If product not found (e.g. deleted), we might want to skip or error.
                // For now, let's error to be safe.
                return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
            }

            // Verify price
            const price = product.price;
            const quantity = parseInt(item.quantity) || 0;

            if (quantity <= 0) continue;

            calculatedTotal += price * quantity;

            validatedItems.push({
                ...item,
                price: price, // Enforce server price
                name: product.name // Enforce server name
            });
        }

        // Apply distinct promo code logic here if needed (omitted for now as it wasn't in original)
        // If there was a discount, we should recalculate it too.
        // For this health check, let's stick to base price validation.

        // Overwrite total with calculated one
        const finalTotal = calculatedTotal;

        // Generate Order ID (simple unique ID)
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        const order: Order = {
            id: orderId,
            tenantId: tenant.id,
            date: new Date().toISOString(),
            customer,
            items: validatedItems,
            subtotal: finalTotal,
            deliveryFee: 0, // Should fetch from config
            discount: 0,
            promoCode,
            total: finalTotal, // Use server-calculated total
            paymentMethod,
            status: 'pending'
        };

        const orderRepo = getOrderRepository();
        await orderRepo.saveOrder(order);

        // Construct WhatsApp Message
        const itemsList = validatedItems.map((item: any) => `- ${item.quantity}x ${item.name} ($${item.price})`).join('\n');
        const message = `*New Order #${orderId}*\n\n` +
            `*Customer:* ${customer.name}\n` +
            `*Phone:* ${customer.phone}\n` +
            `*Address:* ${customer.address}\n\n` +
            `*Items:*\n${itemsList}\n\n` +
            `*Total:* $${finalTotal.toFixed(2)}\n` +
            `*Payment:* ${paymentMethod}\n` +
            (customer.locationLink ? `\n*Location:* ${customer.locationLink}` : '');

        // Generate WhatsApp Link
        // Use tenant.ownerPhone if available, otherwise fallback (or error?)
        // For now, if no ownerPhone, we might fail or send to a default?
        // Let's assume the user MUST set it up.

        let whatsappNumber = tenant.ownerPhone;

        // DEV: Fallback for demo store testing
        if (!whatsappNumber && slug === 'demo') {
            whatsappNumber = '923224609117'; // User provided test number
        }

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
