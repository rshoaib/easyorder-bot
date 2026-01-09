'use client';

import { updateDomain } from "@/app/store/[slug]/admin/domain-actions";
import { useTransition, useState } from "react";
import { Globe, Loader2, Save, Check } from "lucide-react";

export function DomainSettings({ slug, currentDomain }: { slug: string, currentDomain?: string }) {
    const [isPending, startTransition] = useTransition();
    const [domain, setDomain] = useState(currentDomain || '');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        setError('');
        setMessage('');
        startTransition(async () => {
            try {
                await updateDomain(slug, domain);
                setMessage("Domain updated! Please configure your DNS CNAME to point to this app.");
            } catch (e: any) {
                setError(e.message);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center gap-3 text-gray-500 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Globe size={20} /></div>
                <span className="text-sm font-medium">Custom Domain</span>
            </div>
            
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. menu.mypizza.com"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                    onClick={handleSave}
                    disabled={isPending}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isPending ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                    Save
                </button>
            </div>

            {message && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><Check size={12}/> {message}</p>}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            
            <div className="mt-4 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                <strong>DNS Setup:</strong> Create a CNAME record for <code>{domain || 'your-domain.com'}</code> pointing to <code>easyorder-bot.vercel.app</code>
            </div>
        </div>
    );
}
