'use client';

import { useMemo, useState, useTransition } from 'react';
import { AlertTriangle, Trash2, ChevronDown, ChevronUp, ShieldCheck, Loader2 } from 'lucide-react';
import type { StoreRow } from '../types';
import { bulkDeleteStores } from '../actions';

interface Props {
    stores: StoreRow[];
}

interface Bucket {
    key: string;
    title: string;
    severity: 'safe' | 'caution' | 'risky';
    description: string;
    rationale: string;
    stores: StoreRow[];
}

const PROTECTED_SLUGS = new Set(['demo', 'default']);

export default function CleanupTab({ stores }: Props) {
    const buckets = useMemo<Bucket[]>(() => {
        const now = Date.now();
        const ageDays = (s: StoreRow) =>
            s.createdAt ? Math.floor((now - new Date(s.createdAt).getTime()) / 86400000) : 0;

        const candidates = stores.filter((s) => !PROTECTED_SLUGS.has(s.slug));

        const bucket1 = candidates.filter(
            (s) => s.status === 'disabled' && /-deleted-/.test(s.slug)
        );

        const bucket2 = candidates.filter(
            (s) => s.orderCount === 0 && s.productCount === 0 && ageDays(s) >= 14
        );

        const bucket3 = candidates.filter(
            (s) =>
                s.orderCount === 0 &&
                s.productCount <= 2 &&
                s.productCount > 0 &&
                ageDays(s) >= 30
        );

        return [
            {
                key: 'soft_deleted',
                title: 'Already soft-deleted',
                severity: 'safe',
                description:
                    'Stores the app already marked as deleted (slug suffixed `-deleted-…` and status `disabled`). Hard-deleting these is the lowest-risk cleanup.',
                rationale: 'status = "disabled" AND slug LIKE "%-deleted-%"',
                stores: bucket1,
            },
            {
                key: 'empty',
                title: 'Empty stores',
                severity: 'caution',
                description:
                    'Active stores with zero products and zero orders, idle for at least 14 days. Likely abandoned signups.',
                rationale: '0 products AND 0 orders AND age ≥ 14 days',
                stores: bucket2,
            },
            {
                key: 'seed_only',
                title: 'Seed-only abandoned',
                severity: 'risky',
                description:
                    '≤2 products (likely never went past sign-up defaults), zero orders ever, ≥30 days old.',
                rationale: '≤2 products AND 0 orders AND age ≥ 30 days',
                stores: bucket3,
            },
        ];
    }, [stores]);

    const totalCandidates = buckets.reduce((sum, b) => sum + b.stores.length, 0);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3">
                <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-900">
                    <div className="font-semibold">Hard-delete is permanent.</div>
                    <div className="text-amber-800/80 mt-0.5">
                        Each delete cascades through orders, products, promo codes, and subscriptions. Pizza Palace
                        (<code className="font-mono text-[12px] bg-amber-100 px-1 rounded">demo</code>) and the
                        system <code className="font-mono text-[12px] bg-amber-100 px-1 rounded">default</code>{' '}
                        tenant are protected and will never be deleted.
                    </div>
                </div>
            </div>

            {totalCandidates === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-xl py-16 text-center">
                    <ShieldCheck size={32} className="text-emerald-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-zinc-900">Nothing to clean up.</div>
                    <div className="text-xs text-zinc-500 mt-1">
                        No abandoned stores match the criteria right now.
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {buckets.map((b) => (
                        <BucketCard key={b.key} bucket={b} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Bucket card ────────────────────────────────────────────────────────────

function BucketCard({ bucket }: { bucket: Bucket }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (bucket.stores.length === 0) return null;

    const severityStyle =
        bucket.severity === 'safe'
            ? { ring: 'border-zinc-200', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Lowest risk' }
            : bucket.severity === 'caution'
                ? { ring: 'border-zinc-200', pill: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Review before deleting' }
                : { ring: 'border-zinc-200', pill: 'bg-red-50 text-red-700 border-red-200', label: 'Highest risk' };

    function handleDeleteAll() {
        const ok = window.confirm(
            `Delete ALL ${bucket.stores.length} stores in "${bucket.title}"?\n\n` +
                `This cascades to orders, products, promo codes, and subscriptions.\n\n` +
                `This cannot be undone.`
        );
        if (!ok) return;
        const ids = bucket.stores.map((s) => s.id);
        startTransition(async () => {
            try {
                const res = await bulkDeleteStores(ids);
                window.alert(`Deleted ${res.deleted} stores.`);
                window.location.reload();
            } catch (err) {
                window.alert(err instanceof Error ? err.message : 'Failed to delete');
            }
        });
    }

    return (
        <div className={`bg-white border ${severityStyle.ring} rounded-xl overflow-hidden`}>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-900">{bucket.title}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${severityStyle.pill}`}>
                            {severityStyle.label}
                        </span>
                        <span className="text-xs text-zinc-500">{bucket.stores.length} stores</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{bucket.description}</div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">{bucket.rationale}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="h-8 px-3 rounded-md text-xs font-medium text-zinc-600 hover:bg-zinc-100 inline-flex items-center gap-1"
                    >
                        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {open ? 'Hide list' : 'Show list'}
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        disabled={isPending}
                        className="h-8 px-3 rounded-md text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center gap-1.5 disabled:opacity-60"
                    >
                        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        Delete all ({bucket.stores.length})
                    </button>
                </div>
            </div>

            {open && (
                <div className="border-t border-zinc-100">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50/60 text-[10px] uppercase tracking-wider text-zinc-500">
                            <tr>
                                <th className="text-left px-4 py-2 font-semibold">Store</th>
                                <th className="text-left px-4 py-2 font-semibold">Email</th>
                                <th className="text-left px-4 py-2 font-semibold">Created</th>
                                <th className="text-right px-4 py-2 font-semibold">Products</th>
                                <th className="text-right px-4 py-2 font-semibold">Orders</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {bucket.stores.map((s) => (
                                <tr key={s.id} className="hover:bg-zinc-50/40">
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-zinc-900">{s.name}</div>
                                        <div className="text-[11px] text-zinc-400 font-mono">/store/{s.slug}</div>
                                    </td>
                                    <td className="px-4 py-2 text-zinc-500 text-xs">{s.email || '—'}</td>
                                    <td className="px-4 py-2 text-zinc-500 text-xs">
                                        {s.createdAt
                                            ? new Date(s.createdAt).toLocaleDateString('en-US', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-2 text-right text-zinc-700 text-xs">{s.productCount}</td>
                                    <td className="px-4 py-2 text-right text-zinc-700 text-xs">{s.orderCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
