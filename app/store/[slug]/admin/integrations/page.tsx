'use client';

import { useState, useEffect } from "react";
import { getIntegration, saveIntegration, deleteIntegration } from "@/app/actions/social-actions";
import { getSocialStats, SocialStats as SocialStatsType } from "@/app/actions/analytics-actions";
import { Save, Trash2, Check, AlertCircle, Loader2, Facebook, Instagram, BarChart, Settings, Inbox } from "lucide-react";
import { useParams } from "next/navigation";
import SocialStats from "@/components/admin/SocialStats";
import SocialInbox from "@/components/admin/SocialInbox";

export default function IntegrationsPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Tab State
    const [activeTab, setActiveTab] = useState<'settings' | 'analytics' | 'inbox'>('settings');

    // Facebook State
    const [fbPageId, setFbPageId] = useState('');
    const [fbAccessToken, setFbAccessToken] = useState('');
    const [isFbConnected, setIsFbConnected] = useState(false);
    const [fbSaving, setFbSaving] = useState(false);

    // Instagram State
    const [igPageId, setIgPageId] = useState('');
    const [igAccessToken, setIgAccessToken] = useState('');
    const [isIgConnected, setIsIgConnected] = useState(false);
    const [igSaving, setIgSaving] = useState(false);

    // Analytics State
    const [stats, setStats] = useState<SocialStatsType | null>(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fbData, igData, statsData] = await Promise.all([
                    getIntegration(slug, 'facebook'),
                    getIntegration(slug, 'instagram'),
                    getSocialStats(slug)
                ]);

                if (fbData) {
                    setFbPageId(fbData.pageId || '');
                    setFbAccessToken(fbData.accessToken || '');
                    setIsFbConnected(true);
                }

                if (igData) {
                    setIgPageId(igData.pageId || '');
                    setIgAccessToken(igData.accessToken || '');
                    setIsIgConnected(true);
                }

                setStats(statsData);

            } catch (err) {
                console.error("Failed to load integrations", err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchData();
    }, [slug]);

    const handleSave = async (provider: 'facebook' | 'instagram', data: { pageId: string, accessToken: string }) => {
        const isFb = provider === 'facebook';
        isFb ? setFbSaving(true) : setIgSaving(true);
        setMessage(null);

        try {
            const result = await saveIntegration(slug, provider, data);
            if (result.success) {
                if (isFb) setIsFbConnected(true);
                else setIsIgConnected(true);

                setMessage({ type: 'success', text: `${provider === 'facebook' ? 'Facebook' : 'Instagram'} integration saved successfully!` });
            } else {
                throw new Error(result.error);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to save integration.' });
        } finally {
            isFb ? setFbSaving(false) : setIgSaving(false);
        }
    };

    const handleDisconnect = async (provider: 'facebook' | 'instagram') => {
        if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;
        
        const isFb = provider === 'facebook';
        isFb ? setFbSaving(true) : setIgSaving(true);

        try {
            await deleteIntegration(slug, provider);
            if (isFb) {
                setFbPageId('');
                setFbAccessToken('');
                setIsFbConnected(false);
            } else {
                setIgPageId('');
                setIgAccessToken('');
                setIsIgConnected(false);
            }
            setMessage({ type: 'success', text: 'Integration disconnected.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to disconnect.' });
        } finally {
            isFb ? setFbSaving(false) : setIgSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                <p className="text-gray-500">Connect your store to social media platforms for automatic posting.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Settings size={18} /> Settings
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <BarChart size={18} /> Analytics {stats && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{stats.totalPosts}</span>}
                </button>
                <button
                    onClick={() => setActiveTab('inbox')}
                    className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'inbox' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Inbox size={18} /> Inbox
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <Check size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                    <p>{message.text}</p>
                </div>
            )}

            {activeTab === 'analytics' ? (
                <SocialStats stats={stats!} />
            ) : activeTab === 'inbox' ? (
                <SocialInbox posts={stats?.recentPosts || []} />
            ) : (
                <div className="grid gap-8">
                    {/* Facebook Integration Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <Facebook size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Facebook Page</h3>
                                    <p className="text-sm text-gray-500">Auto-post new products to your feed</p>
                                </div>
                            </div>
                            {isFbConnected ? (
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
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('facebook', { pageId: fbPageId, accessToken: fbAccessToken }); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Page ID</label>
                                    <input 
                                        type="text" 
                                        value={fbPageId}
                                        onChange={(e) => setFbPageId(e.target.value)}
                                        placeholder="e.g. 100063456789012"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Access Token</label>
                                    <input 
                                        type="password" 
                                        value={fbAccessToken}
                                        onChange={(e) => setFbAccessToken(e.target.value)}
                                        placeholder="EAA..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-4">
                                    {isFbConnected ? (
                                        <button type="button" onClick={() => handleDisconnect('facebook')} className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Disconnect</button>
                                    ) : <div></div>}
                                    <button type="submit" disabled={fbSaving} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70">
                                        {fbSaving && <Loader2 size={16} className="animate-spin" />}
                                        {isFbConnected ? 'Update' : 'Connect'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Instagram Integration Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-pink-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-pink-200">
                                    <Instagram size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Instagram Business</h3>
                                    <p className="text-sm text-gray-500">Auto-post photos to your profile</p>
                                </div>
                            </div>
                            {isIgConnected ? (
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
                            <form onSubmit={(e) => { e.preventDefault(); handleSave('instagram', { pageId: igPageId, accessToken: igAccessToken }); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Account ID</label>
                                    <input 
                                        type="text" 
                                        value={igPageId}
                                        onChange={(e) => setIgPageId(e.target.value)}
                                        placeholder="e.g. 17841400000000000"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Found in Facebook Business settings or Graph API Explorer.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                                    <input 
                                        type="password" 
                                        value={igAccessToken}
                                        onChange={(e) => setIgAccessToken(e.target.value)}
                                        placeholder="EAA..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Must have 'instagram_basic' and 'instagram_content_publish' permissions.</p>
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-4">
                                    {isIgConnected ? (
                                        <button type="button" onClick={() => handleDisconnect('instagram')} className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Disconnect</button>
                                    ) : <div></div>}
                                    <button type="submit" disabled={igSaving} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70">
                                        {igSaving && <Loader2 size={16} className="animate-spin" />}
                                        {isIgConnected ? 'Update' : 'Connect'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
