import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from '@supabase/supabase-js';
import OnboardingWizard from "@/components/admin/OnboardingWizard";
import QuickStartGuide from "@/components/admin/QuickStartGuide";
import StoreStatusToggle from "@/components/admin/StoreStatusToggle";

import { getProductRepository, getOrderRepository, getTenantRepository, getAnalyticsRepository } from "@/lib/repository";
import Link from "next/link";
import { DomainSettings } from "@/components/admin/DomainSettings";
import { TrendingUp, ShoppingBag, DollarSign, AlertCircle, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import RevenueChart from "@/components/admin/RevenueChart";
import CustomDevCard from "@/components/admin/CustomDevCard";
import TimezoneAutoDetect from "@/components/admin/TimezoneAutoDetect";
import UpgradeProBanner from "@/components/admin/UpgradeProBanner";


export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getDashboardData(slug: string) {
  // For demo store, use service-role client (bypasses RLS) so anonymous users can see data
  const isDemo = slug === 'demo';
  const supabase = isDemo
    ? createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    : await createClient();
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

  // Owner-only access check (skip for demo store — public showcase)
  if (slug !== 'demo') {
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
  }

  return (
    <main className="container pt-1 pb-10" style={{ maxWidth: '900px' }}>
      {/* Silent timezone auto-detection — no UI, runs once */}
      <TimezoneAutoDetect tenantId={tenant.id} slug={slug} currentTimezone={tenant.timezone} />
      
      {/* Upgrade to Pro banner — only for non-pro merchants */}
      {slug !== 'demo' && tenant.plan !== 'pro' && (
        <UpgradeProBanner tenantId={tenant.id} slug={slug} />
      )}
      
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

      {/* Store Open/Close Toggle — most used action, always visible */}
      <div className="mb-4">
          <StoreStatusToggle tenantId={tenant.id} slug={slug} isOpen={tenant.isOpen ?? true} />
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

      {/* Fix 2: Keep Going momentum strip — shown when 1-4 products exist */}
      {productCount > 0 && productCount < 5 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl animate-in fade-in duration-500">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <h3 className="font-bold text-indigo-900">Great start! Keep going 🚀</h3>
                <p className="text-sm text-indigo-700 mt-0.5">
                  You have <strong>{productCount}</strong> item{productCount === 1 ? '' : 's'}. Most successful stores have <strong>5–10 items</strong> before sharing.
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap shrink-0">
              <Link href={`/store/${slug}/admin/menu`}>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
                  + Add More Items
                </button>
              </Link>
              <Link href={`/store/${slug}`} target="_blank">
                <button className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 px-3 py-2.5 rounded-xl transition-colors">
                  Preview <ExternalLink size={13} />
                </button>
              </Link>
            </div>
          </div>
          {/* Mini progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-indigo-500 mb-1">
              <span>Catalog completeness</span>
              <span className="font-bold">{productCount}/5 items</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.round((productCount / 5) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Fix 5: "Your Store is Live!" banner — shown for fresh stores with products but no orders */}
      {productCount > 0 && analytics.totalOrders === 0 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl animate-in fade-in duration-500">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">🎉</div>
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">Your store is live!</h3>
                <p className="text-sm text-emerald-700 mt-0.5">
                  <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 text-xs">
                    orderviachat.com/store/{slug}
                  </span>
                  <span className="ml-2">— share this link to start receiving orders!</span>
                </p>
              </div>
            </div>
            <Link href={`/store/${slug}`} target="_blank">
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shrink-0">
                Preview Your Store <ExternalLink size={14} />
              </button>
            </Link>
          </div>
        </div>
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

      {/* Fix 6: Store too sparse warning (shown for 1-4 products, when WhatsApp IS set) */}
      {productCount >= 1 && productCount < 5 && !!tenant.ownerPhone && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <span className="font-bold">Your store only has {productCount} item{productCount === 1 ? '' : 's'}.</span>{' '}
            Customers expect 5–8 products. Add more before sharing the link!
          </p>
          <Link href={`/store/${slug}/admin/menu`} className="shrink-0">
            <button className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors">
              Add More →
            </button>
          </Link>
        </div>
      )}


      {/* Analytics & Revenue Chart */}
      {analytics && analytics.totalOrders > 0 ? (
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
      ) : analytics && productCount > 0 ? (
        <div className="mb-8 p-10 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-2 mx-auto">
            <ShoppingBag size={36} className="animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Waiting for your first order! 🚀</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              Share your store link on WhatsApp, Instagram, or Facebook to get your first customer. Your analytics will appear here once orders start rolling in.
            </p>
          </div>
          <Link href={`/store/${slug}`} target="_blank">
            <button className="mt-4 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center gap-2">
              Preview Store <ExternalLink size={16} />
            </button>
          </Link>
        </div>
      ) : null}

      {/* Domain Settings */}
      <DomainSettings slug={slug} currentDomain={tenant.customDomain} />

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
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
