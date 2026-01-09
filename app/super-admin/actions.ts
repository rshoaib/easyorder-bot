'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";

export async function createStore(formData: FormData) {
    const repo = getTenantRepository();

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const password = formData.get('password') as string;

    if (!name || !slug || !password) throw new Error("Missing fields");

    // Clean slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    await repo.createTenant({
        name,
        slug: cleanSlug,
        password,
        currency: '$',
        themeColor: 'black',
        status: 'active'
    });

    revalidatePath('/super-admin');
}
