'use server';

import { getPromoCodeRepository } from "@/lib/repository";
import { verifyTenantOwnership } from "@/lib/auth/security";

export async function validatePromoCode(code: string, tenantId: string) {
    const repo = getPromoCodeRepository();
    const promo = await repo.getPromo(code, tenantId);

    if (!promo || !promo.isActive) {
        return { success: false, message: 'Invalid or expired promo code' };
    }

    return {
        success: true,
        promo: {
            code: promo.code,
            discountType: promo.discountType,
            value: promo.value
        }
    };
}

export async function createPromoCode(formData: FormData, tenantId: string, slug: string) {
    // Security Check
    await verifyTenantOwnership(slug);

    const code = formData.get('code') as string;
    const type = formData.get('type') as 'percent' | 'fixed';
    const value = parseFloat(formData.get('value') as string);

    if (!code || !type || isNaN(value)) {
        return { success: false, message: 'Invalid input' };
    }

    const repo = getPromoCodeRepository();
    try {
        await repo.createPromo({
            tenantId,
            code: code.toUpperCase(),
            discountType: type,
            value
        });
        return { success: true };
    } catch (e) {
        return { success: false, message: 'Failed to create promo code. Code might already exist.' };
    }
}

export async function togglePromoAction(id: string, isActive: boolean, slug: string) {
    // Security Check
    await verifyTenantOwnership(slug);

    const repo = getPromoCodeRepository();
    await repo.togglePromo(id, isActive);
    return { success: true };
}

