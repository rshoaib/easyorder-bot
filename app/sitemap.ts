import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com';

    // 1. Static Routes (SEO-valuable pages only — no auth pages)
    const routes = [
        '',
        '/services',
        '/privacy-policy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // 2. Demo Store (the only curated public store)
    const storeRoutes = [{
        url: `${baseUrl}/store/demo`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }];

    // 3. Blog Routes
    const { getAllPosts } = await import('@/lib/blog');
    const posts = await getAllPosts();

    const blogIndex = {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    };

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, blogIndex, ...blogRoutes, ...storeRoutes];
}
