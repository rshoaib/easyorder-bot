'use client';

import { createProduct } from "@/app/actions/product-actions";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export default function ProductForm({ tenantId, slug }: { tenantId: string, slug: string }) {
    const createProductWithId = createProduct.bind(null, null as any, tenantId, slug); 
    // wait, I can't bind null as generic arg in TS easily this way. 
    // Better to bind in the action property.

    return (
        <form action={async (formData) => {
            await createProduct(formData, tenantId, slug);
        }} className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
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
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea name="description" rows={3} placeholder="Describe your delicious product..." className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Image URL</label>
                    <input name="image" placeholder="https://..." className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <p className="text-xs text-slate-400">Paste a direct link to an image (optional)</p>
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
