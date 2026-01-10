import { getTenantRepository } from "@/lib/repository";
import { FacebookPixel } from "@/components/FacebookPixel";
import { Metadata, Viewport } from "next";

export async function generateViewport({ params }: { params: Promise<{ slug: string }> }): Promise<Viewport> {
    const { slug } = await params;
    const repo = getTenantRepository();
    // Optimization: In a real app we might cache this or accept slightly stale data 
    // to avoid blocking render, but for now we fetch.
    const tenant = await repo.getTenantBySlug(slug);

    return {
        themeColor: tenant?.themeColor || '#e11d48',
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false, // App-like feel
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);
    const name = tenant?.name || "EasyOrder";

    return {
        title: name,
        description: `Order from ${name}`,
        manifest: `/store/${slug}/manifest.webmanifest`, // Next.js creates .webmanifest or .json
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: name,
        },
        icons: {
            apple: '/icons/android-chrome-192x192.png', // Re-use 192 icon for Apple touch
        }
    }
}

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
