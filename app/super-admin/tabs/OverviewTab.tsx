'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Store, CreditCard, ShoppingBag, TrendingUp, ArrowRight } from 'lucide-react';
import type { StoreRow, SubscriptionRow, TabKey } from '../types';

interface Props {
    stores: StoreRow[];
    subscriptions: SubscriptionRow[];
    onJump: (tab: TabKey) => void;
}

export default function OverviewTab({ stores, subscriptions, onJump }: Props) {
    const stats = useMemo(() => {
        const total = stores.length;
        const active = stores.filter((s) => s.status === 'active').length;
        const pro = stores.filter((s) => s.plan === 'pro').length;
        const free = total - pro;

        const totalOrders = stores.reduce((sum, s) => sum + s.orderCount, 0);
        const totalRevenuePkr = subscriptions.reduce((sum, s) => sum + (s.amountPkr || 0), 0);

        // Signups in the last 7 days
        const weekAgo = Date.now() - 7 * 86400000;
        const signupsThisWeek = stores.filter(
            (s) => s.createdAt && new Date(s.createdAt).getTime() >= weekAgo
        ).length;

        return { total, active, pro, free, totalOrders, totalRevenuePkr, signupsThisWeek };
    }, [stores, subscriptions]);

    const recentStores = useMemo(() => {
        return [...stores]
            .filter((s) => s.createdAt)
            .sort((a, b) => (b.createdAt! > a.createdAt! ? 1 : -1))
            .slice(0, 5);
    }, [stores]);

    const expiringSoon = useMemo(() => {
        const now = Date.now();
        return stores
            .filter((s) => s.plan === 'pro' && s.subscriptionEndDate)
            .map((s) => ({
                ...s,
                daysLeft: Math.ceil((new Date(s.subscriptionEndDate!).getTime() - now) / 86400000),
            }))
            .filter((s) => s.daysLeft <= 30)
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .slice(0, 5);
    }, [stores]);

    return (
        <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Kpi
                    icon={Store}
                    label="Total stores"
                    value={stats.total}
                    sub={`${stats.active} active`}
                />
                <Kpi
                    icon={CreditCard}
                    label="Pro subscribers"
                    value={stats.pro}
                    sub={`${stats.free} on free plan`}
                />
                <Kpi
                    icon={ShoppingBag}
                    label="Total orders"
                    value={stats.totalOrders.toLocaleString()}
                    sub={`across all stores`}
                />
                <Kpi
                    icon={TrendingUp}
                    label="Pro revenue"
                    value={`PKR ${stats.totalRevenuePkr.toLocaleString('en-PK')}`}
                    sub={`${subscriptions.length} payments`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent signups */}
                <Panel
                    title="Recent signups"
                    subtitle={`${stats.signupsThisWeek} new this week`}
                    action={{ label: 'View all', onClick: () => onJump('stores') }}
                >
                    {recentStores.length === 0 ? (
                        <Empty>No stores yet.</Empty>
                    ) : (
                        <ul className="divide-y divide-zinc-100">
                            {recentStores.map((s) => (
                                <li key={s.id} className="flex items-center justify-between py-3">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/store/${s.slug}`}
                                            target="_blank"
                                            className="font-medium text-sm text-zinc-900 hover:underline truncate block"
                                            title="Open storefront"
                                        >
                                            {s.name}
                                        </Link>
                                        <div className="text-xs text-zinc-400">
                                            {s.email || '—'} · {s.createdAt ? formatDate(s.createdAt) : 'unknown'}
                                        </div>
                                    </div>
                                    <PlanPill plan={s.plan} />
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>

                {/* Pro subscriptions expiring */}
                <Panel
                    title="Pro plans expiring"
                    subtitle="Next 30 days"
                    action={{ label: 'View all', onClick: () => onJump('subscriptions') }}
                >
                    {expiringSoon.length === 0 ? (
                        <Empty>No Pro plans expiring soon.</Empty>
                    ) : (
                        <ul className="divide-y divide-zinc-100">
                            {expiringSoon.map((s) => (
                                <li key={s.id} className="flex items-center justify-between py-3">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/store/${s.slug}`}
                                            target="_blank"
                                            className="font-medium text-sm text-zinc-900 hover:underline truncate block"
                                            title="Open storefront"
                                        >
                                            {s.name}
                                        </Link>
                                        <div className="text-xs text-zinc-400">
                                            ends {formatDate(s.subscriptionEndDate!)}
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            s.daysLeft < 0
                                                ? 'bg-red-50 text-red-700 border border-red-200'
                                                : s.daysLeft <= 7
                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                : 'bg-zinc-50 text-zinc-700 border border-zinc-200'
                                        }`}
                                    >
                                        {s.daysLeft < 0 ? 'Expired' : `${s.daysLeft}d left`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>
        </div>
    );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Kpi({
    icon: Icon,
    label,
    value,
    sub,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium mb-2">
                <Icon size={14} />
                {label}
            </div>
            <div className="text-2xl font-semibold text-zinc-900 tracking-tight">{value}</div>
            {sub && <div className="text-xs text-zinc-400 mt-1">{sub}</div>}
        </div>
    );
}

function Panel({
    title,
    subtitle,
    action,
    children,
}: {
    title: string;
    subtitle?: string;
    action?: { label: string; onClick: () => void };
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl">
            <div className="flex items-center justify-between px-4 h-12 border-b border-zinc-100">
                <div>
                    <div className="text-sm font-semibold text-zinc-900">{title}</div>
                    {subtitle && <div className="text-xs text-zinc-400">{subtitle}</div>}
                </div>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-xs text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1 font-medium"
                    >
                        {action.label} <ArrowRight size={12} />
                    </button>
                )}
            </div>
            <div className="px-4 py-1">{children}</div>
        </div>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return <div className="text-sm text-zinc-400 text-center py-8">{children}</div>;
}

function PlanPill({ plan }: { plan: 'free' | 'pro' }) {
    if (plan === 'pro') {
        return (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Pro
            </span>
        );
    }
    return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-50 text-zinc-500 border border-zinc-200">
            Free
        </span>
    );
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
