'use client';

import { useState } from 'react';
import { Activity, LayoutDashboard, Store, Sparkles, CreditCard, Plus, Search } from 'lucide-react';
import type { StoreRow, SubscriptionRow, TabKey } from './types';
import ActiveTab from './tabs/ActiveTab';
import OverviewTab from './tabs/OverviewTab';
import StoresTab from './tabs/StoresTab';
import CleanupTab from './tabs/CleanupTab';
import SubscriptionsTab from './tabs/SubscriptionsTab';
import CreateStoreDialog from './CreateStoreDialog';

interface Props {
    stores: StoreRow[];
    subscriptions: SubscriptionRow[];
}

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { key: 'active', label: 'Active', icon: Activity },
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'stores', label: 'Stores', icon: Store },
    { key: 'cleanup', label: 'Cleanup', icon: Sparkles },
    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
];

export default function SuperAdminClient({ stores, subscriptions }: Props) {
    const [tab, setTab] = useState<TabKey>('active');
    const [showCreate, setShowCreate] = useState(false);
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen bg-zinc-50/60 text-zinc-900 overflow-x-hidden">
            {/* ─── Top bar ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            OV
                        </div>
                        <span className="font-semibold text-sm text-zinc-900 truncate">Super Admin</span>
                        <span className="text-xs text-zinc-400 hidden sm:block">/ orderviachat.com</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Global search — searches stores by name/slug/email */}
                        <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg border border-zinc-200 bg-white text-sm w-72">
                            <Search size={14} className="text-zinc-400" />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (e.target.value) setTab('stores');
                                }}
                                placeholder="Search stores…"
                                className="flex-1 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400"
                            />
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition"
                            aria-label="New store"
                        >
                            <Plus size={14} />
                            <span className="hidden sm:inline">New store</span>
                        </button>
                    </div>
                </div>

                {/* Tab strip — horizontally scrollable on mobile so 5 tabs don't push the page wide */}
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 -mb-px overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-1 w-max">
                        {TABS.map(({ key, label, icon: Icon }) => {
                            const active = tab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setTab(key)}
                                    className={`inline-flex items-center gap-2 px-3 h-10 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                                        active
                                            ? 'border-zinc-900 text-zinc-900'
                                            : 'border-transparent text-zinc-500 hover:text-zinc-900'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </header>

            {/* ─── Tab content ─────────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {tab === 'active' && <ActiveTab stores={stores} />}
                {tab === 'overview' && <OverviewTab stores={stores} subscriptions={subscriptions} onJump={setTab} />}
                {tab === 'stores' && (
                    <StoresTab stores={stores} initialSearch={search} onSearchChange={setSearch} />
                )}
                {tab === 'cleanup' && <CleanupTab stores={stores} />}
                {tab === 'subscriptions' && <SubscriptionsTab subscriptions={subscriptions} />}
            </main>

            {showCreate && <CreateStoreDialog onClose={() => setShowCreate(false)} />}
        </div>
    );
}
