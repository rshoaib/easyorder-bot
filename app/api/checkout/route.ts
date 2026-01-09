import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { getOrderRepository } from '@/lib/repository';

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

*Total:* $${total.toFixed(2)}
*Delivery Address:* ${customer.address}

📄 *Invoice:* ${invoiceLink}

We will confirm your delivery shortly.`;

        // 6. Send Message to Customer
        const cleanPhone = customer.phone.replace(/\D/g, '');
        await sendWhatsAppMessage(cleanPhone, customerMessage);

        // 7. Send Message to Owner
        const ownerPhone = process.env.OWNER_PHONE_NUMBER;
        if (ownerPhone) {
            const ownerMessage = `🔔 *New Order Received!*
            
📦 *Order:* ${orderId}
👤 *Customer:* ${customer.name} (${customer.phone})
💰 *Total:* $${total.toFixed(2)}

See full details in Admin Dashboard:
https://easyorder-bot.vercel.app/admin`;

            // Clean owner phone just in case
            const cleanOwnerPhone = ownerPhone.replace(/\D/g, '');
            await sendWhatsAppMessage(cleanOwnerPhone, ownerMessage);
        }

        // 7. (Saved already)

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
