'use server';

import { getTenantRepository } from "@/lib/repository";
import { uploadTenantLogo } from "@/lib/storage";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBranding(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const tenantId = formData.get('tenantId') as string;
    const slug = formData.get('slug') as string;
    const themeColor = formData.get('themeColor') as string;
    const logoFile = formData.get('logo') as File;

    if (!tenantId || !slug) {
        return { error: "Missing required fields" };
    }

    const repo = getTenantRepository(supabase);
    // Verify ownership (optional but good practice, though RLS handles it at repo level usually)
    // Here we trust the repo/RLS

    let logoUrl: string | undefined = undefined;

    if (logoFile && logoFile.size > 0 && logoFile.name !== 'undefined') {
        const uploadedUrl = await uploadTenantLogo(logoFile, tenantId, supabase);
        if (uploadedUrl) {
            logoUrl = uploadedUrl;
        }
    }

    try {
        await repo.updateTenantSettings(
            tenantId,
            undefined, // ownerPhone
            undefined, // instagram
            undefined, // facebook
            undefined, // pixel
            undefined, // currency
            themeColor,
            logoUrl
        );

        revalidatePath(`/store/${slug}`);
        revalidatePath(`/store/${slug}/admin/settings`);
        return { success: true };
    } catch (error: any) {
        console.error("Error updating branding:", error);
        return { error: error.message || "Failed to update branding" };
    }
}
