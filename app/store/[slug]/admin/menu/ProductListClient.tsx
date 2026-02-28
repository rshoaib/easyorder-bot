'use client';

import { useState } from 'react';
import EditableProductItem from './EditableProductItem';
import { toggleProductAvailability } from '@/app/actions/product-actions';

interface Props {
    products: any[];
    slug: string;
    tenantId: string;
    currency?: string;
}

export default function ProductListClient({ products, slug, tenantId, currency }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    
    const filteredProducts = products.filter(p => 
        selectedCategory === 'All' || p.category === selectedCategory
    );

    const handleToggle = async (id: string, newAvailability: boolean) => {
        try {
            await toggleProductAvailability(id, newAvailability, slug);
        } catch (e: any) {
            alert(e.message || 'Failed to toggle');
        }
    };

    return (
        <div>
            {categories.length > 2 && (
                <div className="mb-4 flex items-center justify-end gap-3">
                    <span className="text-sm font-bold text-gray-500">Filter:</span>
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="form-input w-40 text-sm py-2"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="space-y-4">
                {filteredProducts.map((product: any) => (
                    <EditableProductItem
                        key={product.id}
                        product={product}
                        slug={slug}
                        tenantId={tenantId}
                        currency={currency}
                        onToggle={handleToggle}
                    />
                ))}
            </div>
        </div>
    );
}
