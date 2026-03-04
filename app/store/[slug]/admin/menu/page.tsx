import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
        <main className="container pt-1 pb-10" style={{ maxWidth: '1100px' }}>
            {/* Header */}
            <div className="flex justify-between mb-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Product Catalog</h1>
                    <p className="text-gray-500 text-sm">Add or remove items for {tenant.name}</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <ImportExportButtons slug={slug} products={products} />
                    {/* Fix 8: Prominent "View Store" button */}
                    <Link href={`/store/${slug}`} target="_blank">
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-xl transition-colors">
                            <ExternalLink size={14} /> View Store
                        </button>
                    </Link>
                    <Link href={`/store/${slug}/admin`}>
                        <button className="btn-secondary">
                            <ArrowLeft size={16} />
                            Dashboard
                        </button>
                    </Link>
                </div>
            </div>

            {/* Fix 3: On mobile, form comes first (order-first).
                On desktop, grid is 2+3 with form on left. */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 gap-6">
                
                {/* Product List — shows first on desktop (right), second on mobile */}
                <div className="lg:col-span-3 space-y-4 min-w-0 order-2 lg:order-2">
                    <ProductListClient products={products} slug={slug} tenantId={tenant.id} currency={tenant.currency} />
                    {products.length === 0 && (
                        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                            <p className="text-4xl mb-3">📦</p>
                            <p className="font-bold text-gray-700 mb-1">No products yet</p>
                            <p className="text-sm text-gray-400 mb-4">Add your first item using the form on the left.</p>
                            <a href="#addProductForm">
                                <button className="btn-primary text-sm px-4 py-2">+ Add First Item</button>
                            </a>
                        </div>
                    )}
                </div>

                {/* Add Product Form — shows first on mobile (order-first), left on desktop */}
                <div className="lg:col-span-2 order-1 lg:order-1">
                    <AddProductForm
                        slug={slug}
                        tenantId={tenant.id}
                        storeName={tenant.name}
                        storeType={tenant.storeType}
                        currency={tenant.currency}
                        initialProductCount={products.length}
                    />
                </div>
            </div>
        </main>
    );
}

