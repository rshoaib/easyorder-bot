'use client';

import { useState } from 'react';
import { updateProduct, deleteProduct } from './actions';
import { Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { formatPrice } from '@/lib/currency';

interface Props {
    product: any;
    slug: string;
    currency?: string;
    onToggle: (id: string, isAvailable: boolean) => void;
}

export default function EditableProductItem({ product, slug, currency, onToggle }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [category, setCategory] = useState(product.category);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProduct(slug, product.id, {
                name,
                price: parseFloat(price),
                category,
            });
            setIsEditing(false);
        } catch (e: any) {
            alert(e.message || 'Failed to update');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this product?')) return;
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
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 flex flex-col gap-3 animate-in fade-in duration-200">
                <div className="flex gap-3 items-start">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                        <ImageWithFallback src={product.image} alt={product.name} fill className="object-cover" />
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
                        Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center">
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                <ImageWithFallback src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold">{product.name}</h3>
                <div className="text-sm text-gray-500">{product.category} • {formatPrice(product.price, currency)}</div>
            </div>
            <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Edit product"
            >
                <Pencil size={16} />
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={product.isAvailable}
                    onChange={(e) => onToggle(product.id, e.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-1 text-xs text-gray-500">{product.isAvailable ? 'In Stock' : 'Out'}</span>
            </label>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-400 hover:text-red-600 transition-colors p-2 disabled:opacity-50"
                title="Delete product"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
        </div>
    );
}
