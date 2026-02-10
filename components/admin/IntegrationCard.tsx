'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
    tenantId: string;
    description?: string;
    existingConfig?: { accessToken: string; pageId?: string };
    onSave: (token: string, pageId: string) => Promise<void>;
}

export default function IntegrationCard({ tenantId, description, existingConfig, onSave }: Props) {
    const [token, setToken] = useState(existingConfig?.accessToken || '');
    const [pageId, setPageId] = useState(existingConfig?.pageId || '');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    async function handleSave() {
        setStatus('saving');
        try {
            await onSave(token, pageId);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (e) {
            setStatus('error');
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    f
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Facebook Page</h3>
                    <p className="text-sm text-gray-500">{description || "Auto-post new products to your page."}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Page ID</label>
                    <input 
                        value={pageId} 
                        onChange={(e) => setPageId(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm"
                        placeholder="e.g. 100084..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Page Access Token</label>
                    <input 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        type="password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm"
                        placeholder="EAA..."
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={status === 'saving'}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                            ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white hover:bg-gray-800'}
                        `}
                    >
                        {status === 'saving' && "Saving..."}
                        {status === 'success' && <><CheckCircle2 size={16} /> Saved</>}
                        {status === 'error' && <><AlertCircle size={16} /> Error</>}
                        {status === 'idle' && "Save Configuration"}
                    </button>
                </div>
                
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold mb-1">How to get these?</p>
                    Go to Meta Business Suite {'>'} Page Settings {'>'} Advanced Messaging (or similar) or use the Graph API Explorer.
                </div>
            </div>
        </div>
    );
}
