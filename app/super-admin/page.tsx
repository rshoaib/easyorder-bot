import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getTenantRepository } from "@/lib/repository";
import Link from "next/link";
import CopyButton from "@/components/ui/CopyButton";
import { createStore, activateTenant, deactivateTenant, setProPlan, downgradePlan } from "./actions";
import { Tenant, Subscription } from "@/lib/repository/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

// ─── Helpers ────────────────────────────────────────────────────────────────

function planBadge(tenant: Tenant) {
    if (tenant.plan !== 'pro') {
        return <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">FREE</span>;
    }
    const now = new Date();
    const expiry = tenant.subscriptionEndDate ? new Date(tenant.subscriptionEndDate) : null;
    const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / 86400000) : null;
    if (daysLeft !== null && daysLeft < 0) {
        return <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">⭐ PRO (Expired)</span>;
    }
    if (daysLeft !== null && daysLeft <= 30) {
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">⭐ PRO · {daysLeft}d left</span>;
    }
    if (expiry) {
        return <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">⭐ PRO · till {expiry.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>;
    }
    return <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">⭐ PRO</span>;
}

function fmt(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SuperAdminPage() {
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';

    if (!hasSuperAuth) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== "segmentibi@gmail.com") redirect("/super-admin/login");
    }

    // Use service role to bypass RLS for both tenants and subscriptions
    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const repo = getTenantRepository(adminClient);
    const tenants = await repo.getAllTenants();

    // Load ALL subscriptions in one query (no N+1)
    const { data: rawSubs } = await adminClient
        .from('subscriptions')
        .select('*, tenants(name)')
        .order('created_at', { ascending: false });

    const allSubs = (rawSubs || []).map((s: any) => ({
        id: s.id,
        tenantId: s.tenant_id,
        tenantName: s.tenants?.name || '—',
        plan: s.plan,
        amountPkr: s.amount_pkr,
        paymentDate: s.payment_date,
        startDate: s.start_date,
        endDate: s.end_date,
        durationMonths: s.duration_months,
        notes: s.notes,
        createdAt: s.created_at,
    }));

    const proCount = tenants.filter(t => t.plan === 'pro').length;
    const totalRevenue = allSubs.reduce((sum: number, s: any) => sum + (s.amountPkr || 0), 0);

    const today = new Date().toISOString().split('T')[0];

    return (
        <main className="min-h-screen bg-slate-100 pb-20">
            {/* Top bar */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-1">Super Admin</h1>
                    <p className="text-indigo-200 text-sm">Platform management &amp; subscription control</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        {[
                            { label: 'Total Stores', value: tenants.length },
                            { label: 'Pro Subscribers', value: proCount },
                            { label: 'Total Revenue', value: `PKR ${totalRevenue.toLocaleString('en-PK')}` },
                        ].map(s => (
                            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-5 py-4">
                                <div className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">{s.label}</div>
                                <div className="text-2xl font-extrabold">{s.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left — Create Store */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-100 px-5 py-4">
                            <h2 className="font-bold text-gray-900">➕ New Restaurant</h2>
                        </div>
                        <div className="p-5">
                            <form action={createStore} className="space-y-4">
                                {[
                                    { name: 'name', label: 'Restaurant Name', placeholder: 'Pizza Palace', type: 'text' },
                                    { name: 'email', label: 'Owner Email', placeholder: 'owner@example.com', type: 'email' },
                                    { name: 'slug', label: 'URL Slug', placeholder: 'pizza-palace', type: 'text' },
                                    { name: 'password', label: 'Login Password', placeholder: '••••••', type: 'password' },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                                        <input name={f.name} type={f.type} required placeholder={f.placeholder}
                                            className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 outline-none transition" />
                                    </div>
                                ))}
                                <button type="submit"
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition">
                                    Launch Store
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right — Stores + Subscriptions */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Stores table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900">🏪 Stores ({tenants.length})</h2>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {tenants.map(tenant => {
                                const isPro = tenant.plan === 'pro';
                                return (
                                    <div key={tenant.id} className="px-5 py-5">
                                        {/* Header row */}
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shrink-0">
                                                    {tenant.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-900 truncate">{tenant.name}</div>
                                                    <div className="text-xs text-gray-400 font-mono truncate">/store/{tenant.slug}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {planBadge(tenant)}
                                                <span className={`w-2 h-2 rounded-full mt-0.5 ${tenant.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            </div>
                                        </div>

                                        {/* Contact row */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            <CopyButton text={tenant.name} label="store name" icon="🏪" />
                                            {tenant.email && <CopyButton text={tenant.email} label="email" icon="📧" />}
                                            {tenant.ownerPhone && <CopyButton text={tenant.ownerPhone} label="phone" icon="📱" />}
                                            {tenant.ownerPhone && (
                                                <a
                                                    href={`https://wa.me/${tenant.ownerPhone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all active:scale-95"
                                                    title="Open WhatsApp"
                                                >
                                                    <span>💬</span>
                                                    <span>WhatsApp</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Link href={`/store/${tenant.slug}`} target="_blank">
                                                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer">Visit →</span>
                                            </Link>
                                            <Link href={`/store/${tenant.slug}/admin`} target="_blank">
                                                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black transition cursor-pointer">Admin →</span>
                                            </Link>
                                            {tenant.status !== 'active' ? (
                                                <form action={activateTenant} className="inline">
                                                    <input type="hidden" name="id" value={tenant.id} />
                                                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">✓ Activate</button>
                                                </form>
                                            ) : (
                                                <form action={deactivateTenant} className="inline">
                                                    <input type="hidden" name="id" value={tenant.id} />
                                                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition">Deactivate</button>
                                                </form>
                                            )}
                                            {isPro && (
                                                <form action={downgradePlan} className="inline">
                                                    <input type="hidden" name="id" value={tenant.id} />
                                                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition">↓ Downgrade to Free</button>
                                                </form>
                                            )}
                                        </div>

                                        {/* ── Set Pro Plan Form ─────────────────────────── */}
                                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                            <div className="text-xs font-bold text-indigo-700 mb-3 uppercase tracking-wider">
                                                {isPro ? '⭐ Update Pro Plan' : '⭐ Activate Pro Plan'}
                                            </div>
                                            <form action={setProPlan}>
                                                <input type="hidden" name="id" value={tenant.id} />
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    {/* Amount */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-indigo-800 mb-1">Amount (PKR)</label>
                                                        <input
                                                            name="amountPkr"
                                                            type="number"
                                                            min="0"
                                                            step="100"
                                                            placeholder="e.g. 30000"
                                                            className="w-full text-sm px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition font-semibold"
                                                        />
                                                    </div>
                                                    {/* Payment Date */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-indigo-800 mb-1">Payment Date</label>
                                                        <input
                                                            name="paymentDate"
                                                            type="date"
                                                            required
                                                            defaultValue={today}
                                                            className="w-full text-sm px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Duration — select dropdown (no radio conflicts) */}
                                                <div className="mb-3">
                                                    <label className="block text-xs font-semibold text-indigo-800 mb-1">Duration</label>
                                                    <select
                                                        name="durationMonths"
                                                        required
                                                        defaultValue="12"
                                                        className="w-full text-sm px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
                                                    >
                                                        <option value="1">1 Month</option>
                                                        <option value="3">3 Months</option>
                                                        <option value="6">6 Months</option>
                                                        <option value="12">12 Months (1 Year)</option>
                                                        <option value="24">24 Months (2 Years)</option>
                                                        <option value="36">36 Months (3 Years)</option>
                                                    </select>
                                                </div>

                                                {/* Notes */}
                                                <div className="mb-3">
                                                    <label className="block text-xs font-semibold text-indigo-800 mb-1">Notes (optional)</label>
                                                    <input
                                                        name="notes"
                                                        placeholder="e.g. 2-year special deal, discounted"
                                                        className="w-full text-sm px-3 py-2 rounded-lg border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
                                                    />
                                                </div>

                                                <button type="submit"
                                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-600/20 transition">
                                                    ⭐ {isPro ? 'Update Pro Plan' : 'Activate Pro Plan'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Subscription History ────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-100 px-5 py-4">
                            <h2 className="font-bold text-gray-900">💳 Subscription History ({allSubs.length})</h2>
                        </div>

                        {allSubs.length === 0 ? (
                            <div className="text-center text-gray-400 py-12 text-sm">No subscription records yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="text-left px-5 py-3 font-semibold">Store</th>
                                            <th className="text-left px-5 py-3 font-semibold">Amount</th>
                                            <th className="text-left px-5 py-3 font-semibold">Paid On</th>
                                            <th className="text-left px-5 py-3 font-semibold">Period</th>
                                            <th className="text-left px-5 py-3 font-semibold">Status</th>
                                            <th className="text-left px-5 py-3 font-semibold">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {allSubs.map((sub: any) => {
                                            const expired = new Date(sub.endDate) < new Date();
                                            const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000);
                                            return (
                                                <tr key={sub.id} className="hover:bg-gray-50/60">
                                                    <td className="px-5 py-3 font-semibold text-gray-900">{sub.tenantName}</td>
                                                    <td className="px-5 py-3 font-bold text-emerald-700">
                                                        {sub.amountPkr ? `PKR ${Number(sub.amountPkr).toLocaleString('en-PK')}` : '—'}
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-500">{fmt(sub.paymentDate)}</td>
                                                    <td className="px-5 py-3 text-gray-500 text-xs leading-5">
                                                        {fmt(sub.startDate)}<br />→ {fmt(sub.endDate)}
                                                        {sub.durationMonths ? <span className="text-gray-400"> ({sub.durationMonths}mo)</span> : ''}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {expired
                                                            ? <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Expired</span>
                                                            : daysLeft <= 30
                                                                ? <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{daysLeft}d left</span>
                                                                : <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                                                        }
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-400 text-xs max-w-[180px] truncate">{sub.notes || '—'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
