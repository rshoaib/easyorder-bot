import { getProductRepository } from "@/lib/repository";
import StoreFront from "@/components/StoreFront";

// Ensure we always check the database for updates
export const dynamic = 'force-dynamic';

export default async function Home() {
  const repo = getProductRepository();
  const products = await repo.getProducts();
  
  return <StoreFront initialProducts={products} />;
}
