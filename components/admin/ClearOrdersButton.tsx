'use client';

import { useTransition } from 'react';

interface ClearOrdersButtonProps {
    tenantId: string;
    orderCount: number;
    clearAction: (formData: FormData) => Promise<void>;
}

export default function ClearOrdersButton({ tenantId, orderCount, clearAction }: ClearOrdersButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        const confirmed = confirm(
            `⚠️ This will permanently delete ALL ${orderCount} orders for this store.\n\nThis cannot be undone. Are you sure?`
        );
        if (!confirmed) return;

        const formData = new FormData();
        formData.set('id', tenantId);

        startTransition(async () => {
            await clearAction(formData);
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${isPending
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
                    : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-700'
                }`}
        >
            {isPending ? '⏳ Clearing...' : `🗑 Clear Orders (${orderCount})`}
        </button>
    );
}
