'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { SubscriptionRow } from '../types';

interface Props {
    subscriptions: SubscriptionRow[];
}

type StatusFilter = 'all' | 'active' | 'expiring' | 'expired';

export default function SubscriptionsTab({ subscriptions }: Props) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<StatusFilter>('all');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const now = Date.now();
        return subscriptions.filter((s) => {
            if (q && !s.tenantName.toLowerCase().includes(q)) return false;
            const end = new Date(s.endDate).getTime();
            const daysLeft = Math.ceil((end - now) / 86400000);
            if (filter === 'active' && daysLeft < 0) return false;
            if (filter === 'expiring' && (daysLeft < 0 || daysLeft > 30)) return false;
            if (filter === 'expired' && daysLeft >= 0) return false;
            return true;
        });
    }, [subscriptions, search, filter]);

    const totalAmount = filtered.reduce((sum, s) => sum + (s.amountPkr || 0), 0);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-zinc-200 bg-white text-sm flex-1 min-w-[220px]">
                    <Search size={14} className="text-zinc-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search store name…"
                        className="flex-1 bg-transparent outline-none placeholder:text-zinc-400"
                    />
                </div>
                <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
                    All ({subscriptions.length})
                </FilterChip>
                <FilterChip active={filter === 'active'} onClick={() => setFilter('active')}>
                    Active
                </FilterChip>
                <FilterChip active={filter === 'expiring'} onClick={() => setFilter('expiring')}>
                    Expiring soon
                </FilterChip>
                <FilterChip active={filter === 'expired'} onClick={() => setFilter('expired')}>
                    Expired
                </FilterChip>
            </div>

            <div className="text-xs text-zinc-500 px-1 flex items-center justify-between">
                <span>
                    {filtered.length} of {subscriptions.length} payments
                </span>
                <span>
                    Total:{' '}
                    <span className="font-semibold text-zinc-900">
                        PKR {totalAmount.toLocaleString('en-PK')}
                    </span>
                </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-sm text-zinc-400 text-center py-16">
                        No subscription records match.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50/60 text-[10px] uppercase tracking-wider text-zinc-500">
                                <tr>
                                    <th className="text-left px-4 py-2.5 font-semibold">Store</th>
                                    <th className="text-left px-4 py-2.5 font-semibold">Amount</th>
                                    <th className="text-left px-4 py-2.5 font-semibold">Paid</th>
                                    <th className="text-left px-4 py-2.5 font-semibold">Period</th>
                                    <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                                    <th className="text-left px-4 py-2.5 font-semibold">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.map((s) => {
                                    const end = new Date(s.endDate).getTime();
                                    const daysLeft = Math.ceil((end - Date.now()) / 86400000);
                                    return (
                                        <tr key={s.id} className="hover:bg-zinc-50/40">
                                            <td className="px-4 py-2.5 font-medium text-zinc-900">
                                                {s.tenantName}
                                            </td>
                                            <td className="px-4 py-2.5 font-semibold text-emerald-700">
                                                {s.amountPkr
                                                    ? `PKR ${Number(s.amountPkr).toLocaleString('en-PK')}`
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-zinc-500">{fmt(s.paymentDate)}</td>
                                            <td className="px-4 py-2.5 text-zinc-500 text-xs leading-5">
                                                {fmt(s.startDate)} → {fmt(s.endDate)}
                                                {s.durationMonths && (
                                                    <span className="text-zinc-400"> ({s.durationMonths}mo)</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <StatusPill daysLeft={daysLeft} />
                                            </td>
                                            <td className="px-4 py-2.5 text-zinc-400 text-xs max-w-[200px] truncate">
                                                {s.notes || '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterChip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`h-9 px-3 rounded-lg text-sm font-medium border transition ${
                active
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
        >
            {children}
        </button>
    );
}

function StatusPill({ daysLeft }: { daysLeft: number }) {
    if (daysLeft < 0) {
        return (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-red-50 text-red-700 border-red-200">
                EXPIRED
            </span>
        );
    }
    if (daysLeft <= 30) {
        return (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                {daysLeft}D LEFT
            </span>
        );
    }
    return (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
            ACTIVE
        </span>
    );
}

function fmt(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
