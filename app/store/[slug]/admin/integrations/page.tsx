import { getTenantRepository } from "@/lib/repository";
import ProGate from "@/components/admin/ProGate";
import IntegrationsClient from "./IntegrationsClient";

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function IntegrationsPage({ params }: Props) {
    const { slug } = await params;
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    return (
        <ProGate plan={tenant?.plan} featureName="Integrations" slug={slug}>
            <IntegrationsClient />
        </ProGate>
    );
}
