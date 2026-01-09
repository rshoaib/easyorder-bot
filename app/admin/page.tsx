import { getOrderRepository } from "@/lib/repository";
import Link from 'next/link';
import { FileText, RefreshCw, ArrowLeft, MoreHorizontal } from 'lucide-react';

// Force dynamic rendering ensures we always fetch the latest data from DB
export const dynamic = 'force-dynamic';

async function getOrders() {
  const repo = getOrderRepository();
  return await repo.getOrders();
}

export default async function AdminPage() {
  const orders = await getOrders();
  // Ensure strict date sorting desc
  const sortedOrders = orders.slice().sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="container pt-6 pb-10" style={{ maxWidth: '900px' }}>
      {/* Header Section */}
      <div className="flex justify-between mb-8 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
           <p className="text-gray-500 text-sm">Manage your store orders</p>
        </div>
        <Link href="/">
           <button className="btn-secondary">
             <ArrowLeft size={16} />
             Back to Shop
           </button>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex justify-between mb-4 items-center px-2">
         <h2 className="text-lg font-bold flex items-center gap-2">
            Recent Orders 
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs box-border">{orders.length}</span>
         </h2>
         <Link href="/admin">
            <button className="btn-secondary" title="Check for new orders">
              <RefreshCw size={14} />
              Refresh
            </button>
         </Link>
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
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-sm font-medium text-gray-900">
                      <span className="text-gray-400">#</span>{order.id.replace('ORD-', '')}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{order.customer.phone}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{order.customer.address}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
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
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <FileText size={20} />
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
