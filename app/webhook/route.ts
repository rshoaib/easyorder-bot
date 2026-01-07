import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// Verify Webhook (GET)
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }
    return new NextResponse('Bad Request', { status: 400 });
}

// Handle Incoming Messages (POST)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if it's a WhatsApp status update or message
        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const from = message.from; // Sender's phone number
                const text = message.text?.body;

                console.log(`Received message from ${from}: ${text}`);

                if (text && text.toLowerCase().trim() === 'menu') {
                    // Send the catalog link
                    // In a real deployment, this would be the actual URL of the web app
                    // For now, we'll send a placeholder or the localhost link (which won't work on mobile unless tunneled)

                    // TODO: Replace with deployed URL
                    const appUrl = 'https://franklin-caffeinic-rank.ngrok-free.dev';

                    await sendWhatsAppMessage(
                        from,
                        `👋 Welcome to EasyOrder! \n\n🛒 Browse our catalog and order here: ${appUrl}\n\nWe will send you an invoice as soon as you place an order!`
                    );
                }
            }
            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        } else {
            return new NextResponse('Not a WhatsApp API event', { status: 404 });
        }
    } catch (error) {
        console.error('Error handling webhook POST:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
