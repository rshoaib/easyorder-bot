'use client';

import { registerTenant } from "@/app/actions/register-actions";
import { useTransition, useState } from "react";
import { Loader2, ArrowRight, Store, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm({ userEmail }: { userEmail: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            try {
                const result = await registerTenant(formData);
                if (result.success) {
                    // Redirect to the new store admin
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
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
                    <Store size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Setup your Store</h1>
                <p className="text-gray-500 mt-2">Logged in as {userEmail}</p>
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
                        placeholder="e.g. Riz's Burgers" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store URL (Slug)</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm">
                            /store/
                        </span>
                        <input 
                            name="slug" 
                            type="text" 
                            required 
                            placeholder="riz-burgers" 
                            className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 min-w-0 bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input 
                        name="ownerPhone" 
                        type="tel" 
                        required 
                        defaultValue="+"
                        placeholder="+1234567890" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Orders will be sent to this number.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-green-900">Free Tier Active</h3>
                        <span className="text-green-700 font-bold">$0<span className="text-sm font-normal">/mo</span></span>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Unlimited Orders</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> WhatsApp Integration</li>
                    </ul>
                </div>

                <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <>Launch Store <ArrowRight size={18} /></>}
                </button>
            </form>
        </div>
    );
}
