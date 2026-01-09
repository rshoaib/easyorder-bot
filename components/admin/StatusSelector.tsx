"use client";

import { OrderStatus } from "@/lib/repository/types";
import { updateOrderStatus } from "@/app/actions/order-actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface StatusSelectorProps {
    orderId: string;
    currentStatus: OrderStatus;
    slug: string;
}

const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
};

export default function StatusSelector({ orderId, currentStatus, slug }: StatusSelectorProps) {
    const [isPending, startTransition] = useTransition();
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;
        if (newStatus === currentStatus) return;

        // Ask for confirmation for major changes
        if (newStatus === 'cancelled' && !confirm("Are you sure you want to cancel this order?")) {
            e.target.value = currentStatus;
            return;
        }

        startTransition(async () => {
            await updateOrderStatus(orderId, newStatus, slug);
        });
    };

    return (
        <div className="flex items-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin text-gray-400" />}
            <select 
                value={currentStatus}
                disabled={isPending}
                onChange={handleChange}
                className={`text-xs font-bold px-2 py-1 rounded-full border-none cursor-pointer outline-none transition-colors ${statusColors[currentStatus] || 'bg-gray-100 text-gray-800'}`}
                style={{ appearance: 'none', textAlign: 'center' }}
            >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
    );
}
