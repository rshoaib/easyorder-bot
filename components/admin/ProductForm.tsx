'use client';

import { createProduct } from "@/app/actions/product-actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { uploadProductImage } from "@/lib/storage";
import { useState } from "react";
import { getPreset } from "@/lib/presets";

interface Props {
    tenantId: string;
    slug: string;
    storeType?: string;
    storeName: string; // New context
}

import { generateProductDescription } from '@/app/actions/ai-actions';
import { Sparkles, Save, Loader2, ArrowLeft } from "lucide-react";

export default function ProductForm({ tenantId, slug, storeType, storeName }: Props) {
    const [uploading, setUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    
    // Determine labels based on store type
    // We can extend presets.ts or just handle simple logic here
    const type = storeType || 'restaurant';
    
    const ingredientsLabel = {
        restaurant: 'Ingredients',
        retail: 'Specifications / Details',
        service: 'Service Details',
        digital: 'File / Access Details'
    }[type] || 'Ingredients';

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploading(true);
        const file = e.target.files[0];
        try {
            const url = await uploadProductImage(file, tenantId);
            if (url) {
                setImageUrl(url);
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
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
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                            className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors"
                        >
                            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isGenerating ? 'Writing...' : 'Auto-Write ✨'}
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
                            {uploading && <p className="text-xs text-indigo-600 mt-1">Uploading...</p>}
                            <p className="text-xs text-slate-400 mt-1">Upload a JPG or PNG (Max 2MB)</p>
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
