import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { addProduct, deleteProduct } from "./actions";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function AdminMenuPage({ params }: Props) {
    const { slug } = params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);
    
    if (!tenant) return <div>Tenant not found</div>;

    const repo = getProductRepository();
    const products = await repo.getProducts(tenant.id);

    const addProductWithSlug = addProduct.bind(null, slug);

    return (
        <main className="container pt-6 pb-10" style={{ maxWidth: '900px' }}>
             {/* Header Section */}
             <div className="flex justify-between mb-8 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Menu Manager</h1>
                    <p className="text-gray-500 text-sm">Add or remove items for {tenant.name}</p>
                </div>
                <Link href={`/store/${slug}/admin`}>
                    <button className="btn-secondary">
                        <ArrowLeft size={16} />
                        Back to Orders
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Add Product Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                             <Plus size={18} /> Add New Item
                        </h2>
                        <form action={addProductWithSlug} className="flex flex-col gap-4">
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
                            <div>
                                <label className="form-label">Image URL</label>
                                <input name="image" required placeholder="https://..." className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea name="description" placeholder="A juicy beef burger..." className="form-input" rows={2} />
                            </div>
                            <button type="submit" className="btn-block mt-2">Add Item</button>
                        </form>
                    </div>
                </div>

                {/* Product List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold px-2">Current Menu ({products.length})</h2>
                    {products.map((product: any) => {
                        const deleteProductWithSlug = deleteProduct.bind(null, slug, product.id);
                        return (
                        <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center">
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                                <ImageWithFallback src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{product.name}</h3>
                                <div className="text-sm text-gray-500">{product.category} • ${product.price.toFixed(2)}</div>
                            </div>
                            {/* Delete Button (Wrapped in form for Server Action) */}
                            <form action={deleteProductWithSlug}>
                                <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Item">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    )})}
                    {products.length === 0 && (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            No items in the menu. Add one!
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
