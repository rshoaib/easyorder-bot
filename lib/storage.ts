import { supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIGITAL_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function validateFile(file: File, maxSize: number, allowedTypes?: string[]): void {
    if (file.size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        throw new Error(`File too large. Maximum size is ${sizeMB}MB.`);
    }
    if (allowedTypes && !allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type "${file.type}". Allowed: ${allowedTypes.join(', ')}`);
    }
}

export async function uploadProductImage(file: File, tenantId: string, client: SupabaseClient = supabase): Promise<string | null> {
    validateFile(file, MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES);

    const fileExt = file.name.split('.').pop();
    const fileName = `${tenantId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('[uploadProductImage] Uploading to product-images:', filePath, 'size:', file.size, 'type:', file.type);

    const { data: uploadData, error } = await client.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });

    if (error) {
        console.error('[uploadProductImage] Upload error:', error.message, error);
        throw new Error('Image upload failed: ' + error.message);
    }

    console.log('[uploadProductImage] Upload success:', uploadData);

    const { data } = client.storage
        .from('product-images')
        .getPublicUrl(filePath);

    console.log('[uploadProductImage] Public URL:', data.publicUrl);

    return data.publicUrl;
}

export async function uploadTenantLogo(file: File, tenantId: string, client: SupabaseClient = supabase): Promise<string | null> {
    validateFile(file, MAX_LOGO_SIZE, ALLOWED_IMAGE_TYPES);

    const fileExt = file.name.split('.').pop();
    const fileName = `${tenantId}/logo_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await client.storage
        .from('logos')
        .upload(filePath, file, {
            upsert: true
        });

    if (error) {
        console.error('Error uploading logo:', error);
        return null;
    }

    const { data } = client.storage
        .from('logos')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function uploadDigitalFile(file: File, tenantId: string): Promise<string | null> {
    validateFile(file, MAX_DIGITAL_SIZE);

    const fileExt = file.name.split('.').pop();
    // Obscure the filename for MVP security
    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fileName = `${tenantId}/${randomHash}.${fileExt}`;
    const filePath = `${fileName}`;

    // Ensure you create a 'digital-products' public bucket in Supabase console
    const { error } = await supabase.storage
        .from('digital-products')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading digital file:', error);
        return null; // Fail gracefully
    }

    const { data } = supabase.storage
        .from('digital-products')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

