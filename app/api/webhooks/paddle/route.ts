import { NextRequest, NextResponse } from "next/server";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { getTenantRepository } from "@/lib/repository";
import crypto from "crypto";

// Initialize the Paddle SDK
// We pass the API key and set the environment (sandbox or production)
const paddle = new Paddle(process.env.PADDLE_API_KEY || "", {
  environment: process.env.NODE_ENV === "production" ? Environment.production : Environment.sandbox,
});

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("paddle-signature");
    if (!signature) {
      console.warn("Webhook received without a paddle-signature header");
      return NextResponse.json(
        { message: "Missing paddle-signature header" },
        { status: 400 }
      );
    }

    const rawRequestBody = await req.text();
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";

    // The SDK provides a helper to construct the event, which perfectly validates the signature
    const eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
    
    if (!eventData) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const eventName = eventData.eventType;
    console.log(`[Paddle Webhook] Received validated event: ${eventName}`);

    // We only care about subscription events where customData contains a tenantId
    if (
      eventName === "subscription.created" ||
      eventName === "subscription.updated" ||
      eventName === "subscription.canceled" ||
      eventName === "subscription.past_due" ||
      eventName === "subscription.activated" ||
      eventName === "subscription.resumed"
    ) {
      const subscription = eventData.data as any;
      const customData = subscription.customData || {};
      const tenantId = customData.tenantId;

      if (!tenantId) {
        console.warn(`[Paddle Webhook] Event ${eventName} received, but no tenantId found in customData. Ignoring.`);
        return NextResponse.json({ message: "No tenantId, ignored" }, { status: 200 });
      }

      const repo = getTenantRepository();

      const customerId = subscription.customerId;
      const subscriptionId = subscription.id;
      
      // Get the price ID from the first item in the subscription
      const priceId = subscription.items?.[0]?.price?.id || null;
      
      // Map Paddle's status to your database status conventions
      const status = subscription.status; 

      // Update Tenant using the ANY bypass for the new fields since types_supabase is locked
      await repo.updateTenantBilling(tenantId, {
        subscription_status: status,
        paddle_customer_id: customerId,
        paddle_subscription_id: subscriptionId,
        paddle_price_id: priceId,
      } as any);

      console.log(`[Paddle Webhook] Successfully updated tenant ${tenantId} subscription status to ${status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Paddle Webhook Error]:", error);
    // Return 200 even on errors for non-matching events so Paddle stops retrying,
    // but log the error appropriately.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
