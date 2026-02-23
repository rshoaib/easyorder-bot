'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/app/store/[slug]/admin/menu/actions';

interface Props {
    productId: string;
    slug: string;
}

export default function DeleteProductButton({ productId, slug }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Delete this product?')) return;
        setIsDeleting(true);
        try {
            await deleteProduct(slug, productId);
        } catch (e: any) {
            alert(e.message || 'Failed to delete');
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete product"
        >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    );
}
