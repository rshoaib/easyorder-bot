'use server';

import { getTenantRepository } from "@/lib/repository";
import { Product } from "@/lib/repository/types";
import axios from "axios";

export async function handleAutoPost(product: Product, tenantId: string) {
    // 1. Check if auto-post is enabled/configured for this tenant
    const repo = getTenantRepository();
    const integration = await repo.getIntegration(tenantId, 'facebook');

    if (!integration || !integration.accessToken || !integration.pageId) {
        console.log("Auto-post skipped: No Facebook integration found.");
        return { success: false, message: "Integration not configured" };
    }

    // 2. Prepare the post content
    const message = `🌟 New Item Alert! 🌟\n\nCheck out our delicious new ${product.name}!\n\n${product.description}\n\nOrder now: ${process.env.NEXT_PUBLIC_BASE_URL}/store/${product.tenantId}?product=${product.id}`; // Ideally use slug, but tenantId is safer if slug not passed

    // 3. Post to Facebook Graph API
    try {
        let url = `https://graph.facebook.com/v19.0/${integration.pageId}/feed`;
        let payload: any = {
            message: message,
            access_token: integration.accessToken,
            link: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${product.tenantId}` // Link to store
        };

        // If product has an image, we might want to post a photo instead
        if (product.image) {
            url = `https://graph.facebook.com/v19.0/${integration.pageId}/photos`;
            payload = {
                url: product.image,
                caption: message,
                access_token: integration.accessToken
            };
        }

        const response = await axios.post(url, payload);

        console.log("Auto-post successful:", response.data);
        return { success: true, postId: response.data.id };

    } catch (error: any) {
        console.error("Auto-post failed:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}
