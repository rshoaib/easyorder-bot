'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const SUPER_ADMIN_EMAIL = "segmentibi@gmail.com";

async function verifySuperAdmin(): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
        throw new Error("Unauthorized: Super admin access required");
    }
}

export async function createStore(formData: FormData) {
    await verifySuperAdmin();

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
        status: 'active',
        language: 'en'
    });

    revalidatePath('/super-admin');
}

export async function activateTenant(formData: FormData) {
    await verifySuperAdmin();

    const repo = getTenantRepository();
    const id = formData.get('id') as string;

    if (!id) return;

    await repo.updateTenantStatus(id, 'active');
    revalidatePath('/super-admin');
}

export async function deactivateTenant(formData: FormData) {
    await verifySuperAdmin();

    const repo = getTenantRepository();
    const id = formData.get('id') as string;

    if (!id) return;

    await repo.updateTenantStatus(id, 'disabled');
    revalidatePath('/super-admin');
}

