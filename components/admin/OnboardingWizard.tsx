'use client';

import { PRESET_MENUS, PresetType } from "@/lib/presets";
import { seedStore } from "@/app/actions/onboarding-actions";
import { useState, useTransition } from "react";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingWizard({ slug }: { slug: string }) {
    const [selectedType, setSelectedType] = useState<PresetType | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSeed = () => {
        if (!selectedType) return;
        
        startTransition(async () => {
            const res = await seedStore(slug, selectedType);
            if (res.success) {
                // Refresh to show products
                router.refresh();
                // Maybe reload page entirely to ensure state sync?
                window.location.reload(); 
            } else {
                alert(res.error);
            }
        });
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100 mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's set up your menu!</h2>
                    <p className="text-slate-500">
                        Choose a starting template below, and we'll add some sample items for you. You can edit or delete them later.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {Object.entries(PRESET_MENUS).map(([key, value]) => {
                        const isSelected = selectedType === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedType(key as PresetType)}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative group ${
                                    isSelected 
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200 ring-offset-2' 
                                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <div className="text-4xl mb-3">{value.icon}</div>
                                <div className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                    {value.label}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {value.products.length} Items included
                                </div>
                                
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-indigo-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleSeed}
                        disabled={!selectedType || isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : "Generate Menu"}
                    </button>
                </div>
            </div>
        </div>
    );
}
