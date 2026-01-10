import { getTenantRepository } from '@/lib/repository';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com';
    const repo = getTenantRepository();
    const tenants = await repo.getAllTenants();

    // 1. Static Routes
    const routes = [
        '',
        '/register',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // 2. Dynamic Store Routes
    const storeRoutes = tenants
        .filter((tenant) => tenant.status === 'active')
        .map((tenant) => ({
            url: `${baseUrl}/store/${tenant.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));

    return [...routes, ...storeRoutes];
}
