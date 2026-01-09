'use server';

import { getTenantRepository } from "@/lib/repository";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function registerTenant(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !slug || !email || !password) {
        return { error: "All fields are required" };
    }

    const repo = getTenantRepository();

    // Check if slug exists
    const existing = await repo.getTenantBySlug(slug);
    if (existing) {
        return { error: "Store URL is already taken. Please choose another one." };
    }

    try {
        // 1. Create Tenant in DB (Pending Payment)
        const tenant = await repo.createTenant({
            name,
            slug,
            email,
            password, // In a real app, HASH THIS PASSWORD!
            status: 'pending_payment',
            currency: 'USD', // Default
            themeColor: '#2563eb', // Default Blue
            ownerPhone: '' // Can be updated later
        });

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'EasyOrder Pro Subscription',
                            description: `Monthly subscription for ${name}`,
                        },
                        unit_amount: 2900, // $29.00
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${slug}/admin?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register?canceled=true`,
            client_reference_id: tenant.id, // Important: We use this to link payment to tenant in webhook
            customer_email: email,
            metadata: {
                tenantId: tenant.id,
                slug: slug
            }
        });

        if (!session.url) {
            throw new Error("Failed to create Stripe session");
        }

        return { url: session.url };

    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Something went wrong. Please try again." };
    }
}
