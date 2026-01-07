import { getOrderRepository } from "@/lib/repository";
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getOrders() {
  const repo = getOrderRepository();
  return await repo.getOrders();
}

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <main className="container pt-6 pb-10">
      <div className="flex-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/">
           <button className="btn btn-primary bg-gray-800 hover:bg-black" style={{ backgroundColor: '#1e293b' }}>Back to Shop</button>
        </Link>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="flex-between mb-4">
          <h2 className="text-lg font-bold">Recent Orders ({orders.length})</h2>
          {/* Mock Export Button (UI only for MVP, or implementing client-side logic would require a client component) */}
          <button className="btn border border-gray-300">Export CSV</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Customer</th>
                <th className="py-2 px-2">Total</th>
                <th className="py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice().reverse().map((order: any) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-3 px-2 font-mono text-sm">{order.id}</td>
                  <td className="py-3 px-2 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.customer.phone}</div>
                  </td>
                  <td className="py-3 px-2 font-bold">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
