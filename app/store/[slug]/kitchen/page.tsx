import { getOrderRepository, getTenantRepository } from "@/lib/repository";
import KitchenBoard from "@/components/kitchen/KitchenBoard";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function KitchenPage({ params }: Props) {
    const { slug } = await params;
    
    // Auth Check (Same as admin)
    // In a real app we'd use middleware, but for now we assume this path is secure-ish
    
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);
    
    if (!tenant) return <div>Store not found</div>;

    const repo = getOrderRepository();
    const allOrders = await repo.getOrders(tenant.id);
    
    // Filter for active orders only
    const activeOrders = allOrders
        .filter(o => ['pending', 'preparing'].includes(o.status))
        // Oldest first for kitchen (FIFO)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return <KitchenBoard orders={activeOrders} slug={slug} />;
}
