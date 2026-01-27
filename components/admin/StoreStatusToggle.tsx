'use client';

import { toggleStoreStatus } from "@/app/actions/tenant-actions";
import { Loader2, Store, Moon, Sun } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
    tenantId: string;
    slug: string;
    isOpen: boolean;
}

export default function StoreStatusToggle({ tenantId, slug, isOpen }: Props) {
    const [isPending, startTransition] = useTransition();
    // optimistic state could be added here, but standard transition is often enough for simple toggles
    
    // We can use a local state to reflect immediate change while server catches up
    const [localIsOpen, setLocalIsOpen] = useState(isOpen);

    const handleToggle = () => {
        const newState = !localIsOpen;
        setLocalIsOpen(newState); // Optimistic UI
        
        startTransition(async () => {
            await toggleStoreStatus(tenantId, slug, newState);
        });
    };

    return (
        <button 
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                localIsOpen 
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
            title={localIsOpen ? "Store is Open. Click to Close." : "Store is Closed. Click to Open."}
        >
            {isPending ? (
                <Loader2 size={16} className="animate-spin" />
            ) : localIsOpen ? (
                <Sun size={16} />
            ) : (
                <Moon size={16} />
            )}
            {localIsOpen ? 'Open' : 'Closed'}
        </button>
    );
}
