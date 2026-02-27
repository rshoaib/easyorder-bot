'use client';

import { useState, useMemo, useEffect } from 'react';
import { Order } from '@/lib/repository/types';
import StatusSelector from '@/components/admin/StatusSelector';
import { FileText, Cloud, Search, Filter, MessageSquare, Link2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currency';

interface OrderListProps {
    orders: Order[];
    slug: string;
    currency?: string;
}

type FilterStatus = 'all' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export default function OrderList({ orders, slug, currency }: OrderListProps) {
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);

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
            // 1. Status Filter
            if (filter !== 'all' && order.status !== filter) return false;
            
            // 2. Search Filter (ID or Customer Name)
            if (search) {
                const searchLower = search.toLowerCase();
                const idMatch = order.id.toLowerCase().includes(searchLower);
                const nameMatch = order.customer.name.toLowerCase().includes(searchLower);
                return idMatch || nameMatch;
            }

            return true;
        });
    }, [orders, filter, search]);

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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="py-4 px-6 font-mono text-sm font-medium text-gray-900">
                                    <span className="text-gray-400">#</span>{order.id.replace('ORD-', '')}
                                    {order.items.some((i: any) => i.type === 'digital') && (
                                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 w-fit">
                                            <Cloud size={10} /> Digital
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    <div className="font-medium text-gray-900">
                                        {mounted ? new Date(order.date).toLocaleDateString() : order.date.split('T')[0]}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {mounted ? new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="font-medium text-gray-900">{order.customer.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{order.customer.phone}</div>
                                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{order.customer.address}</div>
                                    {order.notes && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full w-fit" title={order.notes}>
                                            <MessageSquare size={10} /> Note
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 font-bold text-gray-900">{formatPrice(order.total, currency)}</td>
                                <td className="py-4 px-6 text-center">
                                    <StatusSelector orderId={order.id} currentStatus={order.status || 'pending'} slug={slug} />
                                </td>
                                <td className="py-4 px-6 text-center">
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
                                <td colSpan={6} className="py-16 text-center text-gray-500">
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
