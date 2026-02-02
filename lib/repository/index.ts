
import { OrderRepository, ProductRepository, TenantRepository } from './types';
import { JsonOrderRepository, JsonProductRepository } from './json-repo';
import { SupabaseOrderRepository, SupabaseProductRepository, SupabaseTenantRepository } from './supabase-repo';
import { SupabaseClient } from '@supabase/supabase-js';

// Factory function to get the correct repository
export function getOrderRepository(client?: SupabaseClient): OrderRepository {
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && useSupabase) {
        return new SupabaseOrderRepository(client);
    }

    // Default to JSON for local development
    return new JsonOrderRepository();
}

export function getProductRepository(client?: SupabaseClient): ProductRepository {
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && useSupabase) {
        return new SupabaseProductRepository(client);
    }
    return new JsonProductRepository();
}

export function getTenantRepository(client?: SupabaseClient): TenantRepository {
    return new SupabaseTenantRepository(client);
}

import { AnalyticsRepository, PromoCodeRepository } from './types';
import { SupabaseAnalyticsRepository, SupabasePromoCodeRepository } from './supabase-repo';

export function getAnalyticsRepository(client?: SupabaseClient): AnalyticsRepository {
    return new SupabaseAnalyticsRepository(client);
}

export function getPromoCodeRepository(): PromoCodeRepository {
    return new SupabasePromoCodeRepository();
}
