import { getOrderRepository, getTenantRepository } from "@/lib/repository";
import OrderBoard from "@/components/board/OrderBoard";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function OrderBoardPage({ params }: Props) {
    const { slug } = await params;
    
    const supabase = await createClient();
    const tenantRepo = getTenantRepository(supabase);
    const tenant = await tenantRepo.getTenantBySlug(slug);
    
    if (!tenant) return <div>Store not found</div>;

    const repo = getOrderRepository(supabase);
    const allOrders = await repo.getOrders(tenant.id);

    
    // Filter for active orders only
    const activeOrders = allOrders
        .filter(o => ['pending', 'preparing'].includes(o.status))
        // Oldest first (FIFO)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return <OrderBoard orders={activeOrders} slug={slug} storeType={tenant.storeType || 'restaurant'} />;
}
