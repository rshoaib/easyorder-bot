
import { OrderRepository, ProductRepository, TenantRepository } from './types';
import { JsonOrderRepository, JsonProductRepository } from './json-repo';
import { SupabaseOrderRepository, SupabaseProductRepository, SupabaseTenantRepository } from './supabase-repo';

// Factory function to get the correct repository
export function getOrderRepository(): OrderRepository {
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    // Strategy:
    // 1. If in Production (Vercel), MUST use Supabase (files dont persist)
    // 2. If locally, prefer JSON for speed, unless explicitly overriden? 
    // Let's default to Supabase if keys exist, BUT fallback to JSON if connection fails?
    // Actually, for this specific user who has local firewall issues, strictly use JSON locally.

    if (isProduction && useSupabase) {
        return new SupabaseOrderRepository();
    }

    // Default to JSON for local development
    return new JsonOrderRepository();
}

export function getProductRepository(): ProductRepository {
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && useSupabase) {
        return new SupabaseProductRepository();
    }
    return new JsonProductRepository();
}

export function getTenantRepository(): TenantRepository {
    return new SupabaseTenantRepository();
}
