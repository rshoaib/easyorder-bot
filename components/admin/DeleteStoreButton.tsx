'use client';

import { deleteStore } from "@/app/actions/tenant-actions";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DeleteStoreButton({ slug, tenantId }: { slug: string, tenantId: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you SURE you want to delete this store? This action cannot be undone.");
        if (!confirmed) return;

        const doubleConfirmed = window.confirm("Really? All orders, products, and data will be lost forever.");
        if (!doubleConfirmed) return;

        startTransition(async () => {
            await deleteStore(slug, tenantId);
            router.push('/'); // Redirect to home/landing
            router.refresh();
        });
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete Store
        </button>
    );
}
