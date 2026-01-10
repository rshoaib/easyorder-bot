'use client';

import { useState } from 'react';
import { uploadProductImage } from '@/lib/storage';
import { addProduct } from './actions';
import { Plus, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';

interface Props {
    slug: string;
    tenantId: string;
}

export default function AddProductForm({ slug, tenantId }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsUploading(true);
        try {
            const file = formData.get('imageFile') as File;
            let imageUrl = formData.get('image') as string;

            // If a file was selected, upload it
            if (file && file.size > 0) {
                const uploadedUrl = await uploadProductImage(file, tenantId);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            // We need to pass the final URL to the server action
            // Since we can't easily modify the formData object passed to the action in the form action prop directly 
            // if we are doing async work first, we'll manually call the action.
            
            // Create a new FormData to send to the server action
            const submitData = new FormData();
            submitData.set('name', formData.get('name') as string);
            submitData.set('price', formData.get('price') as string);
            submitData.set('category', formData.get('category') as string);
            submitData.set('description', formData.get('description') as string);
            submitData.set('image', imageUrl); // This is the string URL

            await addProduct(slug, submitData);
            
            // Reset form (optional, but good UX - simplified here by just reloading or clearing)
            // Ideally we'd reset the form ref, but for MVP let's rely on the action revalidating path
            // to show the new item. We might want to clear the preview manually.
            setPreview(null);
            (document.getElementById('addProductForm') as HTMLFormElement)?.reset();

        } catch (error) {
            console.error(error);
            alert('Failed to add product');
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
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="form-label">Price ($)</label>
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
                    
                    {/* Hidden input for the final URL logic if needed, but we handle in handleSubmit */}
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
                    <label className="form-label">Description</label>
                    <textarea name="description" placeholder="A juicy beef burger..." className="form-input" rows={2} />
                </div>
                
                <button type="submit" disabled={isUploading} className="btn-block mt-2 flex items-center justify-center gap-2">
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Add Item'}
                </button>
            </form>
        </div>
    );
}
