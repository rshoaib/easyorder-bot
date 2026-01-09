'use server';

import { getProductRepository } from "@/lib/repository";
import { Product } from "@/lib/repository/types";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
    const repo = getProductRepository();

    // Simple random ID for MVP. In prod use uuid or let DB handle it.
    const id = Date.now().toString();

    const product: Product = {
        id,
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        image: formData.get('image') as string,
        description: formData.get('description') as string || '',
    };

    await repo.addProduct(product);
    revalidatePath('/admin/menu');
    revalidatePath('/'); // Update homepage too
}

export async function deleteProduct(id: string) {
    const repo = getProductRepository();
    await repo.deleteProduct(id);
    revalidatePath('/admin/menu');
    revalidatePath('/');
}
