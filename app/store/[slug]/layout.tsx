import { getTenantRepository } from "@/lib/repository";
import { FacebookPixel } from "@/components/FacebookPixel";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const repo = getTenantRepository();
  const tenant = await repo.getTenantBySlug(slug);

  return (
    <>
      {tenant?.metaPixelId && <FacebookPixel pixelId={tenant.metaPixelId} />}
      {children}
    </>
  );
}
