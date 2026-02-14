'use client';

import { PRESET_MENUS, PresetType } from "@/lib/presets";
import { seedStore } from "@/app/actions/onboarding-actions";
import { generateMenu } from "@/app/actions/ai-actions";
import { useState, useTransition } from "react";
import { Loader2, Sparkles, CheckCircle2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingWizard({ slug }: { slug: string }) {
    const [selectedType, setSelectedType] = useState<PresetType | null>(null);
    const [customPrompt, setCustomPrompt] = useState("");
    const [mode, setMode] = useState<'preset' | 'ai'>('preset');
    const [error, setError] = useState<string | null>(null);
    
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSeed = () => {
        if (mode === 'preset' && !selectedType) return;
        if (mode === 'ai' && !customPrompt.trim()) return;
        
        setError(null);
        startTransition(async () => {
            try {
                let res: any;
                if (mode === 'ai') {
                    res = await generateMenu(slug, customPrompt);
                } else {
                    res = await seedStore(slug, selectedType!);
                }

                if (res.success) {
                    router.refresh();
                    window.location.reload(); 
                } else {
                    setError(res.message || res.error || "Something went wrong. Please try again.");
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's set up your store!</h2>
                    <p className="text-slate-500">
                        Choose a starting template below, and we'll add some sample items for you. You can edit or delete them later.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 max-w-xl mx-auto">
                        <p className="font-bold mb-1">⚠️ Generation Failed</p>
                        <p>{error}</p>
                    </div>
                )}


                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button 
                        onClick={() => setMode('preset')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${mode === 'preset' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <CheckCircle2 size={18} /> Templates
                    </button>
                    <button 
                         onClick={() => setMode('ai')}
                         className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${mode === 'ai' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Wand2 size={18} /> AI Magic Generator
                    </button>
                </div>

                {mode === 'preset' ? (
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
                ) : (
                    <div className="max-w-xl mx-auto mb-8">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                             <label className="block text-sm font-bold text-slate-700 mb-2">
                                Describe your business
                            </label>
                            <textarea 
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="e.g. A minimalist boutique in Austin selling handmade jewelry and soy candles, named 'Lumina'."
                                className="w-full p-4 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                            />
                            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                <Sparkles size={12} className="text-purple-500" />
                                We'll generate 8 catalog items based on this description.
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={handleSeed}
                        disabled={(mode === 'preset' && !selectedType) || (mode === 'ai' && !customPrompt) || isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                    >
                        {isPending ? <><Loader2 className="animate-spin" /> {mode === 'ai' ? 'AI is generating your catalog...' : 'Creating products...'}</> : "Generate Catalog"}
                    </button>
                </div>
            </div>
        </div>
    );
}
