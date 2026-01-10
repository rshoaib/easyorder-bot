import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/super-admin', '/store/*/admin'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'}/sitemap.xml`,
    };
}
