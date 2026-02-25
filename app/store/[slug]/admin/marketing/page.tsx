import { getTenantRepository } from "@/lib/repository";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import QRCodeGenerator from "@/components/admin/QRCodeGenerator";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    }
}

import SocialAssetGenerator from "@/components/admin/SocialAssetGenerator";

export default async function MarketingPage({ params }: Props) {
    const { slug } = await params;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    const storeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orderviachat.com'}/store/${slug}`;

    return (
        <main className="container pt-1 pb-10" style={{ maxWidth: '900px' }}>
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/store/${slug}/admin`}>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Share2 className="text-indigo-600" /> Marketing Hub
                    </h1>
                    <p className="text-gray-500">Tools to grow your customer base</p>
                </div>
            </div>

            <div className="space-y-10">
                {/* Social Asset Generator */}
                <div>
                    <div className="flex items-end justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Social Assets</h2>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">New</span>
                    </div>
                    <SocialAssetGenerator 
                        storeName={tenant.name} 
                        storeUrl={storeUrl} 
                        themeColor={tenant.themeColor} 
                        logoUrl={tenant.logoUrl}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Store QR Code</h2>
                        <QRCodeGenerator url={storeUrl} storeName={tenant.name} />
                    </div>
                </div>
            </div>
        </main>
    );
}
