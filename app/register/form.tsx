'use client';

import { registerTenant, checkSlugAvailability } from "@/app/actions/register-actions";
import { useTransition, useState, useCallback, useEffect, useRef } from "react";
import { Loader2, ArrowRight, Store, CheckCircle, XCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
}

export default function RegisterForm({ userEmail }: { userEmail: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [storeName, setStoreName] = useState('');
    const [slug, setSlug] = useState('');
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    // Check slug availability (debounced)
    const checkSlug = useCallback((newSlug: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        if (!newSlug || newSlug.length < 2) {
            setSlugStatus('idle');
            return;
        }
        
        setSlugStatus('checking');
        debounceRef.current = setTimeout(async () => {
            try {
                const result = await checkSlugAvailability(newSlug);
                setSlugStatus(result.available ? 'available' : 'taken');
            } catch {
                setSlugStatus('idle');
            }
        }, 500);
    }, []);

    // Auto-generate slug when store name changes
    const handleNameChange = (name: string) => {
        setStoreName(name);
        if (!slugManuallyEdited) {
            const generated = slugify(name);
            setSlug(generated);
            checkSlug(generated);
        }
    };

    // Manual slug editing
    const handleSlugChange = (value: string) => {
        const cleaned = slugify(value);
        setSlug(cleaned);
        setSlugManuallyEdited(true);
        checkSlug(cleaned);
    };

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            try {
                const result = await registerTenant(formData);
                if (result.success) {
                    router.push(`/store/${result.slug}/admin`); 
                } else if (result.error) {
                    setError(result.error);
                }
            } catch (err) {
                setError("Something went wrong");
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">✓</div>
                    <span className="text-xs text-gray-400">Account</span>
                </div>
                <div className="flex-1 h-px bg-indigo-200 mx-3" />
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-xs font-bold text-indigo-600">Store Setup</span>
                </div>
            </div>

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <Store size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Almost there! Name your store</h1>
                <p className="text-gray-500 mt-2 text-sm">Takes less than 30 seconds · Completely free</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-2">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input 
                        name="name" 
                        type="text" 
                        required 
                        value={storeName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Riz's Burgers" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-400 text-sm">
                            orderviachat.com/store/
                        </span>
                        <div className="relative flex-1">
                            <input 
                                name="slug" 
                                type="text" 
                                required 
                                value={slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                placeholder="riz-burgers" 
                                className={`w-full px-4 py-3 rounded-r-xl border focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 min-w-0 bg-gray-50 focus:bg-white ${
                                    slugStatus === 'taken' ? 'border-red-300' : 
                                    slugStatus === 'available' ? 'border-green-300' : 
                                    'border-gray-200'
                                }`}
                            />
                            {/* Availability indicator */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {slugStatus === 'checking' && (
                                    <Loader2 size={16} className="animate-spin text-gray-400" />
                                )}
                                {slugStatus === 'available' && (
                                    <CheckCircle size={16} className="text-green-500" />
                                )}
                                {slugStatus === 'taken' && (
                                    <XCircle size={16} className="text-red-500" />
                                )}
                            </div>
                        </div>
                    </div>
                    {slugStatus === 'taken' && (
                        <p className="text-xs text-red-500 mt-1">This URL is already taken. Try another one.</p>
                    )}
                    {slugStatus === 'available' && slug && (
                        <p className="text-xs text-green-600 mt-1">✨ This URL is available!</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input 
                        name="ownerPhone" 
                        type="tel" 
                        required 
                        defaultValue="+"
                        placeholder="+1234567890" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Orders will be sent to this number via WhatsApp.</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-green-900 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-green-600" />
                            Free Forever Plan
                        </h3>
                        <span className="text-green-700 font-bold">$0<span className="text-sm font-normal">/mo</span></span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-green-800">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> Unlimited Orders</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> WhatsApp Integration</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 shrink-0"/> No credit card required</li>
                    </ul>
                </div>

                <button 
                    type="submit" 
                    disabled={isPending || slugStatus === 'taken'}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <>🚀 Launch My Free Store <ArrowRight size={18} /></>}
                </button>
            </form>
        </div>
    );
}
