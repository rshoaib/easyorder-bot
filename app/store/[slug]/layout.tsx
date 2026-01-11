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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`;
    // Fallback to static manifest for demo to ensure PWABuilder crawler doesn't timeout
    const manifestUrl = slug === 'demo' 
        ? `/manifest.json`
        : `/store/${slug}/manifest.webmanifest`;

    return {
        title: name,
        description: `Order from ${name}`,
        manifest: manifestUrl,
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
      
      {/* Demo Admin Access Button */}
      {slug === 'demo' && (
        <a 
          href="/store/demo/admin" 
          className="fixed bottom-24 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-full shadow-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform border border-gray-700 animate-bounce"
        >
          Try Admin Panel 🚀
        </a>
      )}
    </>
  );
}
