'use client';

import { useState } from 'react';
import { uploadProductImage, uploadDigitalFile } from '@/lib/storage';
import { addProduct } from './actions';
import { Plus, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

import { generateProductDescription } from '@/app/actions/ai-actions';
import { Sparkles } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/currency';

interface Props {
    slug: string;
    tenantId: string;
    storeName: string;
    storeType?: string;
    currency?: string;
}

export default function AddProductForm({ slug, tenantId, storeName, storeType, currency }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [productType, setProductType] = useState<'physical' | 'digital' | 'service'>('physical');
    const [digitalFileName, setDigitalFileName] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    async function handleAIGenerate() {
        // Get current name/category from form inputs by ID since we don't control them with state for simplicity
        const form = document.getElementById('addProductForm') as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;

        if (!name || !category) {
            alert('Please enter a Name and Category first.');
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateProductDescription(name, category, { name: storeName, type: storeType || 'restaurant' });
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

    async function handleSubmit(formData: FormData) {
        setIsUploading(true);
        setFeedback(null);
        try {
            const file = formData.get('imageFile') as File;
            let imageUrl = formData.get('image') as string;
            const submitData = new FormData();
            
            // If a file was selected, upload it
            if (file && file.size > 0) {
                const uploadedUrl = await uploadProductImage(file, tenantId);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
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

            await addProduct(slug, submitData);
            
            // Success — reset form
            setPreview(null);
            setDescription('');
            setDigitalFileName(null);
            setProductType('physical');
            setFeedback({ type: 'success', message: '✅ Product added successfully!' });
            (document.getElementById('addProductForm') as HTMLFormElement)?.reset();
            setTimeout(() => setFeedback(null), 4000);

        } catch (error: any) {
            console.error(error);
            const msg = error?.message || 'Failed to add product';
            if (msg.includes('logged in') || msg.includes('Unauthenticated') || msg.includes('authenticate')) {
                setFeedback({ type: 'error', message: '🔒 Session expired. Redirecting to login...' });
                setTimeout(() => { window.location.href = `/store/${slug}/admin/login`; }, 2000);
            } else {
                setFeedback({ type: 'error', message: `❌ ${msg}` });
                setTimeout(() => setFeedback(null), 5000);
            }
        } finally {
            setIsUploading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus size={18} /> Add New Item
            </h2>
            <form id="addProductForm" action={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="form-label">Name</label>
                    <input name="name" required placeholder="e.g. Cheese Burger" className="form-input" />
                </div>

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
                        <input name="category" required placeholder="e.g. Burgers" className="form-input" />
                    </div>
                </div>
                
                {/* Image Upload */}
                <div>
                    <label className="form-label">Product Image</label>
                    <input type="hidden" name="image" value={preview || ''} /> 
                    <div className="mt-1 flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                            {preview ? (
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                                    <Upload size={24} className="mb-2" />
                                    <p className="text-xs text-center">Click to upload image</p>
                                </div>
                            )}
                            <input id="dropzone-file" name="imageFile" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="form-label mb-0">Description</label>
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A juicy beef burger..." 
                        className="form-input" 
                        rows={2} 
                    />
                </div>
                
                {feedback && (
                    <div className={`p-3 rounded-xl text-sm font-medium animate-in fade-in duration-300 ${
                        feedback.type === 'success' 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                <button type="submit" disabled={isUploading} className="btn-block mt-2 flex items-center justify-center gap-2">
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Add Item'}
                </button>
            </form>
        </div>
    );
}
