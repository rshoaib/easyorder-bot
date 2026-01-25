import { supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export async function uploadProductImage(file: File, tenantId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${tenantId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function uploadTenantLogo(file: File, tenantId: string, client: SupabaseClient = supabase): Promise<string | null> {
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
