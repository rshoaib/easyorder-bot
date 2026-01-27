import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import ProductToggle from "@/components/admin/ProductToggle";

export default async function MenuPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    const productRepo = getProductRepository();
    const products = await productRepo.getProducts(tenant.id);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Menu Management</h1>
                    <p className="text-slate-500">Manage your products and availability</p>
                </div>
                <Link href={`/admin/${slug}/menu/new`}>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <Plus size={20} />
                        Add Product
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Product</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Available</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {product.image && (
                                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                        )}
                                        <div>
                                            <div className="font-bold text-slate-900">{product.name}</div>
                                            <div className="text-xs text-slate-400 max-w-xs truncate">{product.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-slate-900">
                                    {tenant.currency} {product.price}
                                </td>
                                <td className="px-6 py-4">
                                    <ProductToggle id={product.id} initialAvailable={product.isAvailable} slug={slug} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No products found. Click "Add Product" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
