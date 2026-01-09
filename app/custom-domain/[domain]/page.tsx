import { getTenantRepository, getProductRepository } from "@/lib/repository";
import StoreFront from "@/components/StoreFront";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    domain: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { domain } = await params;
    // Decode if needed, though usually safe
    const decodedDomain = decodeURIComponent(domain);
    const repo = getTenantRepository();
    const tenant = await repo.getTenantByDomain(decodedDomain);

    if (!tenant) return { title: 'Store Not Found' };

    return {
        title: tenant.name,
        description: `Order from ${tenant.name} online.`,
    };
}

export default async function CustomDomainPage({ params }: Props) {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);

  const tenantRepo = getTenantRepository();
  const tenant = await tenantRepo.getTenantByDomain(decodedDomain);

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Domain Not Connected</h1>
        <p className="text-gray-500">The domain "{decodedDomain}" is not connected to any store.</p>
      </div>
    );
  }

  const productRepo = getProductRepository();
  const products = await productRepo.getProducts(tenant.id);

  return <StoreFront initialProducts={products} tenant={tenant} />;
}
