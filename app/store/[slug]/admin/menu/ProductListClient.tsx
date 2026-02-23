'use client';

import EditableProductItem from './EditableProductItem';
import { toggleProductAvailability } from '@/app/actions/product-actions';

interface Props {
    products: any[];
    slug: string;
    currency?: string;
}

export default function ProductListClient({ products, slug, currency }: Props) {
    const handleToggle = async (id: string, isAvailable: boolean) => {
        try {
            await toggleProductAvailability(id, !isAvailable, slug);
        } catch (e: any) {
            alert(e.message || 'Failed to toggle');
        }
    };

    return (
        <div className="space-y-4">
            {products.map((product: any) => (
                <EditableProductItem
                    key={product.id}
                    product={product}
                    slug={slug}
                    currency={currency}
                    onToggle={handleToggle}
                />
            ))}
        </div>
    );
}
