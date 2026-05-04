/**
 * Shared types between the super-admin server page and its client tabs.
 * Keep this file pure (no JSX, no client-only imports) so it can be
 * imported from both server components and client components.
 */

export interface StoreRow {
    id: string;
    slug: string;
    name: string;
    email?: string;
    ownerPhone?: string;
    plan: "free" | "pro";
    status: "active" | "pending_payment" | "disabled";
    currency: string;
    subscriptionEndDate?: string;
    createdAt: string | null;
    productCount: number;
    orderCount: number;
    revenue: number;
    lastOrderAt: string | null;
}

export interface SubscriptionRow {
    id: string;
    tenantId: string;
    tenantName: string;
    plan: string;
    amountPkr: number | null;
    paymentDate: string;
    startDate: string;
    endDate: string;
    durationMonths: number | null;
    notes: string | null;
    createdAt: string;
}

export type TabKey = "active" | "overview" | "stores" | "cleanup" | "subscriptions";
