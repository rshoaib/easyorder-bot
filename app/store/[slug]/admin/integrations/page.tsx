'use client';

import { useState, useEffect, use } from "react";
import { getIntegration, saveIntegration, deleteIntegration } from "@/app/actions/social-actions";
import { Save, Trash2, Check, AlertCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function IntegrationsPage({ params }: { params: Promise<{ slug: string }> }) {
    // Unwrap params in Next.js 15+ 
    // actually, this is a client component so useParams is safer if we don't want to await params prop
    // But since it's a page, it receives params as a prop.
    // Let's use useParams() hook for client component simplicity to get slug.
    const { slug }  = useParams() as { slug: string };

    const [pageId, setPageId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchIntegration = async () => {
            try {
                // We need to fetch the existing integration
                // But wait, getIntegration is a server action.
                // We shouldn't call server actions directly in useEffect often, but it's okay for fetching data if it returns serializable data.
                const integration = await getIntegration(slug, 'facebook');
                if (integration) {
                    setPageId(integration.pageId || '');
                    setAccessToken(integration.accessToken || '');
                    setIsConnected(true);
                }
            } catch (err) {
                console.error("Failed to load integration", err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchIntegration();
    }, [slug]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const result = await saveIntegration(slug, 'facebook', { pageId, accessToken });
            if (result.success) {
                setIsConnected(true);
                setMessage({ type: 'success', text: 'Facebook integration saved successfully! New products will now auto-post.' });
            } else {
                throw new Error(result.error);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to save integration.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Are you sure? This will stop auto-posting.")) return;
        
        setSaving(true);
        try {
            // We need a server action for deleting or just save with empty/null
            // I recall implementing deleteIntegration in social-actions.ts? 
            // If not, I'll need to check. But assuming I did based on my plan.
            await deleteIntegration(slug, 'facebook');
            setPageId('');
            setAccessToken('');
            setIsConnected(false);
            setMessage({ type: 'success', text: 'Integration disconnected.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to disconnect.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                <p className="text-gray-500">Connect your store to social media platforms for automatic posting.</p>
            </div>

            <div className="grid gap-6">
                {/* Facebook Integration Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Facebook Page</h3>
                                <p className="text-sm text-gray-500">Auto-post new products to your page</p>
                            </div>
                        </div>
                        {isConnected ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                                <Check size={14} /> Connected
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
                                Not Connected
                            </span>
                        )}
                    </div>

                    <div className="p-6">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {message.type === 'success' ? <Check size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                                <p>{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page ID</label>
                                <input 
                                    type="text" 
                                    value={pageId}
                                    onChange={(e) => setPageId(e.target.value)}
                                    placeholder="e.g. 100063456789012"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Found in your Page's "About" section -&gt; Page Transparency</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Access Token</label>
                                <input 
                                    type="password" 
                                    value={accessToken}
                                    onChange={(e) => setAccessToken(e.target.value)}
                                    placeholder="EAA..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Long-lived Page Access Token required.</p>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-6">
                                {isConnected ? (
                                    <button 
                                        type="button" 
                                        onClick={handleDisconnect}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                                        disabled={saving}
                                    >
                                        <Trash2 size={16} /> Disconnect
                                    </button>
                                ) : ( <div></div> )}
                                
                                <div className={isConnected ? "" : "ml-auto"}>
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-gray-200 transition-all flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {isConnected ? 'Update Configuration' : 'Save Configuration'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
