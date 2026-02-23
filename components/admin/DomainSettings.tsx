'use client';

import { Globe, Lock } from "lucide-react";

export function DomainSettings({ slug, currentDomain }: { slug: string, currentDomain?: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
            {/* PRO overlay */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 flex items-center gap-1.5 shadow-lg">
                    <Lock size={12} /> PRO Feature
                </div>
                <p className="text-sm text-gray-600 font-medium text-center px-4">
                    Custom domains are available on the Pro plan.
                </p>
            </div>

            <div className="flex items-center gap-3 text-gray-500 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Globe size={20} /></div>
                <span className="text-sm font-medium">Custom Domain</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
                <input 
                    type="text" 
                    disabled
                    value={currentDomain || ''}
                    placeholder="e.g. menu.mypizza.com"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <button 
                    disabled
                    className="bg-gray-300 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                    <Globe size={16} />
                    Save
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                <strong>DNS Setup:</strong> Create a CNAME record for <code>{currentDomain || 'your-domain.com'}</code> pointing to <code>cname.vercel-dns.com</code>.
            </div>
        </div>
    );
}

