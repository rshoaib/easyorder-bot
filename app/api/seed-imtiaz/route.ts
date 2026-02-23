import { getTenantRepository, getProductRepository, getOrderRepository } from "@/lib/repository";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        // Use service role client to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const tenantRepo = getTenantRepository(supabase);
        const productRepo = getProductRepository(supabase);
        const orderRepo = getOrderRepository(supabase);


        const tenant = await tenantRepo.getTenantBySlug('imtiazstore');
        if (!tenant) {
            return NextResponse.json({ error: "Tenant 'imtiazstore' not found" }, { status: 404 });
        }

        // ─── 1. Seed Products (12 items across 6 categories) ───
        const products = [
            // Burgers
            {
                id: `imtiaz_p${Date.now()}_1`,
                tenantId: tenant.id,
                name: 'Classic Smash Burger',
                category: 'Burgers',
                price: 8.99,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Double smashed beef patties with melted American cheese, pickles, and special sauce.',
                type: 'physical' as const
            },
            {
                id: `imtiaz_p${Date.now()}_2`,
                tenantId: tenant.id,
                name: 'Spicy Chicken Burger',
                category: 'Burgers',
                price: 9.49,
                image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Crispy fried chicken fillet with jalapeño mayo, lettuce, and tangy slaw.',
                type: 'physical' as const
            },
            // Pizza
            {
                id: `imtiaz_p${Date.now()}_3`,
                tenantId: tenant.id,
                name: 'Pepperoni Supreme',
                category: 'Pizza',
                price: 14.99,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Loaded pepperoni pizza with extra mozzarella on hand-tossed dough.',
                type: 'physical' as const
            },
            {
                id: `imtiaz_p${Date.now()}_4`,
                tenantId: tenant.id,
                name: 'BBQ Chicken Pizza',
                category: 'Pizza',
                price: 15.99,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Smoky BBQ sauce, grilled chicken, red onions, and cilantro.',
                type: 'physical' as const
            },
            // Pasta
            {
                id: `imtiaz_p${Date.now()}_5`,
                tenantId: tenant.id,
                name: 'Creamy Alfredo Pasta',
                category: 'Pasta',
                price: 12.49,
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Fettuccine in rich parmesan cream sauce with grilled chicken.',
                type: 'physical' as const
            },
            {
                id: `imtiaz_p${Date.now()}_6`,
                tenantId: tenant.id,
                name: 'Spicy Arrabbiata',
                category: 'Pasta',
                price: 11.99,
                image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Penne in fiery tomato sauce with garlic, chilli flakes, and fresh basil.',
                type: 'physical' as const
            },
            // Drinks
            {
                id: `imtiaz_p${Date.now()}_7`,
                tenantId: tenant.id,
                name: 'Iced Caramel Latte',
                category: 'Drinks',
                price: 5.49,
                image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Chilled espresso with caramel syrup, milk, and ice.',
                type: 'physical' as const
            },
            {
                id: `imtiaz_p${Date.now()}_8`,
                tenantId: tenant.id,
                name: 'Fresh Mango Smoothie',
                category: 'Drinks',
                price: 6.99,
                image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Blended fresh mango with yogurt and a hint of honey.',
                type: 'physical' as const
            },
            // Desserts
            {
                id: `imtiaz_p${Date.now()}_9`,
                tenantId: tenant.id,
                name: 'Tiramisu',
                category: 'Desserts',
                price: 7.99,
                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Classic Italian coffee-layered dessert with mascarpone cream.',
                type: 'physical' as const
            },
            {
                id: `imtiaz_p${Date.now()}_10`,
                tenantId: tenant.id,
                name: 'New York Cheesecake',
                category: 'Desserts',
                price: 8.49,
                image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Rich and creamy cheesecake with a buttery graham cracker crust.',
                type: 'physical' as const
            },
            // Sides
            {
                id: `imtiaz_p${Date.now()}_11`,
                tenantId: tenant.id,
                name: 'Loaded Fries',
                category: 'Sides',
                price: 5.99,
                image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
                isAvailable: true,
                description: 'Crispy fries topped with cheese sauce, jalapeños, and sour cream.',
                type: 'physical' as const
            },
            {
                id: `imtiaz_p${Date.now()}_12`,
                tenantId: tenant.id,
                name: 'Onion Rings',
                category: 'Sides',
                price: 4.99,
                image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80',
                isAvailable: false, // One sold-out item for testing
                description: 'Golden crispy onion rings served with dipping sauce.',
                type: 'physical' as const
            },
        ];

        let addedCount = 0;
        for (const p of products) {
            await productRepo.addProduct(p);
            addedCount++;
        }

        // ─── 2. Seed Orders (5 test orders in various statuses) ───
        const statuses: Array<'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'> = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
        const customerNames = ['Ahmed Khan', 'Fatima Ali', 'Bilal Hassan', 'Sara Imtiaz', 'Usman Raza'];
        const phones = ['+923001234567', '+923009876543', '+923005551234', '+923007778888', '+923003334444'];

        for (let i = 0; i < 5; i++) {
            const orderItems = [
                { name: products[i * 2].name, price: products[i * 2].price, qty: Math.floor(Math.random() * 3) + 1 },
                { name: products[i * 2 + 1].name, price: products[i * 2 + 1].price, qty: 1 },
            ];
            const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
            const deliveryFee = i < 3 ? 2.50 : 0;
            const discount = i === 3 ? 5 : 0;

            await orderRepo.saveOrder({
                id: `imtiaz_ord_${Date.now()}_${i}`,
                tenantId: tenant.id,
                date: new Date(Date.now() - (i * 86400000)).toISOString(), // Spread over last 5 days
                customer: {
                    name: customerNames[i],
                    phone: phones[i],
                    address: `House ${100 + i}, Street ${10 + i}, Islamabad`,
                },
                items: orderItems,
                subtotal: Math.round(subtotal * 100) / 100,
                deliveryFee,
                discount,
                total: Math.round((subtotal + deliveryFee - discount) * 100) / 100,
                paymentMethod: i % 2 === 0 ? 'cod' : 'bank_transfer',
                status: statuses[i],
            });
        }

        // ─── 3. Seed Promo Codes ───
        await supabase.from('promo_codes').insert({
            tenant_id: tenant.id,
            code: 'WELCOME10',
            discount_type: 'percent',
            value: 10,
        });
        await supabase.from('promo_codes').insert({
            tenant_id: tenant.id,
            code: 'FLAT50',
            discount_type: 'fixed',
            value: 50,
        });

        // ─── 4. Update store settings ───
        await tenantRepo.updateTenantSettings(
            tenant.id,
            '+923001234567',   // ownerPhone
            undefined,          // instagram
            undefined,          // facebook
            undefined,          // metaPixel
            'PKR',              // currency
            '#4f46e5',          // themeColor (indigo)
            undefined,          // logoUrl
            true,               // isOpen
            'restaurant'        // storeType
        );

        return NextResponse.json({
            success: true,
            message: `Seeded imtiazstore successfully`,
            data: {
                productsAdded: addedCount,
                ordersAdded: 5,
                promosAdded: 2,
                storeUpdated: true
            }
        });

    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
