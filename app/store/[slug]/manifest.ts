
import { MetadataRoute } from 'next';
import { getTenantRepository } from '@/lib/repository';

export default async function manifest({ params }: { params: { slug: string } }): Promise<MetadataRoute.Manifest> {
    const { slug } = await params;

    // Default fallback
    let name = "EasyOrder Store";
    let shortName = "EasyOrder";
    let themeColor = "#e11d48"; // Default pink

    try {
        const repo = getTenantRepository();
        const tenant = await repo.getTenantBySlug(slug);

        if (tenant) {
            name = tenant.name;
            // Short name should be short
            shortName = tenant.name.split(' ').slice(0, 2).join(' ').substring(0, 12);
            themeColor = tenant.themeColor || "#e11d48";
        }
    } catch (e) {
        console.error("Manifest generation failed", e);
    }

    return {
        name: name,
        short_name: shortName,
        description: `Order from ${name}`,
        start_url: `/store/${slug}`,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: themeColor,
        icons: [
            {
                src: '/icons/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
