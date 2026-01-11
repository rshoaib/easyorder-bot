'use client';

import { registerTenant } from "@/app/actions/register-actions";
import { useTransition, useState } from "react";
import { Loader2, ArrowRight, Store, CheckCircle, Check } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state as per instruction's finally block



    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setLoading(true);
        startTransition(async () => {
            try {
                const result = await registerTenant(formData);
                if (result.success) {
                    setSuccess(true);
                } else if (result.error) {
                    setError(result.error);
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        });
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <Check size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                    <p className="text-gray-600 mb-6">Your store has been created but is pending activation.</p>
                    
                    <div className="bg-blue-50 p-4 rounded-xl text-left mb-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Activation Steps:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                            <li>Transfer <strong>$29.00</strong> to the account below.</li>
                            <li>Send the receipt to our WhatsApp: <a href="https://wa.me/923224609117" className="underline font-bold">+92 322 4609117</a></li>
                            <li>We will activate your store immediately!</li>
                        </ol>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl text-left mb-6 font-mono text-sm">
                        <p className="text-gray-500 text-xs uppercase mb-1">Bank Transfer Details</p>
                        <p><strong>Bank:</strong> Askari Bank Limited (Johar Town, Lahore)</p>
                        <p><strong>Account Title:</strong> RIZWAN SHOAIB</p>
                        <p><strong>Account No:</strong> 01000100579994</p>
                        <p><strong>IBAN:</strong> PK48ASCM0001000100579994</p>
                    </div>

                    <Link href="/">
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Back to Home</button>
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Store size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Start your Store</h1>
                    <p className="text-gray-500 mt-2">Create your account and start selling in minutes.</p>
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
                                easyorder.com/store/
                            </span>
                            <input 
                                name="slug" 
                                type="text" 
                                required 
                                placeholder="riz-burgers" 
                                className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 min-w-0 bg-gray-50 focus:bg-white"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">This will be your unique shop link.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            placeholder="you@example.com" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (inc. Country Code)</label>
                        <input 
                            name="ownerPhone" 
                            type="tel" 
                            required 
                            defaultValue="+"
                            placeholder="+1234567890" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            required 
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-blue-900">Pro Plan</h3>
                            <span className="text-blue-700 font-bold">$29<span className="text-sm font-normal">/mo</span></span>
                        </div>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> Unlimited Orders</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> Custom Menu</li>
                            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> WhatsApp Integration</li>
                        </ul>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : <>Continue to Payment <ArrowRight size={18} /></>}
                    </button>
                </form>
            </div>
            
            <p className="mt-8 text-gray-400 text-sm">
                Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
            </p>
        </div>
    );
}
