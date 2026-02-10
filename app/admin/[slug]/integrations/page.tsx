import { getTenantRepository } from "@/lib/repository";
import IntegrationCard from "@/components/admin/IntegrationCard";
import { saveIntegration } from "@/app/actions/integration-actions";

export default async function IntegrationsPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    // Fetch existing integration config
    const fbIntegration = await repo.getIntegration(tenant.id, 'facebook');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
                <p className="text-slate-500">Connect your store to third-party services.</p>
            </header>

            <div className="grid gap-6">
                <IntegrationCard 
                    tenantId={tenant.id}
                    description="Automatically post new products to your Facebook Page feed."
                    existingConfig={fbIntegration ? { accessToken: fbIntegration.accessToken, pageId: fbIntegration.pageId } : undefined}
                    onSave={async (token, pageId) => {
                        'use server';
                        await saveIntegration(slug, tenant.id, 'facebook', token, pageId);
                    }}
                />
            </div>
        </div>
    );
}
