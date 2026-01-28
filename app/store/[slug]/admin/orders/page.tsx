import { getOrderRepository, getTenantRepository } from "@/lib/repository";
import { Order } from "@/lib/repository/types";
import Link from "next/link";
import StatusSelector from '@/components/admin/StatusSelector';
import { FileText, RefreshCw, ShoppingBag, Cloud } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getOrders(slug: string) {
  const tenantRepo = getTenantRepository();
  const tenant = await tenantRepo.getTenantBySlug(slug);
  if (!tenant) return { orders: [], tenant: null };
  
  const repo = getOrderRepository();
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
    <main className="container pt-6 pb-10" style={{ maxWidth: '1000px' }}>
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
             <Link href={`/store/${slug}/admin/orders`}>
                <button className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:text-indigo-600 hover:border-indigo-200 transition-colors" title="Refresh list">
                    <RefreshCw size={16} />
                    <span className="hidden md:inline">Refresh</span>
                </button>
             </Link>
         </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-sm font-medium text-gray-900 align-top">
                      <div><span className="text-gray-400">#</span>{order.id.replace('ORD-', '')}</div>
                      {order.items.some((i: any) => i.type === 'digital') && (
                          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 w-fit">
                              <Cloud size={10} /> Digital
                          </div>
                      )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 align-top">
                    <div className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <div className="font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-xs text-gray-500 font-mono mb-1">{order.customer.phone}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]" title={order.customer.address}>{order.customer.address}</div>
                  </td>
                  <td className="py-4 px-6 align-top">
                      <div className="text-sm text-gray-600 space-y-1">
                          {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-2">
                                  <span className="font-bold text-gray-900">{item.quantity}x</span>
                                  <span className="truncate max-w-[150px]">{item.name}</span>
                              </div>
                          ))}
                      </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-900 align-top">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center align-top">
                    <StatusSelector orderId={order.id} currentStatus={order.status || 'pending'} slug={slug} />
                  </td>
                  <td className="py-4 px-6 text-center align-top">
                    <a 
                      href={`/api/invoice/${order.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                      title="View PDF Invoice"
                    >
                      <FileText size={18} />
                    </a>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <ShoppingBag size={20} />
                        </div>
                        <p>No orders received yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
