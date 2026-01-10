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
            password: 'demo',
            language: 'en'
        });
    }

    // Check for existing products
    const products = await productRepo.getProducts(tenant.id);

    // Only verify if we have 0 products or we want to force seed
    // Let's seed if 0 products found.
    if (products.length === 0) {
        console.log("Seeding demo products...");
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
            },
            {
                id: 'p3',
                tenantId: tenant.id,
                name: 'Caesar Salad',
                category: 'Salads',
                price: 9,
                image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Crispy romaine lettuce, parmesan cheese, croutons, and Caesar dressing.'
            },
            {
                id: 'p4',
                tenantId: tenant.id,
                name: 'Fresh Sushi Platter',
                category: 'Sushi',
                price: 24,
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
                isAvailable: false,
                description: 'Assorted fresh sushi rolls and nigiri.'
            },
            {
                id: 'p5',
                tenantId: tenant.id,
                name: 'Tiramisu',
                category: 'Dessert',
                price: 8,
                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Classic Italian coffee-flavored dessert.'
            },
            {
                id: 'p6',
                tenantId: tenant.id,
                name: 'Fresh Orange Juice',
                category: 'Drinks',
                price: 5,
                image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Freshly squeezed orange juice.'
            },
            {
                id: 'p7',
                tenantId: tenant.id,
                name: 'Creamy Carbonara',
                category: 'Pasta',
                price: 16,
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Spaghetti with creamy sauce, pancetta, and parmesan.'
            },
            {
                id: 'p8',
                tenantId: tenant.id,
                name: 'Ribeye Steak',
                category: 'Steak',
                price: 32,
                image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Premium grilled ribeye steak with herbs.'
            },
            {
                id: 'p9',
                tenantId: tenant.id,
                name: 'Chocolate Lava Cake',
                category: 'Dessert',
                price: 9,
                image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Warm chocolate cake with a molten center.'
            },
            {
                id: 'p10',
                tenantId: tenant.id,
                name: 'Iced Caramel Latte',
                category: 'Drinks',
                price: 6,
                image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Chilled latte with sweet caramel syrup.'
            }
        ];

        for (const p of demoProducts) {
            // Re-assign tenantId just in case ID didn't match the new tenant
            const product = { ...p, tenantId: tenant.id };
            await productRepo.addProduct(product as any);
        }

        return NextResponse.json({ message: "Repopulated demo products", count: demoProducts.length });
    }

    return NextResponse.json({ message: "Demo tenant and products already exist", id: tenant.id, productCount: products.length });
}
