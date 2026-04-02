'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface ClearStoreOrdersButtonProps {
    slug: string;
    orderCount: number;
}

export default function ClearStoreOrdersButton({ slug, orderCount }: ClearStoreOrdersButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClear = async () => {
        setIsPending(true);
        setError(null);

        try {
            const res = await fetch('/api/clear-orders', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                setIsPending(false);
                return;
            }

            // Success — reload to show empty state
            window.location.reload();
        } catch (err: any) {
            setError(err?.message || 'Network error');
            setIsPending(false);
        }
    };

    if (isPending) {
        return (
            <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 border border-gray-200">
                <Trash2 size={16} className="animate-spin" />
                <span className="hidden md:inline">Clearing...</span>
            </span>
        );
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium hidden md:inline">Delete all {orderCount} orders?</span>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                    Yes, Delete
                </button>
                <button
                    onClick={() => { setShowConfirm(false); setError(null); }}
                    className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <X size={16} />
                </button>
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border bg-white text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
            title="Clear all order history"
        >
            <Trash2 size={16} />
            <span className="hidden md:inline">Clear History ({orderCount})</span>
        </button>
    );
}
