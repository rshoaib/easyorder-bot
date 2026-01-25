import { getProductRepository, getTenantRepository } from "@/lib/repository";
import StoreFront from "@/components/StoreFront";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) {
        return {
            title: 'Store Not Found',
            description: 'The requested store could not be found.'
        };
    }

    return {
        title: `${tenant.name} | Order Online`,
        description: `Order from ${tenant.name} on WhatsApp. View menu and prices.`,
        openGraph: {
            title: `${tenant.name} | Order Online`,
            description: `Order from ${tenant.name} on WhatsApp. View menu and prices.`,
            type: 'website',
            images: tenant.logoUrl ? [{ url: tenant.logoUrl }] : [],
        },
    };
}

export default async function StorePage({ params }: Props) {
    const { slug } = await params;
    
    const tenantRepo = getTenantRepository();
    const tenant = await tenantRepo.getTenantBySlug(slug);

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
                <p className="text-gray-500">The store "{slug}" does not exist.</p>
            </div>
        );
    }

    const repo = getProductRepository();
    const products = await repo.getProducts(tenant.id);

    // Prioritize logo, then first product, then empty
    const schemaImage = tenant.logoUrl || (products.length > 0 ? products[0].image : "");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": tenant.name,
        "image": schemaImage,
        "@id": `https://${process.env.VERCEL_URL || 'orderviachat.com'}/store/${slug}`,
        "url": `https://${process.env.VERCEL_URL || 'orderviachat.com'}/store/${slug}`,
        "telephone": tenant.ownerPhone || "",
        "priceRange": "$$", // Defaulting to medium price range
        "menu": {
            "@type": "Menu",
            "hasMenuSection": [
                {
                    "@type": "MenuSection",
                    "name": "All Items",
                    "hasMenuItem": products.map(product => ({
                        "@type": "MenuItem",
                        "name": product.name,
                        "description": product.description,
                        "offers": {
                            "@type": "Offer",
                            "price": product.price,
                            "priceCurrency": tenant.currency
                        }
                    }))
                }
            ]
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StoreFront initialProducts={products} tenant={tenant} />
        </>
    );
}
