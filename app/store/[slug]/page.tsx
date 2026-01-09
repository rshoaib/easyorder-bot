import { getProductRepository, getTenantRepository } from "@/lib/repository";
import StoreFront from "@/components/StoreFront";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function StorePage({ params }: Props) {
    const { slug } = await params;
    
    // DEMO MODE HANDLER
    if (slug === 'demo') {
        const demoTenant: any = {
            id: 'demo-123',
            slug: 'demo',
            name: 'Pizza Demo 🍕',
            ownerPhone: '1234567890',
            currency: 'USD',
            themeColor: '#e11d48',
            status: 'active',
            language: 'en'
        };

        const demoProducts: any[] = [
             {
                id: 'p1',
                tenantId: 'demo-123',
                name: 'Pepperoni Feast',
                category: 'Pizza',
                price: 14,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
            {
                id: 'p2',
                tenantId: 'demo-123',
                name: 'Classic Burger',
                category: 'Burgers',
                price: 12,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
            {
                id: 'p3',
                tenantId: 'demo-123',
                name: 'Caesar Salad',
                category: 'Salads',
                price: 9,
                image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
             {
                id: 'p4',
                tenantId: 'demo-123',
                name: 'Fresh Sushi Platter',
                category: 'Sushi',
                price: 24,
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
                isAvailable: false
            },
            {
                id: 'p5',
                tenantId: 'demo-123',
                name: 'Tiramisu',
                category: 'Dessert',
                price: 8,
                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
            {
                id: 'p6',
                tenantId: 'demo-123',
                name: 'Fresh Orange Juice',
                category: 'Drinks',
                price: 5,
                image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
            {
                id: 'p7',
                tenantId: 'demo-123',
                name: 'Creamy Carbonara',
                category: 'Pasta',
                price: 16,
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
            {
                id: 'p8',
                tenantId: 'demo-123',
                name: 'Ribeye Steak',
                category: 'Steak',
                price: 32,
                image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
            {
                id: 'p9',
                tenantId: 'demo-123',
                name: 'Chocolate Lava Cake',
                category: 'Dessert',
                price: 9,
                image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            },
             {
                id: 'p10',
                tenantId: 'demo-123',
                name: 'Iced Caramel Latte',
                category: 'Drinks',
                price: 6,
                image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&w=800&q=80',
                isAvailable: true
            }
        ];

        return <StoreFront initialProducts={demoProducts} tenant={demoTenant} />;
    }

    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
                <p className="text-gray-500">The store "{slug}" does not exist.</p>
            </div>
        );
    }

    const repo = getProductRepository();
    const products = await repo.getProducts(tenant.id);

    // We can pass tenant details to StoreFront for branding if we want later (name, theme color)
    return <StoreFront initialProducts={products} tenant={tenant} />; 
}
