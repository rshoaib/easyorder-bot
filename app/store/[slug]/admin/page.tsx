import OnboardingWizard from "@/components/admin/OnboardingWizard";
import StoreStatusToggle from "@/components/admin/StoreStatusToggle";
import { Download, Cloud } from 'lucide-react';

import { getProductRepository, getOrderRepository, getTenantRepository, getAnalyticsRepository } from "@/lib/repository";
import { Order } from "@/lib/repository/types";
import Link from "next/link";
import { LanguageSelector } from "@/components/admin/LanguageSelector";
import { DomainSettings } from "@/components/admin/DomainSettings";
import { FileText, RefreshCw, ArrowLeft, TrendingUp, ShoppingBag, DollarSign, Tag, Settings, Menu } from 'lucide-react';
import StatusSelector from '@/components/admin/StatusSelector';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getOrders(slug: string) {
  const tenantRepo = getTenantRepository();
  const tenant = await tenantRepo.getTenantBySlug(slug);
  if (!tenant) return { orders: [], tenant: null, analytics: null, productCount: 0 };
  
  const repo = getOrderRepository();
  const orders = await repo.getOrders(tenant.id);
  
  const analyticsRepo = getAnalyticsRepository();
  const analytics = await analyticsRepo.getSummary(tenant.id);

  const productRepo = getProductRepository();
  const products = await productRepo.getProducts(tenant.id);

  // Ensure strict date sorting desc
  const sortedOrders = orders.slice().sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return { orders: sortedOrders, tenant, analytics, productCount: products.length };
}

export default async function AdminPage({ params }: Props) {
  const { slug } = await params;
  const { orders, tenant, analytics, productCount } = await getOrders(slug);

  if (!tenant) return <div className="p-10">Store not found</div>;

  return (
    <main className="container pt-6 pb-10" style={{ maxWidth: '900px' }}>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back to {tenant.name}</p>
      </div>

      {productCount === 0 && (
          <OnboardingWizard slug={slug} />
      )}


      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                    <span className="text-sm font-medium">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 ml-1">{tenant.currency}{analytics.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={20} /></div>
                    <span className="text-sm font-medium">Total Orders</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 ml-1">{analytics.totalOrders}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 text-gray-500 mb-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={20} /></div>
                    <span className="text-sm font-medium">Last 30 Days</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 ml-1">{tenant.currency}{analytics.recentRevenue.toLocaleString()}</div>
            </div>
        </div>
      )}

      {/* Domain Settings */}
      <DomainSettings slug={slug} currentDomain={tenant.customDomain} />

      {/* Main Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
               <Link href={`/store/${slug}/board`} target="_blank">
                  <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
                      Order Board
                  </button>
               </Link>
               <StoreStatusToggle tenantId={tenant.id} slug={slug} isOpen={tenant.isOpen ?? true} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
                 <Link href={`/store/${slug}/admin/menu`}>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
                        <Menu size={16} />
                        Product Catalog
                    </button>
                 </Link>
                 <Link href={`/store/${slug}/admin/promos`}>
                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                        <Tag size={16} />
                        Promos
                    </button>
                 </Link>
                 <Link href={`/store/${slug}/admin/settings`}>
                    <button className="flex items-center gap-2 pl-3 pr-4 py-2.5 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm text-sm font-medium" title="Store Settings">
                        <Settings size={18} /> Settings
                    </button>
                 </Link>
          </div>
      </div>

      {/* Recent Orders Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-4 gap-4">
         <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            Recent Orders 
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200">{orders.length}</span>
         </h2>
         
         <div className="flex items-center gap-3">
             <LanguageSelector slug={slug} currentLanguage={tenant.language} />
             <Link href={`/store/${slug}/admin`}>
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
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6 font-mono text-sm font-medium text-gray-900">
                      <span className="text-gray-400">#</span>{order.id.replace('ORD-', '')}
                      {order.items.some((i: any) => i.type === 'digital') && (
                          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 w-fit">
                              <Cloud size={10} /> Digital
                          </div>
                      )}
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
                    <StatusSelector orderId={order.id} currentStatus={order.status || 'pending'} slug={slug} />
                  </td>
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
                  <td colSpan={6} className="py-16 text-center text-gray-500">
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
