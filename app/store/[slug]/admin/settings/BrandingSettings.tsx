'use client';

import { useState } from 'react';
import { updateBranding } from '@/app/actions/branding-actions';
import { Upload, Save, Loader2, Palette, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface BrandingSettingsProps {
    tenantId: string;
    slug: string;
    initialThemeColor: string;
    initialLogoUrl?: string;
}

export default function BrandingSettings({ tenantId, slug, initialThemeColor, initialLogoUrl }: BrandingSettingsProps) {
    const [themeColor, setThemeColor] = useState(initialThemeColor);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await updateBranding(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Branding updated successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    }

    function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-900">Brand Identity</h2>
                <p className="text-sm text-gray-500 mt-1">Customize how your store looks to your customers.</p>
            </div>
            
            <form action={handleSubmit} className="p-6 space-y-8">
                <input type="hidden" name="tenantId" value={tenantId} />
                <input type="hidden" name="slug" value={slug} />

                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <ImageIcon size={16} className="text-indigo-600" /> Store Logo
                    </label>
                    
                    <div className="flex items-start gap-6">
                        <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden shrink-0">
                            {logoPreview ? (
                                <Image 
                                    src={logoPreview} 
                                    alt="Logo Preview" 
                                    fill 
                                    className="object-contain p-2"
                                />
                            ) : (
                                <span className="text-xs text-gray-400 text-center px-2">No Logo</span>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
                                <Upload size={16} />
                                <span>Upload New Logo</span>
                                <input 
                                    type="file" 
                                    name="logo" 
                                    accept="image/*" 
                                    onChange={handleLogoChange}
                                    className="hidden" 
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                                Recommended size: 512x512px. Max 2MB.<br/>
                                Supported formats: PNG, JPG, WEBP.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                {/* Brand Color */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Palette size={16} className="text-purple-600" /> Primary Brand Color
                    </label>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input 
                                type="color" 
                                name="themeColor"
                                value={themeColor}
                                onChange={(e) => setThemeColor(e.target.value)}
                                className="w-12 h-12 rounded-lg border-2 border-gray-200 p-1 cursor-pointer"
                            />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{themeColor}</div>
                            <p className="text-xs text-gray-500">Pick a color that matches your brand.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading || slug === 'demo'}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Branding
                    </button>
                    {message && (
                        <div className={`mt-4 p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
