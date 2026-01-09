import { getProductRepository, getTenantRepository } from "@/lib/repository";
import StoreFront from "@/components/StoreFront";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export default async function StorePage({ params }: Props) {
    const { slug } = await params;
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
                <p className="text-gray-500">The store "{slug}" does not exist.</p>
            </div>
        );
    }

    const repo = getProductRepository();
    const products = await repo.getProducts(tenant.id);

    // We can pass tenant details to StoreFront for branding if we want later (name, theme color)
    return <StoreFront initialProducts={products} />; 
}
