'use client';

import { useState, useRef } from 'react';
import { uploadProductImage, uploadDigitalFile } from '@/lib/storage';
import { addProduct } from './actions';
import { Plus, Loader2, CheckCircle2, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrencySymbol } from '@/lib/currency';
import { toast } from 'sonner';

// Category presets per store type
const CATEGORY_PRESETS: Record<string, string[]> = {
    restaurant: ['Appetizers', 'Main Course', 'Desserts', 'Drinks', 'Sides', 'Specials'],
    retail:     ['Men', 'Women', 'Kids', 'Accessories', 'Sale', 'New Arrivals'],
    service:    ['Services', 'Packages', 'Add-ons', 'Consultations'],
    digital:    ['E-Books', 'Templates', 'Downloads', 'Courses', 'Presets'],
};

const RECOMMENDED_COUNT = 8;

interface Props {
    slug: string;
    tenantId: string;
    storeName: string;
    storeType?: string;
    currency?: string;
    initialProductCount?: number;
}

export default function AddProductForm({ slug, tenantId, storeName, storeType, currency, initialProductCount = 0 }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [productType, setProductType] = useState<'physical' | 'digital' | 'service'>('physical');
    const [digitalFileName, setDigitalFileName] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [savedProductName, setSavedProductName] = useState<string | null>(null);
    const [productCount, setProductCount] = useState(initialProductCount);
    const [showProModal, setShowProModal] = useState(false);
    const [quickMode, setQuickMode] = useState(true); // Fix 3: Quick Add mode default ON
    const [sizes, setSizes] = useState('');
    
    // Store the selected image file in a ref so it survives form submission
    const selectedFileRef = useRef<File | null>(null);

    // Category suggestions based on store type
    const categoryPresets = CATEGORY_PRESETS[storeType || 'restaurant'] || CATEGORY_PRESETS.restaurant;
    const datalistId = `category-presets-${tenantId}`;


    async function handleSubmit(formData: FormData) {
        setIsUploading(true);
        setFeedback(null);
        try {
            let imageUrl = '';
            const submitData = new FormData();
            
            // Use the file from our ref (not from FormData which has dual-input issues)
            const file = selectedFileRef.current;
            if (file && file.size > 0) {
                console.log('[AddProductForm] Uploading file:', file.name, file.size, file.type);
                const supabase = createClient();
                const uploadedUrl = await uploadProductImage(file, tenantId, supabase);
                console.log('[AddProductForm] Upload result:', uploadedUrl);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            } else {
                console.log('[AddProductForm] No file selected, selectedFileRef is:', file);
            }

            // Handle Digital File Upload
            if (productType === 'digital') {
                const digitalFile = formData.get('digitalFile') as File;
                if (digitalFile && digitalFile.size > 0) {
                     const digitalUrl = await uploadDigitalFile(digitalFile, tenantId);
                     if (digitalUrl) {
                        submitData.set('digitalFileUrl', digitalUrl);
                     }
                }
            }

            submitData.set('name', formData.get('name') as string);
            submitData.set('price', formData.get('price') as string);
            submitData.set('category', formData.get('category') as string);
            submitData.set('description', description || (formData.get('description') as string));
            submitData.set('image', imageUrl);
            submitData.set('type', productType);
            if (sizes.trim()) submitData.set('sizes', sizes.trim());

            console.log('[AddProductForm] Submitting with image URL:', imageUrl);
            const savedName = (submitData.get('name') as string) || 'Item';
            await addProduct(slug, submitData);
            
            // Success — reset form and show post-save CTA state
            setPreview(null);
            setDescription('');
            setDigitalFileName(null);
            setProductType('physical');
            setSizes('');
            selectedFileRef.current = null;
            setSavedProductName(savedName);
            setProductCount(prev => prev + 1);
            toast.success('Product added successfully!');
            (document.getElementById('addProductForm') as HTMLFormElement)?.reset();

        } catch (error: any) {
            console.error('[AddProductForm] Error:', error);
            const msg = error?.message || 'Failed to add product';
            if (msg.includes('logged in') || msg.includes('Unauthenticated') || msg.includes('authenticate')) {
                toast.error('🔒 Session expired. Redirecting to login...');
                setTimeout(() => { window.location.href = `/store/${slug}/admin/login`; }, 2000);
            } else if (error?.digest === 'tenant_ownership_verification_failed' || msg.includes('Unauthorized')) {
                toast.info("Feature disabled in demo mode. Changes aren't saved.");
            } else {
                toast.error(`❌ ${msg}`);
            }
        } finally {
            setIsUploading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('[AddProductForm] File selected:', file.name, file.size, file.type);
            selectedFileRef.current = file;
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    // PRO upgrade modal
    const ProModal = () => (
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
                        <li key={f} className="flex items-center gap-2">{f}</li>
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
    );

    // Post-save success state
    if (savedProductName) {
        const progressPct = Math.min(100, Math.round((productCount / RECOMMENDED_COUNT) * 100));
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-200 sticky top-4 animate-in fade-in duration-300">
                <div className="text-center mb-5">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">"{ savedProductName }" added! 🎉</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        You have <span className="font-bold text-indigo-600">{productCount}</span> of {RECOMMENDED_COUNT} recommended items.
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Catalog progress</span>
                        <span className="font-bold text-indigo-600">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700" 
                            style={{ width: `${progressPct}%` }} 
                        />
                    </div>
                    {productCount < RECOMMENDED_COUNT && (
                        <p className="text-xs text-gray-400 mt-1.5">{RECOMMENDED_COUNT - productCount} more items recommended before sharing your store.</p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setSavedProductName(null)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> Add Another Item
                    </button>
                    <Link href={`/store/${slug}`} target="_blank" className="w-full">
                        <button className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2">
                            View My Store <ExternalLink size={16} />
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
        {showProModal && <ProModal />}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Plus size={18} /> Add New Item
                </h2>
                {/* Fix 3: Quick/Full mode toggle */}
                <button
                    type="button"
                    onClick={() => setQuickMode(!quickMode)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        quickMode
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}
                >
                    {quickMode ? '⚡ Quick Mode' : '📝 Full Form'}
                </button>
            </div>

            {/* Progress hint */}
            {productCount > 0 && productCount < RECOMMENDED_COUNT && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-700 font-medium flex items-center justify-between">
                    <span>🎯 {productCount}/{RECOMMENDED_COUNT} items added</span>
                    <span className="text-indigo-400">{RECOMMENDED_COUNT - productCount} more recommended</span>
                </div>
            )}

            <form id="addProductForm" action={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="form-label">Name</label>
                    <input name="name" required placeholder="e.g. Cheese Burger" className="form-input" />
                </div>

                {/* Quick Mode: Name + Price + Category + compact photo */}
                {quickMode ? (
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="form-label">Price ({getCurrencySymbol(currency)})</label>
                                <input name="price" type="number" step="0.01" required placeholder="10.50" className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">Category</label>
                                <input 
                                    name="category" 
                                    required 
                                    placeholder="e.g. Burgers" 
                                    className="form-input"
                                    list={datalistId}
                                    autoComplete="off"
                                />
                                <datalist id={datalistId}>
                                    {categoryPresets.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        {/* Compact Photo Upload for Quick Mode */}
                        {preview ? (
                            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setPreview(null); selectedFileRef.current = null; }}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition-colors backdrop-blur-sm"
                                >
                                    ✕ Remove
                                </button>
                            </div>
                        ) : (
                            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
                                <span className="text-xl group-hover:scale-110 transition-transform">📷</span>
                                <div>
                                    <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600">Add Photo</span>
                                    <span className="text-xs text-gray-400 ml-1">(optional)</span>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                />
                            </label>
                        )}
                        {/* Hidden defaults for quick mode */}
                        <input type="hidden" name="description" value="" />
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="form-label">Product Type</label>
                            <div className="flex gap-2">
                                {(['physical', 'digital', 'service'] as const).map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setProductType(type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all border ${productType === type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {productType === 'digital' && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in zoom-in duration-200">
                                <label className="form-label text-blue-800">Digital File (PDF, ZIP, etc.)</label>
                                <input 
                                    type="file" 
                                    name="digitalFile" 
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                    onChange={(e) => setDigitalFileName(e.target.files?.[0]?.name || null)}
                                />
                                {digitalFileName && <p className="text-xs text-green-600 mt-2 font-bold">Selected: {digitalFileName}</p>}
                                <p className="text-xs text-blue-600 mt-2">Customers will receive a download link via email after purchase.</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="form-label">Price ({getCurrencySymbol(currency)})</label>
                                <input name="price" type="number" step="0.01" required placeholder="10.50" className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">Category</label>
                                <input 
                                    name="category" 
                                    required 
                                    placeholder="e.g. Burgers" 
                                    className="form-input"
                                    list={datalistId}
                                    autoComplete="off"
                                />
                                <datalist id={datalistId}>
                                    {categoryPresets.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        
                        {/* Image Upload */}
                        <div>
                            <label className="form-label">Product Image</label>
                            
                            {preview ? (
                                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { 
                                            setPreview(null); 
                                            selectedFileRef.current = null;
                                        }}
                                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition-colors backdrop-blur-sm"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <label htmlFor="camera-capture" className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-green-300 rounded-xl cursor-pointer bg-green-50/50 hover:bg-green-50 hover:border-green-400 transition-all group">
                                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📸</span>
                                        <span className="text-xs font-bold text-green-700">Take Photo</span>
                                        <span className="text-[10px] text-green-600 mt-0.5">Opens Camera</span>
                                        <input 
                                            id="camera-capture" 
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment"
                                            className="hidden" 
                                            onChange={handleFileChange} 
                                        />
                                    </label>
                                    <label htmlFor="gallery-upload" className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group">
                                        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🖼️</span>
                                        <span className="text-xs font-bold text-gray-700">From Gallery</span>
                                        <span className="text-[10px] text-gray-500 mt-0.5">Upload File</span>
                                        <input 
                                            id="gallery-upload" 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleFileChange} 
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="form-label mb-0">Description</label>
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A juicy beef burger..." 
                                className="form-input" 
                                rows={2} 
                            />
                        </div>

                        {/* Sizes (Optional — any store type) */}
                        <div>
                            <label className="form-label">Sizes (Optional)</label>
                            <input 
                                name="sizes" 
                                value={sizes}
                                onChange={(e) => setSizes(e.target.value)}
                                placeholder="e.g. S, M, L, XL, XXL" 
                                className="form-input" 
                            />
                            <p className="text-xs text-gray-400 mt-1">Comma-separated. Customers will pick a size before adding to cart.</p>
                        </div>
                    </>
                )}
                
                <button type="submit" disabled={isUploading} className="btn-block mt-2 flex items-center justify-center gap-2">
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={18} /> Add Item</>}
                </button>
            </form>
        </div>
        </>
    );
}
