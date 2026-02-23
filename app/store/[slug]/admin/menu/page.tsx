import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { formatPrice } from '@/lib/currency';
import { addProduct, deleteProduct } from "./actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddProductForm from "./AddProductForm";
import ImportExportButtons from "./ImportExportButtons";
import ProductListClient from "./ProductListClient";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function AdminMenuPage({ params }: Props) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);
    
    if (!tenant) return <div>Tenant not found</div>;

    const repo = getProductRepository();
    const products = await repo.getProducts(tenant.id);

    return (
        <main className="container pt-6 pb-10" style={{ maxWidth: '1100px' }}>
            <div className="flex justify-between mb-8 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Product Catalog</h1>
                    <p className="text-gray-500 text-sm">Add or remove items for {tenant.name}</p>
                </div>
                <div className="flex gap-2">
                    <ImportExportButtons slug={slug} products={products} />
                    <Link href={`/store/${slug}/admin`}>
                        <button className="btn-secondary">
                            <ArrowLeft size={16} />
                            Back to Orders
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Add Product Form */}
                <div className="lg:col-span-2">
                    <AddProductForm slug={slug} tenantId={tenant.id} storeName={tenant.name} storeType={tenant.storeType} currency={tenant.currency} />
                </div>

                {/* Product List */}
                <div className="lg:col-span-3 space-y-4 min-w-0">
                    <h2 className="text-lg font-bold px-2">Current Products ({products.length})</h2>
                    <ProductListClient products={products} slug={slug} currency={tenant.currency} />
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

