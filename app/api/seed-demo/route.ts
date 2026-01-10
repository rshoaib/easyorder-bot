import { getTenantRepository, getProductRepository } from "@/lib/repository";
import { NextResponse } from "next/server";

export async function GET() {
    const tenantRepo = getTenantRepository();
    const productRepo = getProductRepository();

    let tenant = await tenantRepo.getTenantBySlug('demo');

    if (!tenant) {
        // Create the tenant
        tenant = await tenantRepo.createTenant({
            slug: 'demo',
            name: 'Pizza Demo 🍕',
            ownerPhone: '1234567890',
            currency: 'USD',
            themeColor: '#e11d48',
            status: 'active',
            email: 'demo@example.com',
            password: 'demo', // simplistic for now
            language: 'en'
        });

        // Seed some products
        const demoProducts = [
            {
                id: 'p1',
                tenantId: tenant.id,
                name: 'Pepperoni Feast',
                category: 'Pizza',
                price: 14,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Classic pepperoni pizza with extra cheese.'
            },
            {
                id: 'p2',
                tenantId: tenant.id,
                name: 'Classic Burger',
                category: 'Burgers',
                price: 12,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Juicy beef burger with lettuce, tomato, and cheese.'
            }
        ];

        for (const p of demoProducts) {
            await productRepo.addProduct(p as any);
        }

        return NextResponse.json({ message: "Created demo tenant and products" });
    }

    return NextResponse.json({ message: "Demo tenant already exists", id: tenant.id });
}
