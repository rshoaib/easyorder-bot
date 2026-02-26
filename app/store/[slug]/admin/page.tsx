import { createClient } from "@/utils/supabase/server";
import OnboardingWizard from "@/components/admin/OnboardingWizard";
import QuickStartGuide from "@/components/admin/QuickStartGuide";
import StoreStatusToggle from "@/components/admin/StoreStatusToggle";

import { getProductRepository, getOrderRepository, getTenantRepository, getAnalyticsRepository } from "@/lib/repository";
import Link from "next/link";
import { DomainSettings } from "@/components/admin/DomainSettings";
import { TrendingUp, ShoppingBag, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import RevenueChart from "@/components/admin/RevenueChart";
import CustomDevCard from "@/components/admin/CustomDevCard";


export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getDashboardData(slug: string) {
  const supabase = await createClient();
  const tenantRepo = getTenantRepository(supabase);
  const tenant = await tenantRepo.getTenantBySlug(slug);
  if (!tenant) return { tenant: null, analytics: null, productCount: 0, chartOrders: [] as { date: string; total: number; status: string }[] };
  
  const analyticsRepo = getAnalyticsRepository(supabase);
  const analytics = await analyticsRepo.getSummary(tenant.id);

  const productRepo = getProductRepository(supabase);
  const products = await productRepo.getProducts(tenant.id);

  // Lightweight orders fetch for revenue chart only
  const orderRepo = getOrderRepository(supabase);
  const orders = await orderRepo.getOrders(tenant.id);
  const chartOrders = orders.map(o => ({ date: o.date, total: o.total, status: o.status || 'pending' }));

  return { tenant, analytics, productCount: products.length, chartOrders };
}

export default async function AdminPage({ params }: Props) {
  const { slug } = await params;
  const { tenant, analytics, productCount, chartOrders } = await getDashboardData(slug);

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
    <main className="container pt-1 pb-10" style={{ maxWidth: '900px' }}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back to {tenant.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/store/${slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors px-3 py-2 bg-white border border-gray-200 rounded-lg">
            👁️ <span className="hidden sm:inline">Preview Store</span><span className="sm:hidden">Preview</span>
          </a>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-2 bg-white border border-gray-200 rounded-lg">
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Mobile: Compact Stats Strip */}
      <div className="lg:hidden mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-700">{analytics?.totalOrders ?? 0}</p>
            <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">Total Orders</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-purple-700">{productCount}</p>
            <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider">Products</p>
          </div>
        </div>
      </div>

      {productCount === 0 && (
        <>
          <OnboardingWizard slug={slug} />
          <CustomDevCard />
        </>
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
                <RevenueChart orders={chartOrders} currency={tenant.currency} />
            </div>
        </div>
      )}

      {/* Domain Settings */}
      <DomainSettings slug={slug} currentDomain={tenant.customDomain} />

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
          <StoreStatusToggle tenantId={tenant.id} slug={slug} isOpen={tenant.isOpen ?? true} />
          <Link href={`/store/${slug}/board`} target="_blank">
              <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
                  Order Board
              </button>
          </Link>
      </div>

      {/* Orders Quick-Link Card */}
      <Link href={`/store/${slug}/admin/orders`} className="block mb-8 group">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ShoppingBag size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Orders</h3>
                          <p className="text-gray-500 text-sm">
                              {analytics ? `${analytics.totalOrders} total orders` : 'View and manage all orders'}
                          </p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
          </div>
      </Link>
    </main>
  );
}
