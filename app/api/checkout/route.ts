import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { generateInvoicePDF } from '@/lib/invoice';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, total, customer } = body;

        // Validate inputs
        if (!items || !customer || !customer.phone) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // 1. Generate Order ID
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;

        // 2. Prepare Order Object
        const newOrder = {
            id: orderId,
            date: new Date().toISOString(),
            customer,
            items,
            total,
            status: 'Pending'
        };

        // 3. Generate PDF Invoice
        let invoiceLink = '';
        try {
            // Generate the relative path
            const relativePath = await generateInvoicePDF(newOrder);
            // Prepend the public domain (Ngrok) so it's clickable in WhatsApp
            // TODO: Move domain to env var
            const baseUrl = 'https://franklin-caffeinic-rank.ngrok-free.dev';
            invoiceLink = `${baseUrl}${relativePath}`;
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            // Continue without invoice if fails, just log it
        }

        // 4. Format Items for Message
        const itemSummary = items.map((item: any) =>
            `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`
        ).join('\n');

        // 5. Construct WhatsApp Message for Customer
        const customerMessage = `🧾 *Order Confirmation ${orderId}*

Hello ${customer.name}, we received your order!

*Items:*
${itemSummary}

*Total:* $${total.toFixed(2)}
*Delivery Address:* ${customer.address}

📄 *Invoice:* ${invoiceLink}

We will confirm your delivery shortly.`;

        // 6. Send Message to Customer
        const cleanPhone = customer.phone.replace(/\D/g, '');
        await sendWhatsAppMessage(cleanPhone, customerMessage);

        // 7. Save Order (Hybrid: Local JSON or Cloud DB)
        try {
            const { getOrderRepository } = require('@/lib/repository');
            const repo = getOrderRepository();
            await repo.saveOrder(newOrder);
        } catch (saveError) {
            console.error('Failed to save order:', saveError);
            // Non-blocking error for User response, but log it.
        }

        // 6. Send Message to Owner (Placeholder logic)
        // In a real app, this would go to process.env.OWNER_PHONE_NUMBER
        // const ownerPhone = process.env.OWNER_PHONE_NUMBER;
        // if (ownerPhone) {
        //    await sendWhatsAppMessage(ownerPhone, `🔔 New Order ${orderId} from ${customer.name} ...`);
        // }

        return NextResponse.json({ success: true, orderId });
    } catch (error) {
        console.error('Checkout API error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
