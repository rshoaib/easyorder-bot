import { getTenantRepository } from "@/lib/repository";
import CartClient from "./CartClient";

interface Props {
    params: {
        slug: string;
    }
}

export default async function CartPage({ params }: Props) {
    const { slug } = await params;
    
    const repo = getTenantRepository();
    const tenant = await repo.getTenantBySlug(slug);

    if (!tenant) return <div>Store not found</div>;

    return <CartClient tenantId={tenant.id} slug={slug} isOpen={tenant.isOpen ?? true} />;
}
