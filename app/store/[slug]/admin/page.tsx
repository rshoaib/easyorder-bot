import { createClient } from "@/utils/supabase/server";
import OnboardingWizard from "@/components/admin/OnboardingWizard";
import QuickStartGuide from "@/components/admin/QuickStartGuide";
import StoreStatusToggle from "@/components/admin/StoreStatusToggle";
import { Download, Cloud } from 'lucide-react';

import { getProductRepository, getOrderRepository, getTenantRepository, getAnalyticsRepository } from "@/lib/repository";
import { Order } from "@/lib/repository/types";
import Link from "next/link";
import { LanguageSelector } from "@/components/admin/LanguageSelector";
import { DomainSettings } from "@/components/admin/DomainSettings";
import { FileText, RefreshCw, ArrowLeft, TrendingUp, ShoppingBag, DollarSign, Tag, Settings, Menu, Share2, AlertCircle } from 'lucide-react';
import StatusSelector from '@/components/admin/StatusSelector';
import RevenueChart from "@/components/admin/RevenueChart";
import OrderList from "@/components/admin/OrderList";

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getOrders(slug: string) {
  const supabase = await createClient();
  const tenantRepo = getTenantRepository(supabase);
  const tenant = await tenantRepo.getTenantBySlug(slug);
  if (!tenant) return { orders: [], tenant: null, analytics: null, productCount: 0 };
  
  const repo = getOrderRepository(supabase);
  const orders = await repo.getOrders(tenant.id);
  
  const analyticsRepo = getAnalyticsRepository(supabase);
  const analytics = await analyticsRepo.getSummary(tenant.id);

  const productRepo = getProductRepository(supabase);
  const products = await productRepo.getProducts(tenant.id);

  // Ensure strict date sorting desc
  const sortedOrders = orders.slice().sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return { orders: sortedOrders, tenant, analytics, productCount: products.length };
}

export default async function AdminPage({ params }: Props) {
  const { slug } = await params;
  const { orders, tenant, analytics, productCount } = await getOrders(slug);

  if (!tenant) return <div className="p-10">Store not found</div>;

  // Owner-only access check
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user || tenant.userId !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-3">⛔ Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to manage this store. Only the store owner can access the admin panel.</p>
          <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-block">Go to Homepage</a>
        </div>
      </div>
    );
  }

  return (
    <main className="container pt-6 pb-10" style={{ maxWidth: '900px' }}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back to {tenant.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/store/${slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors px-3 py-2 bg-white border border-gray-200 rounded-lg">
            👁️ Preview Store
          </a>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-2 bg-white border border-gray-200 rounded-lg">
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {productCount === 0 && (
          <OnboardingWizard slug={slug} />
      )}

      <QuickStartGuide tenant={tenant} productCount={productCount} slug={slug} />

      {/* Missing WhatsApp Number Warning */}
      {!tenant.ownerPhone && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl animate-fade-in">
              <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-full shrink-0 mt-0.5">
                      <AlertCircle size={22} />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-bold text-amber-900 text-base">⚠️ Your WhatsApp number is not set!</h3>
                      <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                          Customers <strong>cannot send you orders</strong> without a WhatsApp number. 
                          This is the most important setting for your store.
                      </p>
                      <Link href={`/store/${slug}/admin/settings`}>
                          <button className="mt-3 px-5 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
                              Set WhatsApp Number Now →
                          </button>
                      </Link>
                  </div>
              </div>
          </div>
      )}


      {/* Action Items Widget */}
      {orders.filter((o: any) => o.status === 'pending').length > 0 && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                      <AlertCircle size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-amber-900">Action Needed</h3>
                      <p className="text-amber-700 text-sm">
                          You have {orders.filter((o: any) => o.status === 'pending').length} pending orders to confirm.
                      </p>
                  </div>
              </div>
              <Link href="#orders-table">
                  <button className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
                      View Orders
                  </button>
              </Link>
          </div>
      )}

      {/* Analytics & Revenue Chart */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Col: KPI Cards */}
            <div className="space-y-4">
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

            {/* Right Col: Revenue Chart (Spans 2 cols) */}
            <div className="lg:col-span-2">
                <RevenueChart orders={orders} currency={tenant.currency} />
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
                 <Link href={`/store/${slug}/admin/marketing`}>
                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                        <Share2 size={16} />
                        Marketing
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

      {/* Orders List */}
      <OrderList orders={orders} slug={slug} currency={tenant?.currency} />
    </main>
  );
}
