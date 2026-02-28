'use client';

import { useState, useRef } from 'react';
import { updateProduct, deleteProduct } from './actions';
import { Pencil, Trash2, Save, X, Loader2, AlertTriangle, Camera, ImageIcon } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { formatPrice } from '@/lib/currency';
import { uploadProductImage } from '@/lib/storage';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface Props {
    product: any;
    slug: string;
    tenantId: string;
    currency?: string;
    onToggle: (id: string, newAvailability: boolean) => Promise<void>;
}

export default function EditableProductItem({ product, slug, tenantId, currency, onToggle }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isAvailable, setIsAvailable] = useState(product.isAvailable);
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [category, setCategory] = useState(product.category);
    const [editPreview, setEditPreview] = useState<string | null>(null);
    const editFileRef = useRef<File | null>(null);

    const handleToggle = async () => {
        if (isToggling) return;
        setIsToggling(true);
        const newState = !isAvailable;
        setIsAvailable(newState);
        try {
            await onToggle(product.id, newState);
        } catch (e) {
            setIsAvailable(!newState);
        } finally {
            setIsToggling(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let imageUrl: string | undefined = undefined;

            // Upload new image if one was selected
            if (editFileRef.current && editFileRef.current.size > 0) {
                const supabase = createClient();
                const uploadedUrl = await uploadProductImage(editFileRef.current, tenantId, supabase);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            await updateProduct(slug, product.id, {
                name,
                price: parseFloat(price),
                category,
                ...(imageUrl !== undefined ? { image: imageUrl } : {}),
            });
            setIsEditing(false);
            setEditPreview(null);
            editFileRef.current = null;
        } catch (e: any) {
            alert(e.message || 'Failed to update');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(false);
        setIsDeleting(true);
        try {
            await deleteProduct(slug, product.id);
        } catch (e: any) {
            alert(e.message || 'Failed to delete');
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setName(product.name);
        setPrice(product.price.toString());
        setCategory(product.category);
        setEditPreview(null);
        editFileRef.current = null;
        setIsEditing(false);
    };

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            editFileRef.current = file;
            setEditPreview(URL.createObjectURL(file));
        }
    };

    const currentImage = editPreview || product.image;
    const hasNoImage = !product.image || product.image === '';

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 flex flex-col gap-3 animate-in fade-in duration-200">
                <div className="flex gap-3 items-start">
                    {/* Editable Image */}
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 group">
                        {editPreview ? (
                            <Image src={editPreview} alt="Preview" fill className="object-cover" />
                        ) : (
                            <ImageWithFallback src={product.image} alt={product.name} fill className="object-cover" />
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                            <div className="text-white text-center">
                                <Camera size={16} className="mx-auto mb-0.5" />
                                <span className="text-[9px] font-bold">Change</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleEditFileChange}
                            />
                        </label>
                        {editPreview && (
                            <button
                                type="button"
                                onClick={() => { setEditPreview(null); editFileRef.current = null; }}
                                className="absolute top-0.5 right-0.5 bg-red-500 text-white w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                            placeholder="Product name"
                        />
                        <div className="flex gap-2">
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                step="0.01"
                                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                                placeholder="Price"
                            />
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                                placeholder="Category"
                            />
                        </div>
                    </div>
                </div>

                {/* Image upload hint for products without images */}
                {hasNoImage && !editPreview && (
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-amber-300 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors">
                        <ImageIcon size={16} className="text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">No image — click to upload one</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditFileChange}
                        />
                    </label>
                )}

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1"
                    >
                        <X size={14} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-1.5 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                {/* Top Row: Image + Name + Edit */}
                <div className="flex gap-3 items-center">
                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                        <ImageWithFallback src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{product.name}</h3>
                        <div className="text-sm text-gray-500">{product.category} • {formatPrice(product.price, currency)}</div>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                        title="Edit product"
                    >
                        <Pencil size={13} /> Edit
                    </button>
                </div>
                {/* Bottom Row: Toggle + Stock Status + Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={handleToggle}
                            disabled={isToggling}
                            className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${isAvailable ? 'bg-blue-600' : 'bg-gray-200'} ${isToggling ? 'opacity-60' : ''}`}
                            title={isAvailable ? 'Mark as Sold Out' : 'Mark as Available'}
                        >
                            <span className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform border border-gray-300 ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                            {isToggling ? <Loader2 size={12} className="animate-spin inline" /> : (isAvailable ? '✓ In Stock' : 'Sold Out')}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1 text-xs"
                        title="Delete product"
                    >
                        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200" onClick={() => setShowDeleteConfirm(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Delete Product</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete <strong>&quot;{product.name}&quot;</strong>? This will permanently remove it from your store.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
