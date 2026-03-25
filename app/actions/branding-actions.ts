'use server';

import { getTenantRepository } from "@/lib/repository";
import { uploadTenantLogo } from "@/lib/storage";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function updateBranding(formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "You must be logged in to update branding." };
        }

        const tenantId = formData.get('tenantId') as string;
        const slug = formData.get('slug') as string;

        if (!tenantId || !slug) {
            return { error: "Missing required fields (tenantId or slug)." };
        }

        const themeColor = formData.get('themeColor') as string;
        const name = formData.get('name') as string;
        const logoFile = formData.get('logo') as File;

        // Use admin client for the update to bypass any RLS write restrictions
        const adminClient = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verify ownership using the user client
        const { data: tenantData } = await supabase
            .from('tenants')
            .select('id, user_id')
            .eq('id', tenantId)
            .single();

        if (!tenantData) {
            return { error: "Store not found." };
        }

        // Allow if owner or if slug is demo (already blocked via disabled button)
        if (tenantData.user_id && tenantData.user_id !== user.id) {
            return { error: "You do not have permission to edit this store." };
        }

        let logoUrl: string | undefined = undefined;

        if (logoFile && logoFile.size > 0 && logoFile.name !== 'undefined') {
            // Use admin client for storage upload too (avoids storage RLS issues)
            const uploadedUrl = await uploadTenantLogo(logoFile, tenantId, adminClient);
            if (uploadedUrl) {
                logoUrl = uploadedUrl;
            } else {
                return { error: "Logo upload failed. Please try a different image (PNG/JPG/WEBP, max 2MB)." };
            }
        }

        const repo = getTenantRepository(adminClient);
        await repo.updateTenantSettings(tenantId, {
            themeColor,
            logoUrl,
            name
        });

        revalidatePath(`/store/${slug}`);
        revalidatePath(`/store/${slug}/admin/settings`);
        return { success: true };

    } catch (error: any) {
        console.error("Error updating branding:", error);
        // Return specific error message so the UI is helpful, not generic
        return { error: error.message || "Failed to update branding. Please try again." };
    }
}
