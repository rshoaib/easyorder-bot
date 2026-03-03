'use client';

import { createProduct } from "@/app/actions/product-actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { uploadProductImage } from "@/lib/storage";
import { useState } from "react";
import { getPreset } from "@/lib/presets";
import { createClient } from "@/utils/supabase/client";
import { generateProductDescription } from '@/app/actions/ai-actions';
import { Sparkles, Save, Loader2, ArrowLeft } from "lucide-react";

interface Props {
    tenantId: string;
    slug: string;
    storeType?: string;
    storeName: string;
}

export default function ProductForm({ tenantId, slug, storeType, storeName }: Props) {
    const [uploading, setUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [showProModal, setShowProModal] = useState(false);
    const [uploadError, setUploadError] = useState('');
    
    // Determine labels based on store type
    const type = storeType || 'restaurant';
    
    const ingredientsLabel = {
        restaurant: 'Ingredients',
        retail: 'Specifications / Details',
        service: 'Service Details',
        digital: 'File / Access Details'
    }[type] || 'Ingredients';

    // Compress large mobile camera images before upload
    async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
        // Skip compression for small files (under 1MB) or non-image types
        if (file.size < 1024 * 1024) return file;
        
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                try {
                    let { width, height } = img;
                    
                    // Only resize if larger than maxWidth
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                resolve(file); // Fallback to original
                                return;
                            }
                            const compressed = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            console.log(`[compress] ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`);
                            resolve(compressed);
                        },
                        'image/jpeg',
                        quality
                    );
                } catch {
                    resolve(file); // Fallback to original on any error
                }
            };
            
            img.onerror = () => resolve(file); // Fallback to original
            img.src = URL.createObjectURL(file);
        });
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        setUploadError('');
        const file = e.target.files[0];
        try {
            // Auto-compress large mobile camera images
            const processedFile = await compressImage(file);
            const supabase = createClient();
            const url = await uploadProductImage(processedFile, tenantId, supabase);
            if (url) {
                setImageUrl(url);
            }
        } catch (error: any) {
            console.error('[handleImageUpload]', error);
            setUploadError(error?.message || 'Image upload failed. Please try a smaller image.');
        } finally {
            setUploading(false);
        }
    }

    async function handleAIGenerate() {
        // We need to get the current values from the form inputs
        // Since we are using uncontrolled inputs for name/category, we need to grab them via DOM or state
        // To keep it simple without refactoring everything to controlled state:
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        const categoryInput = document.querySelector('select[name="category"]') as HTMLSelectElement; 
        
        const name = nameInput?.value;
        const category = categoryInput?.value;

        if (!name) {
            alert('Please enter a Product Name first.');
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateProductDescription(name, category, { name: storeName, type: type });
            if (result.success && result.description) {
                setDescription(result.description);
            } else {
                alert(result.message || 'Failed to generate description');
            }
        } catch (e) {
            console.error(e);
            alert('Error generating description');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <>
        {showProModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200" onClick={() => setShowProModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Upgrade to PRO</h3>
                        <p className="text-sm text-gray-500 mt-1">Unlock AI-powered descriptions, bulk import, and more.</p>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-2 mb-5">
                        {['✨ AI Auto-Write descriptions', '📦 Bulk CSV import/export', '🎨 Custom domain', '📊 Advanced analytics'].map(f => (
                            <li key={f}>{f}</li>
                        ))}
                    </ul>
                    <Link href={`/store/${slug}/admin/settings#upgrade`}>
                        <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                            Upgrade Now →
                        </button>
                    </Link>
                    <button onClick={() => setShowProModal(false)} className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700">Maybe later</button>
                </div>
            </div>
        )}
        <form action={async (formData) => {
            // If we have an uploaded URL, append it or override the input
            if (imageUrl) {
                formData.set('image', imageUrl);
            }
            await createProduct(formData, tenantId, slug);
        }} className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                {/* ... existing fields ... */}
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Product Name</label>
                        <input name="name" required placeholder="e.g. Classic Burger" className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                            <input name="price" type="number" step="0.01" required placeholder="0.00" className="w-full pl-7 rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select name="category" className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>Appetizers</option>
                        <option>Main Course</option>
                        <option>Desserts</option>
                        <option>Drinks</option>
                        <option>Sides</option>
                        <option value="Digital">Digital Products</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Product Type</label>
                    <select name="type" className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="physical">Physical (Requires Shipping/Pickup)</option>
                        <option value="digital">Digital (Email Delivery)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">{ingredientsLabel}</label>
                        <button 
                            type="button"
                            onClick={() => setShowProModal(true)}
                            className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:text-amber-700 transition-colors"
                            title="PRO feature — Upgrade to unlock"
                        >
                            <Sparkles size={12} />
                            Auto-Write
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none">PRO</span>
                        </button>
                    </div>
                    <textarea 
                        name="description" 
                        rows={3} 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={type === 'restaurant' ? "Describe your delicious product..." : "Provide details..."} 
                        className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Product Image</label>
                    <div className="flex gap-4 items-start">
                        {imageUrl && (
                            <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-slate-200">
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                             <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                            />
                            <input type="hidden" name="image" value={imageUrl} />
                            {uploading && <p className="text-xs text-indigo-600 mt-1">Compressing & uploading...</p>}
                            {uploadError && <p className="text-xs text-red-500 mt-1">⚠️ {uploadError}</p>}
                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, or WebP. Large photos are auto-compressed.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href={`/admin/${slug}/menu`} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                    Cancel
                </Link>
                <SubmitButton />
            </div>
        </form>
        </>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <button disabled={pending} type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {pending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {pending ? 'Saving...' : 'Save Product'}
        </button>
    );
}
