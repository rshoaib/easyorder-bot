import { getOrderRepository, getTenantRepository } from "@/lib/repository";
import { Order } from "@/lib/repository/types";
import Link from "next/link";
import { RefreshCw, ShoppingBag } from 'lucide-react';
import OrderList from '@/components/admin/OrderList';
import ClearStoreOrdersButton from '@/components/admin/ClearStoreOrdersButton';
import { clearStoreOrders } from './actions';
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getOrders(slug: string) {
  // For demo store, use service-role client (bypasses RLS) so anonymous users can see data
  const isDemo = slug === 'demo';
  const supabase = isDemo
    ? createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    : await createClient();
  const tenantRepo = getTenantRepository(supabase);
  const tenant = await tenantRepo.getTenantBySlug(slug);
  if (!tenant) return { orders: [], tenant: null };
  
  const repo = getOrderRepository(supabase);
  const orders = await repo.getOrders(tenant.id);
  
  // Ensure strict date sorting desc
  const sortedOrders = orders.slice().sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return { orders: sortedOrders, tenant };
}


export default async function AdminOrdersPage({ params }: Props) {
  const { slug } = await params;
  const { orders, tenant } = await getOrders(slug);

  if (!tenant) return <div className="p-10">Store not found</div>;

  return (
    <main className="container pt-1 pb-10" style={{ maxWidth: '1000px' }}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-indigo-600" />
                Orders
            </h1>
            <p className="text-gray-500 text-sm">Manage all your incoming orders</p>
         </div>

         <div className="flex items-center gap-3">
             {orders.length > 0 && (
                <ClearStoreOrdersButton
                    slug={slug}
                    orderCount={orders.length}
                    clearAction={clearStoreOrders}
                />
             )}
             <Link href={`/store/${slug}/admin/orders`}>
                <button className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:text-indigo-600 hover:border-indigo-200 transition-colors" title="Refresh list">
                    <RefreshCw size={16} />
                    <span className="hidden md:inline">Refresh</span>
                </button>
             </Link>
         </div>
      </div>

      {/* Orders Table with Search & Filter */}
      <OrderList orders={orders} slug={slug} currency={tenant?.currency} timezone={tenant?.timezone} />
    </main>
  );
}

