import { getAnalyticsRepository, getTenantRepository } from "@/lib/repository";
import { DollarSign, ShoppingBag, TrendingUp, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    const analyticsRepo = getAnalyticsRepository();
    const summary = await analyticsRepo.getSummary(tenant.id);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, {tenant.name}</p>
            </header>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                 <StatCard 
                    title="Total Revenue" 
                    value={`${tenant.currency} ${summary.totalRevenue.toLocaleString()}`} 
                    icon={<DollarSign size={24} className="text-green-600" />}
                    trend="+12% from last month"
                />
                 <StatCard 
                    title="Total Orders" 
                    value={summary.totalOrders.toString()} 
                    icon={<ShoppingBag size={24} className="text-blue-600" />}
                    trend="+5 new today"
                />
                 <StatCard 
                    title="Recent Revenue" 
                    value={`${tenant.currency} ${summary.recentRevenue.toLocaleString()}`} 
                    icon={<TrendingUp size={24} className="text-purple-600" />}
                    trend="Last 30 days"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Link href={`/admin/${slug}/menu`} className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">Update Products</h3>
                        <p className="text-slate-500 text-sm mb-4">Add new items or change prices</p>
                        <div className="flex items-center text-indigo-600 font-semibold text-sm">
                            Go to Catalog <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href={`/admin/${slug}/orders`} className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ClipboardList size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-purple-600">Order Board</h3>
                        <p className="text-slate-500 text-sm mb-4">View and manage active orders</p>
                        <div className="flex items-center text-purple-600 font-semibold text-sm">
                            Open Board <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                    {icon}
                </div>
            </div>
            <div className="text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-1 rounded-lg">
                {trend}
            </div>
        </div>
    );
}
