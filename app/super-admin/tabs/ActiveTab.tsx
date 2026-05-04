'use client';

import { useMemo, useState } from 'react';
import { Search, ShoppingBag, Clock } from 'lucide-react';
import type { StoreRow } from '../types';

interface Props {
    stores: StoreRow[];
}

const WHATSAPP_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function timeAgo(iso: string | null): string {
    if (!iso) return '—';
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 0) return 'just now';
    const minutes = Math.floor(ms / 60_000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

function whatsappUrl(phone: string, storeName: string): string {
    const digits = phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Hi ${storeName.split(/\s+/)[0]}, this is the OrderViaChat team checking in. How's everything going with your store?`);
    return `https://wa.me/${digits}?text=${text}`;
}

export default function ActiveTab({ stores }: Props) {
    const [search, setSearch] = useState('');

    const active = useMemo(() => {
        const q = search.trim().toLowerCase();
        return stores
            .filter((s) => s.orderCount > 0 && s.status === 'active')
            .filter((s) => {
                if (!q) return true;
                return `${s.name} ${s.slug} ${s.email ?? ''} ${s.ownerPhone ?? ''}`
                    .toLowerCase()
                    .includes(q);
            })
            .sort((a, b) => (b.lastOrderAt ?? '').localeCompare(a.lastOrderAt ?? ''));
    }, [stores, search]);

    const totalOrders = useMemo(
        () => active.reduce((sum, s) => sum + s.orderCount, 0),
        [active]
    );

    return (
        <div className="space-y-4">
            {/* Summary strip */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-zinc-200 rounded-xl p-4">
                    <div className="text-xs text-zinc-500">Active stores</div>
                    <div className="text-2xl font-bold text-zinc-900 mt-0.5">{active.length}</div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-4">
                    <div className="text-xs text-zinc-500">Total orders</div>
                    <div className="text-2xl font-bold text-zinc-900 mt-0.5">{totalOrders}</div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-2 px-3 h-11">
                    <Search size={16} className="text-zinc-400 shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by store, email, or phone…"
                        className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-zinc-400"
                    />
                </div>
            </div>

            {/* Cards */}
            {active.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-xl text-sm text-zinc-400 text-center py-16 px-4">
                    {search.trim() ? 'No active stores match your search.' : 'No active stores with orders yet.'}
                </div>
            ) : (
                <ul className="space-y-3">
                    {active.map((s) => (
                        <ActiveStoreCard key={s.id} store={s} />
                    ))}
                </ul>
            )}
        </div>
    );
}

function ActiveStoreCard({ store }: { store: StoreRow }) {
    return (
        <li className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center font-semibold text-sm shrink-0">
                    {store.name.trim().charAt(0).toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-zinc-900 truncate">{store.name}</div>
                    <div className="text-xs text-zinc-400 font-mono truncate">/store/{store.slug}</div>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                    <ShoppingBag size={13} className="text-zinc-400" />
                    <span className="font-semibold text-zinc-900">{store.orderCount}</span>
                    <span className="text-zinc-500">{store.orderCount === 1 ? 'order' : 'orders'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} className="text-zinc-400" />
                    <span className="text-zinc-500">last {timeAgo(store.lastOrderAt)}</span>
                </span>
            </div>

            {store.ownerPhone ? (
                <a
                    href={whatsappUrl(store.ownerPhone, store.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe57] transition-colors no-underline"
                    aria-label={`Chat with ${store.name} on WhatsApp at ${store.ownerPhone}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d={WHATSAPP_ICON} />
                    </svg>
                    <span>{store.ownerPhone}</span>
                </a>
            ) : (
                <div className="mt-3 flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-zinc-100 text-zinc-400 text-xs font-medium">
                    No phone number on file
                </div>
            )}
        </li>
    );
}
