'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";
import { verifyTenantOwnership } from "@/lib/auth/security";

export async function saveIntegration(slug: string, tenantId: string, provider: 'facebook', token: string, pageId: string) {
    await verifyTenantOwnership(slug);

    const repo = getTenantRepository();
    await repo.saveIntegration({
        tenantId,
        provider,
        accessToken: token,
        pageId
    });

    revalidatePath(`/store/${slug}/admin/integrations`);
    return { success: true };
}
