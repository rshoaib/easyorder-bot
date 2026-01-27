import { getTenantRepository } from "@/lib/repository";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href={`/admin/${slug}/menu`} className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Menu
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
            </div>
            
            <ProductForm tenantId={tenant.id} slug={slug} />
        </div>
    );
}
