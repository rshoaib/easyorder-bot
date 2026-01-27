import { getOrderRepository, getTenantRepository } from "@/lib/repository";
import OrderBoard from "@/components/board/OrderBoard";

export default async function OrdersPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    const orderRepo = getOrderRepository();
    const orders = await orderRepo.getOrders(tenant.id);

    return (
        <div className="max-w-7xl mx-auto">
            <OrderBoard orders={orders} slug={slug} />
        </div>
    );
}
