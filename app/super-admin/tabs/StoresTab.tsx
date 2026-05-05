'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Search,
    SlidersHorizontal,
    ExternalLink,
    Settings,
    ChevronDown,
    ChevronUp,
    Phone,
    Mail,
    Copy,
    Check,
    KeyRound,
    Loader2,
    X,
    AlertCircle,
} from 'lucide-react';
import type { StoreRow } from '../types';
import {
    activateTenant,
    deactivateTenant,
    setProPlan,
    downgradePlan,
    clearOrderHistory,
    generateRecoveryLink,
} from '../actions';

interface Props {
    stores: StoreRow[];
    initialSearch: string;
    onSearchChange: (s: string) => void;
}

type PlanFilter = 'all' | 'free' | 'pro';
type StatusFilter = 'all' | 'active' | 'disabled' | 'pending_payment';
type ActivityFilter = 'all' | 'has_orders' | 'no_orders' | 'empty';
type SortKey = 'newest' | 'oldest' | 'most_orders' | 'most_revenue' | 'name_az';

export default function StoresTab({ stores, initialSearch, onSearchChange }: Props) {
    const [search, setSearch] = useState(initialSearch);
    const [plan, setPlan] = useState<PlanFilter>('all');
    const [status, setStatus] = useState<StatusFilter>('all');
    const [activity, setActivity] = useState<ActivityFilter>('all');
    const [sort, setSort] = useState<SortKey>('newest');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let rows = stores.filter((s) => {
            if (q) {
                const hay = `${s.name} ${s.slug} ${s.email ?? ''}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            if (plan !== 'all' && s.plan !== plan) return false;
            if (status !== 'all' && s.status !== status) return false;
            if (activity === 'has_orders' && s.orderCount === 0) return false;
            if (activity === 'no_orders' && s.orderCount > 0) return false;
            if (activity === 'empty' && (s.productCount > 0 || s.orderCount > 0)) return false;
            return true;
        });

        rows = [...rows].sort((a, b) => {
            switch (sort) {
                case 'newest':
                    return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
                case 'oldest':
                    return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
                case 'most_orders':
                    return b.orderCount - a.orderCount;
                case 'most_revenue':
                    return b.revenue - a.revenue;
                case 'name_az':
                    return a.name.localeCompare(b.name);
            }
        });
        return rows;
    }, [stores, search, plan, status, activity, sort]);

    return (
        <div className="space-y-4">
            {/* ─── Toolbar ─────────────────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-zinc-200 bg-white text-sm flex-1 min-w-[220px]">
                    <Search size={14} className="text-zinc-400" />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            onSearchChange(e.target.value);
                        }}
                        placeholder="Search by name, slug or email…"
                        className="flex-1 bg-transparent outline-none placeholder:text-zinc-400"
                    />
                </div>

                <Select
                    value={plan}
                    onChange={(v) => setPlan(v as PlanFilter)}
                    options={[
                        { value: 'all', label: 'All plans' },
                        { value: 'free', label: 'Free' },
                        { value: 'pro', label: 'Pro' },
                    ]}
                />
                <Select
                    value={status}
                    onChange={(v) => setStatus(v as StatusFilter)}
                    options={[
                        { value: 'all', label: 'Any status' },
                        { value: 'active', label: 'Active' },
                        { value: 'disabled', label: 'Disabled' },
                        { value: 'pending_payment', label: 'Pending' },
                    ]}
                />
                <Select
                    value={activity}
                    onChange={(v) => setActivity(v as ActivityFilter)}
                    options={[
                        { value: 'all', label: 'Any activity' },
                        { value: 'has_orders', label: 'Has orders' },
                        { value: 'no_orders', label: 'No orders' },
                        { value: 'empty', label: 'Empty (0 / 0)' },
                    ]}
                />
                <Select
                    value={sort}
                    onChange={(v) => setSort(v as SortKey)}
                    icon={<SlidersHorizontal size={14} />}
                    options={[
                        { value: 'newest', label: 'Newest first' },
                        { value: 'oldest', label: 'Oldest first' },
                        { value: 'most_orders', label: 'Most orders' },
                        { value: 'most_revenue', label: 'Most revenue' },
                        { value: 'name_az', label: 'Name A→Z' },
                    ]}
                />
            </div>

            {/* ─── Result summary ──────────────────────────────────────── */}
            <div className="text-xs text-zinc-500 px-1">
                {filtered.length} of {stores.length} stores
            </div>

            {/* ─── Store list ──────────────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-sm text-zinc-400 text-center py-16">
                        No stores match these filters.
                    </div>
                ) : (
                    <ul className="divide-y divide-zinc-100">
                        {filtered.map((s) => (
                            <StoreRowItem key={s.id} store={s} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ─── Row ────────────────────────────────────────────────────────────────────

function StoreRowItem({ store }: { store: StoreRow }) {
    const [open, setOpen] = useState(false);

    return (
        <li>
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50/60">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center font-semibold text-sm shrink-0">
                    {store.name.charAt(0).toUpperCase()}
                </div>
                {/* Name & slug */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/store/${store.slug}`}
                            target="_blank"
                            className="font-medium text-sm text-zinc-900 truncate hover:underline"
                            title="Open storefront"
                        >
                            {store.name}
                        </Link>
                        <StatusDot status={store.status} />
                    </div>
                    <div className="text-xs text-zinc-400 font-mono truncate">/store/{store.slug}</div>
                </div>
                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-xs text-zinc-500 mr-2 shrink-0">
                    <Stat label="Products" value={store.productCount} />
                    <Stat label="Orders" value={store.orderCount} />
                    <Stat
                        label="Revenue"
                        value={
                            store.revenue > 0
                                ? `${store.currency || ''}${Math.round(store.revenue).toLocaleString()}`
                                : '—'
                        }
                    />
                </div>
                {/* Plan */}
                <PlanBadge store={store} />
                {/* Quick actions */}
                <Link
                    href={`/store/${store.slug}`}
                    target="_blank"
                    className="hidden md:inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 px-2 h-8 rounded-md hover:bg-zinc-100"
                    title="Open storefront"
                >
                    <ExternalLink size={12} />
                </Link>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 px-2 h-8 rounded-md hover:bg-zinc-100"
                >
                    <Settings size={12} /> Manage
                    {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            </div>

            {open && <StoreRowDetail store={store} />}
        </li>
    );
}

// ─── Expanded detail panel ──────────────────────────────────────────────────

function StoreRowDetail({ store }: { store: StoreRow }) {
    const isPro = store.plan === 'pro';
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-zinc-50/60 border-t border-zinc-100 px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact + actions */}
                <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Contact & Actions
                    </div>
                    <div className="space-y-2">
                        {store.email && (
                            <ContactLine icon={Mail} value={store.email} copyable />
                        )}
                        {store.ownerPhone && (
                            <ContactLine icon={Phone} value={store.ownerPhone} copyable />
                        )}
                        {store.createdAt && (
                            <div className="text-xs text-zinc-400">
                                Joined {new Date(store.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                        <Link
                            href={`/store/${store.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50"
                        >
                            <ExternalLink size={12} /> Storefront
                        </Link>
                        {store.status !== 'active' ? (
                            <form action={activateTenant}>
                                <input type="hidden" name="id" value={store.id} />
                                <button className="h-8 px-3 rounded-md text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                                    Activate
                                </button>
                            </form>
                        ) : (
                            <form action={deactivateTenant}>
                                <input type="hidden" name="id" value={store.id} />
                                <button className="h-8 px-3 rounded-md text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
                                    Deactivate
                                </button>
                            </form>
                        )}
                        <SendResetLinkButton tenantId={store.id} email={store.email} />
                        {isPro && (
                            <form action={downgradePlan}>
                                <input type="hidden" name="id" value={store.id} />
                                <button className="h-8 px-3 rounded-md text-xs font-medium border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
                                    Downgrade
                                </button>
                            </form>
                        )}
                        {store.orderCount > 0 && (
                            <ConfirmFormButton
                                action={clearOrderHistory}
                                tenantId={store.id}
                                confirm={`This will permanently delete ALL ${store.orderCount} orders for this store. Continue?`}
                                className="h-8 px-3 rounded-md text-xs font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            >
                                Clear orders ({store.orderCount})
                            </ConfirmFormButton>
                        )}
                    </div>
                </div>

                {/* Pro plan form */}
                <form
                    action={setProPlan}
                    className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3"
                >
                    <input type="hidden" name="id" value={store.id} />
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        {isPro ? 'Update Pro Plan' : 'Activate Pro Plan'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1">
                                Amount (PKR)
                            </label>
                            <input
                                name="amountPkr"
                                type="number"
                                min="0"
                                step="100"
                                placeholder="30000"
                                className="w-full h-8 px-2 rounded-md border border-zinc-200 bg-white text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1">
                                Payment date
                            </label>
                            <input
                                name="paymentDate"
                                type="date"
                                required
                                defaultValue={today}
                                className="w-full h-8 px-2 rounded-md border border-zinc-200 bg-white text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Duration</label>
                        <select
                            name="durationMonths"
                            defaultValue="12"
                            className="w-full h-8 px-2 rounded-md border border-zinc-200 bg-white text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none"
                        >
                            <option value="1">1 month</option>
                            <option value="3">3 months</option>
                            <option value="6">6 months</option>
                            <option value="12">12 months</option>
                            <option value="24">24 months</option>
                            <option value="36">36 months</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Notes (optional)
                        </label>
                        <input
                            name="notes"
                            placeholder="e.g. annual discount"
                            className="w-full h-8 px-2 rounded-md border border-zinc-200 bg-white text-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-9 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800"
                    >
                        {isPro ? 'Update Pro plan' : 'Activate Pro plan'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function Select({
    value,
    onChange,
    options,
    icon,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
}) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    {icon}
                </div>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`h-9 ${icon ? 'pl-7' : 'pl-3'} pr-8 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none appearance-none cursor-pointer`}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
        </div>
    );
}

function StatusDot({ status }: { status: StoreRow['status'] }) {
    const map = {
        active: 'bg-emerald-500',
        disabled: 'bg-zinc-300',
        pending_payment: 'bg-amber-400',
    } as const;
    return (
        <span
            className={`w-1.5 h-1.5 rounded-full ${map[status]}`}
            title={status}
        />
    );
}

function PlanBadge({ store }: { store: StoreRow }) {
    if (store.plan !== 'pro') {
        return (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-500 border border-zinc-200 shrink-0">
                FREE
            </span>
        );
    }
    const expiry = store.subscriptionEndDate ? new Date(store.subscriptionEndDate) : null;
    const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / 86400000) : null;
    if (daysLeft !== null && daysLeft < 0) {
        return (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 shrink-0">
                EXPIRED
            </span>
        );
    }
    return (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
            PRO
        </span>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="text-right">
            <div className="text-zinc-900 font-medium text-xs">{value}</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400">{label}</div>
        </div>
    );
}

function ContactLine({
    icon: Icon,
    value,
    copyable,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    value: string;
    copyable?: boolean;
}) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="flex items-center gap-2 text-sm text-zinc-700">
            <Icon size={14} className="text-zinc-400" />
            <span className="truncate flex-1">{value}</span>
            {copyable && (
                <button
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(value);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1200);
                        } catch {
                            /* noop */
                        }
                    }}
                    className="text-zinc-400 hover:text-zinc-700 p-1 rounded hover:bg-zinc-100"
                    title="Copy"
                >
                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                </button>
            )}
        </div>
    );
}

function ConfirmFormButton({
    action,
    tenantId,
    confirm,
    className,
    children,
}: {
    action: (formData: FormData) => Promise<void>;
    tenantId: string;
    confirm: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <form
            action={action}
            onSubmit={(e) => {
                if (!window.confirm(confirm)) e.preventDefault();
            }}
        >
            <input type="hidden" name="id" value={tenantId} />
            <button className={className}>{children}</button>
        </form>
    );
}

// ─── Send reset link feature ────────────────────────────────────────────────

function SendResetLinkButton({ tenantId, email }: { tenantId: string; email?: string }) {
    const [open, setOpen] = useState(false);
    const [link, setLink] = useState<string | null>(null);
    const [resolvedEmail, setResolvedEmail] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const disabled = !email;
    const title = disabled
        ? 'No email on file for this store — add one in tenants.email first'
        : 'Generate a one-time password reset link to forward via WhatsApp';

    async function handleClick() {
        setOpen(true);
        setError(null);
        setLink(null);
        setLoading(true);
        try {
            const res = await generateRecoveryLink(tenantId);
            setLink(res.actionLink);
            setResolvedEmail(res.email);
            setExpiresAt(res.expiresAt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate link');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                title={title}
                className="h-8 px-3 rounded-md text-xs font-medium border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <KeyRound size={12} /> Send reset link
            </button>
            {open && (
                <RecoveryLinkDialog
                    onClose={() => setOpen(false)}
                    loading={loading}
                    error={error}
                    link={link}
                    email={resolvedEmail}
                    expiresAt={expiresAt}
                />
            )}
        </>
    );
}

function RecoveryLinkDialog({
    onClose,
    loading,
    error,
    link,
    email,
    expiresAt,
}: {
    onClose: () => void;
    loading: boolean;
    error: string | null;
    link: string | null;
    email: string | null;
    expiresAt: string | null;
}) {
    const [copied, setCopied] = useState(false);

    async function copyLink() {
        if (!link) return;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* noop */
        }
    }

    const expiry = expiresAt
        ? new Date(expiresAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
        : null;

    return (
        <div
            className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-md w-full p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-zinc-900">Password reset link</h3>
                        {email && <p className="text-xs text-zinc-500 mt-0.5">for {email}</p>}
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-zinc-100 text-zinc-500" aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-8 text-zinc-400 text-sm">
                        <Loader2 size={16} className="animate-spin mr-2" /> Generating link…
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {link && !loading && !error && (
                    <>
                        <div className="text-xs text-zinc-500 mb-2">
                            One-time link. Forward this to the merchant on WhatsApp. They click it once → land on the &ldquo;Set a new password&rdquo; page → done.
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 mb-3 break-all text-[11px] font-mono text-zinc-700">
                            {link}
                        </div>
                        {expiry && <div className="text-[11px] text-zinc-400 mb-3">Expires: {expiry}</div>}
                        <div className="flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={copyLink}
                                className="flex-1 h-9 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 inline-flex items-center justify-center gap-1.5"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied' : 'Copy link'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-9 px-3 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

