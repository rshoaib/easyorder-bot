import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getTenantRepository } from "@/lib/repository";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const tenantId = session.client_reference_id;
        const stripeCustomerId = session.customer;

        if (tenantId) {
            const repo = getTenantRepository();
            await repo.updateTenantStatus(tenantId, 'active', stripeCustomerId);
            console.log(`Verified payment for tenant ${tenantId}. Activated.`);
        }
    }

    return new NextResponse(null, { status: 200 });
}
