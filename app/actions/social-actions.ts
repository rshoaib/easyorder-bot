'use server';

import { getTenantRepository } from "@/lib/repository";
import { Product } from "@/lib/repository/types";
import axios from "axios";

export async function handleAutoPost(product: Product, tenantId: string) {
    const repo = getTenantRepository();
    const results = [];

    // --- FACEBOOK POSTING ---
    const fbIntegration = await repo.getIntegration(tenantId, 'facebook');
    if (fbIntegration && fbIntegration.accessToken && fbIntegration.pageId) {
        console.log("Posting to Facebook...");
        const fbResult = await postToFacebook(product, fbIntegration);
        results.push({ provider: 'facebook', ...fbResult });

        if (fbResult.success && fbResult.postId) {
            await repo.saveSocialPost({
                tenantId,
                productId: product.id,
                provider: 'facebook',
                externalPostId: fbResult.postId
            }).catch(err => console.error("Failed to save FB post ID", err));
        }
    }

    // --- INSTAGRAM POSTING ---
    const igIntegration = await repo.getIntegration(tenantId, 'instagram');
    if (igIntegration && igIntegration.accessToken && igIntegration.pageId) {
        console.log("Posting to Instagram...");
        const igResult = await postToInstagram(product, igIntegration);
        results.push({ provider: 'instagram', ...igResult });

        if (igResult.success && igResult.postId) {
            await repo.saveSocialPost({
                tenantId,
                productId: product.id,
                provider: 'instagram',
                externalPostId: igResult.postId
            }).catch(err => console.error("Failed to save IG post ID", err));
        }
    }

    return results;
}

async function postToFacebook(product: Product, integration: any) {
    const message = `🌟 New Item Alert! 🌟\n\nCheck out our delicious new ${product.name}!\n\n${product.description}\n\nOrder now: ${process.env.NEXT_PUBLIC_BASE_URL}/store/${product.tenantId}?product=${product.id}`;

    try {
        let url = `https://graph.facebook.com/v19.0/${integration.pageId}/feed`;
        let payload: any = {
            message: message,
            access_token: integration.accessToken,
            link: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${product.tenantId}`
        };

        if (product.image) {
            url = `https://graph.facebook.com/v19.0/${integration.pageId}/photos`;
            payload = {
                url: product.image,
                caption: message,
                access_token: integration.accessToken
            };
        }

        const response = await axios.post(url, payload);
        return { success: true, postId: response.data.id };
    } catch (error: any) {
        console.error("Facebook post failed:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

async function postToInstagram(product: Product, integration: any) {
    // Instagram requires an image.
    if (!product.image) {
        return { success: false, error: "Image required for Instagram" };
    }

    const caption = `🌟 New Item: ${product.name} 🌟\n${product.description}\n\nLink in bio! #NewItem`;

    try {
        // 1. Create Media Container
        const containerUrl = `https://graph.facebook.com/v19.0/${integration.pageId}/media`; // pageId here is IG Business Account ID
        const containerPayload = {
            image_url: product.image,
            caption: caption,
            access_token: integration.accessToken
        };
        const containerRes = await axios.post(containerUrl, containerPayload);
        const creationId = containerRes.data.id;

        // 2. Publish Media
        const publishUrl = `https://graph.facebook.com/v19.0/${integration.pageId}/media_publish`;
        const publishPayload = {
            creation_id: creationId,
            access_token: integration.accessToken
        };
        const publishRes = await axios.post(publishUrl, publishPayload);

        return { success: true, postId: publishRes.data.id };
    } catch (error: any) {
        console.error("Instagram post failed:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

// Security: Verify tenant ownership for these sensitive actions
import { verifyTenantOwnership } from "@/lib/auth/security";
import { revalidatePath } from "next/cache";

export async function getIntegration(slug: string, provider: 'facebook' | 'instagram') {
    // 1. Verify ownership (Protection against IDOR)
    const { tenant } = await verifyTenantOwnership(slug);

    // 2. Fetch integration
    const repo = getTenantRepository();
    const integration = await repo.getIntegration(tenant.id, provider);

    if (!integration) return null;

    return {
        pageId: integration.pageId,
        accessToken: integration.accessToken,
    };
}

export async function saveIntegration(slug: string, provider: 'facebook' | 'instagram', data: { pageId: string, accessToken: string }) {
    try {
        // 1. Verify ownership
        const { tenant } = await verifyTenantOwnership(slug);

        // 2. Save integration
        const repo = getTenantRepository();
        await repo.saveIntegration({
            tenantId: tenant.id,
            provider,
            pageId: data.pageId,
            accessToken: data.accessToken
        });

        revalidatePath(`/store/${slug}/admin/integrations`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


export async function deleteIntegration(slug: string, provider: 'facebook' | 'instagram') {
    try {
        // 1. Verify ownership
        const { tenant } = await verifyTenantOwnership(slug);

        // 2. Delete integration
        const repo = getTenantRepository();
        await repo.deleteIntegration(tenant.id, provider);

        revalidatePath(`/store/${slug}/admin/integrations`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getPostComments(slug: string, postId: string, provider: 'facebook' | 'instagram') {
    // 1. Verify ownership
    const { tenant } = await verifyTenantOwnership(slug);

    const integration = await getIntegration(slug, provider);
    if (!integration) return { success: false, error: "Integration not found" };

    try {
        const url = `https://graph.facebook.com/v19.0/${postId}/comments?fields=id,message,created_time,from&access_token=${integration.accessToken}`;
        const response = await axios.get(url);
        return { success: true, data: response.data.data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function replyToComment(slug: string, commentId: string, message: string, provider: 'facebook' | 'instagram') {
    // 1. Verify ownership
    const { tenant } = await verifyTenantOwnership(slug);

    const integration = await getIntegration(slug, provider);
    if (!integration) return { success: false, error: "Integration not found" };

    try {
        let replyUrl = `https://graph.facebook.com/v19.0/${commentId}/comments`;
        if (provider === 'instagram') {
            replyUrl = `https://graph.facebook.com/v19.0/${commentId}/replies`;
        }

        await axios.post(replyUrl, {
            message: message,
            access_token: integration.accessToken
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
