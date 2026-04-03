'use client';

import { useState, useMemo, useEffect } from 'react';
import { Order } from '@/lib/repository/types';
import StatusSelector from '@/components/admin/StatusSelector';
import { FileText, Cloud, Search, Filter, MessageSquare, Link2, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currency';
import { formatOrderDate, formatOrderTime } from '@/lib/date-utils';

interface OrderListProps {
    orders: Order[];
    slug: string;
    currency?: string;
    timezone?: string;
}

type FilterStatus = 'all' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export default function OrderList({ orders, slug, currency, timezone }: OrderListProps) {
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Compute counts per status
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: orders.length };
        for (const order of orders) {
            const s = order.status || 'pending';
            counts[s] = (counts[s] || 0) + 1;
        }
        return counts;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (filter !== 'all' && order.status !== filter) return false;
            if (search) {
                const searchLower = search.toLowerCase();
                const idMatch = order.id.toLowerCase().includes(searchLower);
                const nameMatch = order.customer.name.toLowerCase().includes(searchLower);
                return idMatch || nameMatch;
            }
            return true;
        });
    }, [orders, filter, search]);

    // Clear selections that are no longer visible when filter changes
    useEffect(() => {
        const visibleIds = new Set(filteredOrders.map(o => o.id));
        setSelected(prev => {
            const next = new Set<string>();
            prev.forEach(id => { if (visibleIds.has(id)) next.add(id); });
            return next.size === prev.size ? prev : next;
        });
    }, [filteredOrders]);

    const allFilteredSelected = filteredOrders.length > 0 && filteredOrders.every(o => selected.has(o.id));

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredOrders.map(o => o.id)));
        }
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDeleteSelected = async () => {
        if (selected.size === 0) return;
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const res = await fetch('/api/clear-orders', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, orderIds: Array.from(selected) }),
            });
            const data = await res.json();

            if (!res.ok) {
                setDeleteError(data.error || 'Something went wrong');
                setIsDeleting(false);
                return;
            }

            window.location.reload();
        } catch (err: any) {
            setDeleteError(err?.message || 'Network error');
            setIsDeleting(false);
        }
    };

    return (
        <div id="orders-table" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    {(['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'] as FilterStatus[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                                filter === s
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {s}
                            {(statusCounts[s] || 0) > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                                    filter === s
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}>
                                    {statusCounts[s] || 0}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Selection Action Bar */}
            {selected.size > 0 && (
                <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-red-800">
                        {selected.size} order{selected.size !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                        {deleteError && <span className="text-xs text-red-600">{deleteError}</span>}
                        {showDeleteConfirm ? (
                            <>
                                <span className="text-xs text-red-700 font-medium hidden sm:inline">
                                    Permanently delete {selected.size} order{selected.size !== 1 ? 's' : ''}?
                                </span>
                                <button
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelected(new Set())}
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-3 w-10">
                                {filteredOrders.length > 0 && (
                                    <input
                                        type="checkbox"
                                        checked={allFilteredSelected}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        title="Select all visible orders"
                                    />
                                )}
                            </th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className={`hover:bg-gray-50 transition-colors group ${selected.has(order.id) ? 'bg-red-50/50' : ''}`}>
                                <td className="py-4 px-3">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(order.id)}
                                        onChange={() => toggleSelect(order.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </td>
                                <td className="py-4 px-4 font-mono text-sm font-medium text-gray-900">
                                    <span className="text-gray-400">#</span>{order.id.replace('ORD-', '')}
                                    {order.items.some((i: any) => i.type === 'digital') && (
                                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 w-fit">
                                            <Cloud size={10} /> Digital
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">
                                    <div className="font-medium text-gray-900">
                                        {mounted ? formatOrderDate(order.date, timezone) : order.date.split('T')[0]}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {mounted ? formatOrderTime(order.date, timezone) : ''}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900">{order.customer.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{order.customer.phone}</div>
                                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{order.customer.address}</div>
                                    {order.notes && (
                                        <div className="flex items-start gap-1 mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg max-w-[200px]">
                                            <MessageSquare size={10} className="shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">{order.notes}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4 font-bold text-gray-900">{formatPrice(order.total, currency)}</td>
                                <td className="py-4 px-4 text-center">
                                    <StatusSelector orderId={order.id} currentStatus={order.status || 'pending'} slug={slug} />
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <a
                                            href={`/api/invoice/${order.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                            title="View PDF Invoice"
                                        >
                                            <FileText size={18} />
                                        </a>
                                        <button
                                            onClick={() => {
                                                const url = `${window.location.origin}/store/${slug}/order/${order.id}`;
                                                navigator.clipboard.writeText(url);
                                            }}
                                            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                            title="Copy Tracking Link"
                                        >
                                            <Link2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                            {search || filter !== 'all' ? <Filter size={20} /> : <FileText size={20} />}
                                        </div>
                                        <p>{search || filter !== 'all' ? 'No orders match your filter.' : 'No orders received yet.'}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
