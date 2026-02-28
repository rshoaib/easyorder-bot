'use server';

import { getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPER_ADMIN_EMAIL = "segmentibi@gmail.com";

// Service-role client for admin operations (bypasses RLS)
function getServiceClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

async function verifySuperAdmin(): Promise<void> {
    // Check cookie-based auth first (set by /super-admin/login)
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';
    if (hasSuperAuth) return;

    // Fallback: Check Supabase Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
        throw new Error("Unauthorized: Super admin access required");
    }
}

export async function createStore(formData: FormData) {
    await verifySuperAdmin();

    const serviceClient = getServiceClient();
    const repo = getTenantRepository(serviceClient);

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const password = formData.get('password') as string;
    const email = formData.get('email') as string;

    if (!name || !slug || !password || !email) throw new Error("Missing fields");

    // Clean slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // 1. Create Supabase Auth user so store owner can log in
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm so they can log in immediately
    });

    if (authError) throw new Error(`Failed to create user: ${authError.message}`);

    // 2. Create tenant linked to the new user
    await repo.createTenant({
        name,
        slug: cleanSlug,
        password,
        email,
        userId: authData.user.id,
        currency: '$',
        themeColor: 'black',
        status: 'active',
        language: 'en'
    });

    revalidatePath('/super-admin');
}

export async function activateTenant(formData: FormData) {
    await verifySuperAdmin();

    const repo = getTenantRepository(getServiceClient());
    const id = formData.get('id') as string;

    if (!id) return;

    await repo.updateTenantStatus(id, 'active');
    revalidatePath('/super-admin');
}

export async function deactivateTenant(formData: FormData) {
    await verifySuperAdmin();

    const repo = getTenantRepository(getServiceClient());
    const id = formData.get('id') as string;

    if (!id) return;

    await repo.updateTenantStatus(id, 'disabled');
    revalidatePath('/super-admin');
}

