import { getTenantRepository } from "@/lib/repository";
import Link from "next/link";
import { createStore, activateTenant, deactivateTenant, setProPlan, downgradePlan } from "./actions";
import { Building2, Plus, ExternalLink, Lock, Star, Clock, TrendingDown, CreditCard } from "lucide-react";
import CopyAllButton from "@/components/admin/CopyableField";
import { Tenant, Subscription } from "@/lib/repository/types";

export const dynamic = 'force-dynamic';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlanBadge(tenant: Tenant) {
    if (tenant.plan !== 'pro') {
        return (
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                FREE
            </span>
        );
    }

    const now = new Date();
    const expiry = tenant.subscriptionEndDate ? new Date(tenant.subscriptionEndDate) : null;
    const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 86400)) : null;

    if (expiry && daysLeft !== null && daysLeft < 0) {
        return (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                <Star size={10} />PRO EXPIRED
            </span>
        );
    }
    if (expiry && daysLeft !== null && daysLeft <= 30) {
        return (
            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                <Clock size={10} />PRO · {daysLeft}d left
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
            <Star size={10} />PRO
        </span>
    );
}

function formatDate(dateStr?: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAmount(amount?: number) {
    if (!amount) return '—';
    return `PKR ${amount.toLocaleString('en-PK')}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SuperAdminPage() {
    // Auth: Accept either httpOnly cookie (set by /api/auth/login with master password)
    // OR Supabase Auth with the super admin email
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';

    if (!hasSuperAuth) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const SUPER_ADMIN_EMAIL = "segmentibi@gmail.com";
        if (!user || user.email !== SUPER_ADMIN_EMAIL) {
            redirect("/super-admin/login");
        }
    }

    const repo = getTenantRepository();
    const tenants = await repo.getAllTenants();

    // Load subscriptions for all tenants
    const allSubscriptions: Array<Subscription & { tenantName: string }> = [];
    for (const tenant of tenants) {
        const subs = await repo.getSubscriptions(tenant.id);
        subs.forEach(s => allSubscriptions.push({ ...s, tenantName: tenant.name }));
    }
    // Sort by most recent first
    allSubscriptions.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const proCount = tenants.filter(t => t.plan === 'pro').length;
    const totalRevenuePkr = allSubscriptions.reduce((sum, s) => sum + (s.amountPkr || 0), 0);

    return (
        <main className="min-h-screen bg-slate-50 relative overflow-hidden pb-24">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-indigo-900 z-0 shadow-xl" />

            <div className="max-w-6xl mx-auto px-6 relative z-10 pt-12 text-white">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                <Building2 size={24} className="text-white" />
                            </div>
                            <span className="text-sm font-medium tracking-wider uppercase text-blue-200">System Admin</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Platform Dashboard</h1>
                        <p className="text-blue-200 mt-2 text-lg">Manage stores & subscriptions from one command center.</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { label: 'Total Stores', value: tenants.length, icon: Building2, color: 'from-blue-500 to-blue-600' },
                        { label: 'Pro Subscribers', value: proCount, icon: Star, color: 'from-indigo-500 to-purple-600' },
                        { label: 'Total Revenue', value: `PKR ${totalRevenuePkr.toLocaleString('en-PK')}`, icon: CreditCard, color: 'from-emerald-500 to-teal-600' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-lg text-white`}>
                            <div className="flex items-center gap-2 mb-1 opacity-80">
                                <Icon size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                            </div>
                            <div className="text-3xl font-extrabold">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Create New Store Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-gray-900">
                            <div className="bg-gray-50 p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Plus size={20} className="text-indigo-600" /> New Restaurant
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Launch a new store in seconds.</p>
                            </div>

                            <div className="p-6">
                                <form action={createStore} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Restaurant Name</label>
                                        <input name="name" required placeholder="e.g. Pizza Palace"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Owner Email</label>
                                        <input name="email" type="email" required placeholder="owner@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Slug</label>
                                        <input name="slug" required placeholder="e.g. pizza-palace"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium font-mono text-sm" />
                                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                            <ExternalLink size={10} />
                                            <span>accessible at </span>
                                            <span className="font-mono text-indigo-500 bg-indigo-50 px-1 rounded">/store/pizza-palace</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Login Password</label>
                                        <div className="relative">
                                            <input name="password" required placeholder="Secret123"
                                                className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium" />
                                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button type="submit"
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                            Launch Store <Plus size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Stores List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold bg-white/10 backdrop-blur-sm p-2 rounded-lg inline-block text-white">
                                Active Stores <span className="ml-2 bg-white text-indigo-900 px-2 py-0.5 rounded-md text-sm">{tenants.length}</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                    {/* Tenant Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                <Building2 size={22} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{tenant.name}</h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    {getPlanBadge(tenant)}
                                                    <span className={`w-2 h-2 rounded-full ${tenant.status === 'active' ? 'bg-green-500 animate-pulse' : tenant.status === 'pending_payment' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                                    <span className="text-xs text-gray-400 uppercase font-semibold">
                                                        {tenant.status === 'active' ? 'Live' : tenant.status === 'pending_payment' ? 'Pending' : 'Off'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activate/Deactivate */}
                                        {tenant.status !== 'active' ? (
                                            <form action={activateTenant}>
                                                <input type="hidden" name="id" value={tenant.id} />
                                                <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors">Activate</button>
                                            </form>
                                        ) : (
                                            <form action={deactivateTenant}>
                                                <input type="hidden" name="id" value={tenant.id} />
                                                <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors">Deactivate</button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Subscription expiry info (pro only) */}
                                    {tenant.plan === 'pro' && tenant.subscriptionEndDate && (
                                        <div className="bg-indigo-50 rounded-lg px-3 py-1.5 mb-3 flex items-center justify-between text-xs text-indigo-700 font-medium">
                                            <span>Subscription</span>
                                            <span>{formatDate(tenant.subscriptionStartDate)} → {formatDate(tenant.subscriptionEndDate)}</span>
                                        </div>
                                    )}

                                    {/* Slug + Password Row */}
                                    <div className="bg-gray-50 rounded-xl p-3 mb-3 font-mono text-xs text-gray-500 flex justify-between items-center border border-gray-100">
                                        <span className="truncate max-w-[120px]" title={tenant.slug}>/store/{tenant.slug}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Pass:</span>
                                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">••••••</span>
                                        </div>
                                    </div>

                                    {/* Copy button */}
                                    <div className="mb-3">
                                        <CopyAllButton storeName={tenant.name} email={tenant.email} phone={tenant.ownerPhone} />
                                    </div>

                                    {/* Set Pro Plan Form */}
                                    <details className="mb-3 group/pro">
                                        <summary className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors list-none">
                                            <Star size={14} />
                                            {tenant.plan === 'pro' ? 'Update Pro Plan' : 'Set Pro Plan'}
                                            <span className="ml-auto text-gray-400 group-open/pro:rotate-180 transition-transform">▾</span>
                                        </summary>
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <form action={setProPlan} className="space-y-3">
                                                <input type="hidden" name="id" value={tenant.id} />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (PKR)</label>
                                                        <input name="amountPkr" type="number" min="0" placeholder="e.g. 30000"
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Date</label>
                                                        <input name="paymentDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]}
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 outline-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (months)</label>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {[6, 12, 24].map(mo => (
                                                            <label key={mo} className="flex-1">
                                                                <input type="radio" name="durationMonths" value={mo} defaultChecked={mo === 12} className="sr-only peer" />
                                                                <span className="block text-center text-xs font-bold py-1.5 rounded-lg border border-gray-200 cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 hover:border-indigo-300 transition-colors">
                                                                    {mo}mo
                                                                </span>
                                                            </label>
                                                        ))}
                                                        <input name="durationMonths" type="number" min="1" placeholder="Custom" style={{ display: 'none' }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                                                    <input name="notes" placeholder="e.g. 2-year special discount deal"
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 outline-none" />
                                                </div>
                                                <button type="submit"
                                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2">
                                                    <Star size={14} /> Activate Pro
                                                </button>
                                            </form>

                                            {/* Downgrade to Free */}
                                            {tenant.plan === 'pro' && (
                                                <form action={downgradePlan} className="mt-2">
                                                    <input type="hidden" name="id" value={tenant.id} />
                                                    <button type="submit" className="w-full py-1.5 text-xs text-gray-500 hover:text-red-600 font-semibold flex items-center justify-center gap-1 transition-colors">
                                                        <TrendingDown size={12} /> Downgrade to Free
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </details>

                                    {/* Visit / Admin buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/store/${tenant.slug}`} target="_blank">
                                            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-all">
                                                <ExternalLink size={16} /> Visit
                                            </button>
                                        </Link>
                                        <Link href={`/store/${tenant.slug}/admin`} target="_blank">
                                            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gray-900 hover:bg-black px-4 py-2.5 rounded-xl transition-all shadow-md shadow-gray-200">
                                                <Lock size={16} /> Admin
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Subscription History ─────────────────────────────────────────── */}
                <div className="mt-16">
                    <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg"><CreditCard size={22} /></div>
                        Subscription History <span className="ml-2 bg-white text-indigo-900 px-3 py-0.5 rounded-md text-base font-bold">{allSubscriptions.length}</span>
                    </h2>

                    {allSubscriptions.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm">
                            No subscription records yet. Activate a Pro plan above.
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <table className="w-full text-sm text-gray-700">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Store</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Plan</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Amount</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Payment Date</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Period</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {allSubscriptions.map((sub) => {
                                        const isExpired = new Date(sub.endDate) < new Date();
                                        const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000);
                                        return (
                                            <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 font-semibold text-gray-900">{sub.tenantName}</td>
                                                <td className="px-5 py-3">
                                                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                                        <Star size={9} />{sub.plan.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-emerald-700">{formatAmount(sub.amountPkr)}</td>
                                                <td className="px-5 py-3 text-gray-500">{formatDate(sub.paymentDate)}</td>
                                                <td className="px-5 py-3">
                                                    <div className="text-xs">
                                                        <div className="text-gray-600">{formatDate(sub.startDate)} → {formatDate(sub.endDate)}</div>
                                                        <div className={`font-semibold mt-0.5 ${isExpired ? 'text-red-500' : daysLeft <= 30 ? 'text-yellow-500' : 'text-green-600'}`}>
                                                            {isExpired ? 'Expired' : `${daysLeft}d remaining`}
                                                            {sub.durationMonths ? ` (${sub.durationMonths}mo)` : ''}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-gray-400 text-xs max-w-[200px] truncate">{sub.notes || '—'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
