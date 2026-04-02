'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';

interface ClearStoreOrdersButtonProps {
    slug: string;
    orderCount: number;
    clearAction: (formData: FormData) => Promise<void>;
}

export default function ClearStoreOrdersButton({ slug, orderCount, clearAction }: ClearStoreOrdersButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        const confirmed = confirm(
            `⚠️ This will permanently delete ALL ${orderCount} orders.\n\nThis action cannot be undone. Are you sure?`
        );
        if (!confirmed) return;

        const formData = new FormData();
        formData.set('slug', slug);

        startTransition(async () => {
            await clearAction(formData);
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isPending
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
                    : 'bg-white text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                }`}
            title="Clear all order history"
        >
            <Trash2 size={16} />
            <span className="hidden md:inline">
                {isPending ? 'Clearing...' : `Clear History (${orderCount})`}
            </span>
        </button>
    );
}
