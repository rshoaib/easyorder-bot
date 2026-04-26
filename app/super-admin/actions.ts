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

export async function setProPlan(formData: FormData) {
    await verifySuperAdmin();

    const repo = getTenantRepository(getServiceClient());
    const id = formData.get('id') as string;
    const amountPkr = parseFloat(formData.get('amountPkr') as string) || 0;
    const paymentDate = formData.get('paymentDate') as string;
    const durationMonths = parseInt(formData.get('durationMonths') as string) || 12;
    const notes = formData.get('notes') as string || '';

    if (!id || !paymentDate) throw new Error("Missing required fields");

    // Calculate start/end dates
    const startDate = paymentDate; // subscription starts on payment date
    const endDateObj = new Date(paymentDate);
    endDateObj.setMonth(endDateObj.getMonth() + durationMonths);
    const endDate = endDateObj.toISOString().split('T')[0];

    // Set plan + dates on tenant
    await repo.setTenantPlan(id, 'pro', startDate, endDate);

    // Record subscription payment
    await repo.addSubscription({
        tenantId: id,
        plan: 'pro',
        amountPkr,
        paymentDate,
        startDate,
        endDate,
        durationMonths,
        notes
    });

    revalidatePath('/super-admin');
}

export async function downgradePlan(formData: FormData) {
    await verifySuperAdmin();

    const repo = getTenantRepository(getServiceClient());
    const id = formData.get('id') as string;

    if (!id) return;

    await repo.setTenantPlan(id, 'free');
    revalidatePath('/super-admin');
}

export async function clearOrderHistory(formData: FormData) {
    await verifySuperAdmin();

    const id = formData.get('id') as string;
    if (!id) return;

    const serviceClient = getServiceClient();

    // Delete all orders for this tenant (permanent)
    const { error } = await serviceClient
        .from('orders')
        .delete()
        .eq('tenant_id', id);

    if (error) throw new Error(`Failed to clear orders: ${error.message}`);

    revalidatePath('/super-admin');
}

/**
 * Bulk-delete stores and all their dependent rows (orders, products,
 * promo_codes, subscriptions). Used by the Cleanup tab to purge abandoned
 * stores in one click. Mirrors the transactional cascade we ran manually
 * against the production DB on 2026-04-26.
 *
 * Callers are responsible for confirmation UX. This is destructive and
 * cannot be undone. Returns the count of tenants actually deleted.
 */
export async function bulkDeleteStores(ids: string[]): Promise<{ deleted: number }> {
    await verifySuperAdmin();

    if (!Array.isArray(ids) || ids.length === 0) return { deleted: 0 };

    const sc = getServiceClient();

    // Hard-coded protected slugs that must never be bulk-deleted.
    // 'demo' is the Pizza Palace demo store; 'default' is the system fallback tenant.
    const { data: protectedRows } = await sc
        .from('tenants')
        .select('id')
        .in('slug', ['demo', 'default']);
    const protectedIds = new Set((protectedRows || []).map((r: { id: string }) => r.id));
    const safeIds = ids.filter(id => !protectedIds.has(id));

    if (safeIds.length === 0) return { deleted: 0 };

    // Delete child rows first to satisfy FK constraints.
    // (Order matches the production purge: orders → products → promos → subs → tenant)
    const tables = ['orders', 'products', 'promo_codes', 'subscriptions'] as const;
    for (const table of tables) {
        const { error } = await sc.from(table).delete().in('tenant_id', safeIds);
        if (error) throw new Error(`Failed to delete from ${table}: ${error.message}`);
    }

    const { error: tenantErr, count } = await sc
        .from('tenants')
        .delete({ count: 'exact' })
        .in('id', safeIds);
    if (tenantErr) throw new Error(`Failed to delete tenants: ${tenantErr.message}`);

    revalidatePath('/super-admin');
    return { deleted: count ?? safeIds.length };
}
