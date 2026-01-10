import { supabase } from './supabase';

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
