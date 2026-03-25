'use client';

import { toggleStoreStatus } from "@/app/actions/tenant-actions";
import { Loader2, Power } from "lucide-react";
import { useState, useTransition } from "react";

interface Props {
    tenantId: string;
    slug: string;
    isOpen: boolean;
}

export default function StoreStatusToggle({ tenantId, slug, isOpen }: Props) {
    const [isPending, startTransition] = useTransition();
    const [localIsOpen, setLocalIsOpen] = useState(isOpen);

    const handleToggle = () => {
        const newState = !localIsOpen;
        setLocalIsOpen(newState);
        
        startTransition(async () => {
            try {
                await toggleStoreStatus(tenantId, slug, newState);
            } catch (error) {
                console.error("Failed to update store status:", error);
                setLocalIsOpen(!newState);
            }
        });
    };

    return (
        <div className={`relative rounded-2xl border-2 p-4 transition-all duration-300 ${
            localIsOpen 
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
        }`}>
            <div className="flex items-center justify-between gap-4">
                {/* Status info */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        localIsOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                        <Power size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                                localIsOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'
                            }`} />
                            <span className={`text-base font-bold ${
                                localIsOpen ? 'text-emerald-800' : 'text-red-800'
                            }`}>
                                {localIsOpen ? 'Store is Open' : 'Store is Closed'}
                            </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${localIsOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                            {localIsOpen 
                                ? 'Customers can browse and place orders' 
                                : 'Customers see "Closed" badge — orders blocked'}
                        </p>
                    </div>
                </div>
                
                {/* Toggle switch */}
                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`relative shrink-0 w-16 h-9 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 active:scale-95 ${
                        localIsOpen 
                            ? 'bg-emerald-500 focus:ring-emerald-500/20' 
                            : 'bg-red-400 focus:ring-red-400/20'
                    } ${isPending ? 'opacity-60' : 'cursor-pointer'}`}
                    title={localIsOpen ? 'Click to close store' : 'Click to open store'}
                >
                    <span className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                        localIsOpen ? 'translate-x-7' : 'translate-x-0'
                    }`}>
                        {isPending ? (
                            <Loader2 size={14} className="animate-spin text-gray-400" />
                        ) : (
                            <span className="text-xs">{localIsOpen ? '✓' : '✕'}</span>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}
