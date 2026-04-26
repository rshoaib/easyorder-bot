import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getTenantRepository } from "@/lib/repository";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SuperAdminClient from "./SuperAdminClient";
import type { StoreRow, SubscriptionRow } from "./types";

export const dynamic = "force-dynamic";

/**
 * Super-admin dashboard.
 *
 * Thin server shell: authenticate, fetch tenants + product counts +
 * order counts + subscriptions in parallel, then hand off to the client.
 * All write operations live in ./actions.ts as server actions.
 */
export default async function SuperAdminPage() {
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get("super_auth")?.value === "true";
    if (!hasSuperAuth) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== "segmentibi@gmail.com") {
            redirect("/super-admin/login");
        }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const repo = getTenantRepository(adminClient);

    const [tenants, rawSubsRes, productsRes, ordersRes, tenantMetaRes] =
        await Promise.all([
            repo.getAllTenants(),
            adminClient
                .from("subscriptions")
                .select("*, tenants(name)")
                .order("created_at", { ascending: false }),
            adminClient.from("products").select("tenant_id"),
            adminClient.from("orders").select("tenant_id, total, date"),
            // Tenant.createdAt isn't on the repo's Tenant type — fetch it separately.
            adminClient.from("tenants").select("id, created_at"),
        ]);

    const rawSubs = rawSubsRes.data || [];
    const products = productsRes.data || [];
    const orders = ordersRes.data || [];
    const tenantMeta = tenantMetaRes.data || [];

    const productCount: Record<string, number> = {};
    for (const p of products) {
        productCount[p.tenant_id] = (productCount[p.tenant_id] || 0) + 1;
    }
    const orderCount: Record<string, number> = {};
    const lastOrder: Record<string, string> = {};
    const tenantRevenue: Record<string, number> = {};
    for (const o of orders) {
        orderCount[o.tenant_id] = (orderCount[o.tenant_id] || 0) + 1;
        tenantRevenue[o.tenant_id] = (tenantRevenue[o.tenant_id] || 0) + Number(o.total || 0);
        if (!lastOrder[o.tenant_id] || o.date > lastOrder[o.tenant_id]) {
            lastOrder[o.tenant_id] = o.date;
        }
    }
    const createdAtMap: Record<string, string> = {};
    for (const t of tenantMeta) {
        createdAtMap[t.id] = t.created_at;
    }

    const stores: StoreRow[] = tenants.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        email: t.email,
        ownerPhone: t.ownerPhone,
        plan: t.plan ?? "free",
        status: t.status,
        currency: t.currency,
        subscriptionEndDate: t.subscriptionEndDate,
        createdAt: createdAtMap[t.id] ?? null,
        productCount: productCount[t.id] ?? 0,
        orderCount: orderCount[t.id] ?? 0,
        revenue: tenantRevenue[t.id] ?? 0,
        lastOrderAt: lastOrder[t.id] ?? null,
    }));

    const subscriptions: SubscriptionRow[] = rawSubs.map((s: {
        id: string;
        tenant_id: string;
        tenants?: { name?: string };
        plan: string;
        amount_pkr: number | null;
        payment_date: string;
        start_date: string;
        end_date: string;
        duration_months: number | null;
        notes: string | null;
        created_at: string;
    }) => ({
        id: s.id,
        tenantId: s.tenant_id,
        tenantName: s.tenants?.name ?? "—",
        plan: s.plan,
        amountPkr: s.amount_pkr,
        paymentDate: s.payment_date,
        startDate: s.start_date,
        endDate: s.end_date,
        durationMonths: s.duration_months,
        notes: s.notes,
        createdAt: s.created_at,
    }));

    return <SuperAdminClient stores={stores} subscriptions={subscriptions} />;
}
