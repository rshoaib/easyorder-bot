import { getProductRepository, getTenantRepository } from "@/lib/repository";
import StoreFront from "@/components/StoreFront";

// Ensure we always check the database for updates
export const dynamic = 'force-dynamic';

export default async function Home() {
  const tenantRepo = getTenantRepository();
  const tenant = await tenantRepo.getTenantBySlug('default');
  
  if (!tenant) {
      return <div className="p-10 text-center">Store not found. Please run migration.</div>;
  }

  const repo = getProductRepository();
  const products = await repo.getProducts(tenant.id);
  
  return <StoreFront initialProducts={products} />;
}
