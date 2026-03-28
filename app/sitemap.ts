import { MetadataRoute } from 'next';

// Cross-promotion articles that are off-brand — lower priority so Google
// focuses crawl budget on core WhatsApp ordering content.
const CROSS_PROMO_SLUGS = [
    'how-legalpolicygen-solves-your-legal-compliance-problems',
    'ai-privacy-policy-2026-chatgpt-eu-ai-act-compliance',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com';

    // 1. Static Routes — differentiate priorities
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    // 2. Demo Store (the only curated public store)
    const storeRoutes: MetadataRoute.Sitemap = [{
        url: `${baseUrl}/store/demo`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }];

    // 3. Blog Routes
    const { getAllPosts } = await import('@/lib/blog');
    const posts = await getAllPosts();

    const blogIndex: MetadataRoute.Sitemap[0] = {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    };

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: CROSS_PROMO_SLUGS.includes(post.slug) ? 'yearly' as const : 'weekly' as const,
        priority: CROSS_PROMO_SLUGS.includes(post.slug) ? 0.4 : 0.8,
    }));

    return [...staticRoutes, blogIndex, ...blogRoutes, ...storeRoutes];
}
