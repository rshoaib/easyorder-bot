
import { Order, OrderRepository, Product, ProductRepository, OrderStatus } from './types';
import { supabase } from '../supabase';

export class SupabaseOrderRepository implements OrderRepository {
    async saveOrder(order: Order): Promise<void> {
        // Flatten structure for SQL
        const { error } = await supabase
            .from('orders')
            .insert({
                id: order.id,
                tenant_id: order.tenantId,
                date: order.date,
                customer: order.customer,
                items: order.items,
                subtotal: order.subtotal,
                "deliveryFee": order.deliveryFee,
                discount: order.discount || 0,
                promo_code: order.promoCode || null,
                total: order.total,
                status: order.status
            });

        if (error) {
            console.error("Supabase Save Error:", error);
            throw new Error(error.message);
        }
    }

    async getOrders(tenantId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('date', { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return [];
        }

        return (data || []).map((row: any) => ({
            id: row.id,
            tenantId: row.tenant_id,
            date: row.date,
            customer: row.customer,
            items: row.items,
            subtotal: row.subtotal || 0,
            deliveryFee: row.deliveryFee || 0,
            total: row.total,
            status: row.status
        }));
    }

    async getOrderById(id: string): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            tenantId: data.tenant_id,
            date: data.date,
            customer: data.customer,
            items: data.items,
            subtotal: data.subtotal || 0,
            deliveryFee: data.deliveryFee || 0,
            total: data.total,
            status: data.status as OrderStatus
        };
    }

    async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }
}

export class SupabaseProductRepository implements ProductRepository {
    private client: SupabaseClient;

    constructor(client: SupabaseClient | null = null) {
        this.client = client || supabase;
    }

    async getProducts(tenantId: string): Promise<Product[]> {
        const { data, error } = await this.client
            .from('products')
            .select('*')
            .eq('tenant_id', tenantId);

        if (error) {
            console.error("Supabase Products Fetch Error:", error);
            return [];
        }
        return data.map((d: any) => ({
            ...d,
            tenantId: d.tenant_id,
            isAvailable: d.is_available // Map from DB column
        })) as Product[];
    }

    async addProduct(product: Product): Promise<void> {
        const { error } = await this.client
            .from('products')
            .insert({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: product.image,
                description: product.description,
                tenant_id: product.tenantId,
                is_available: true
            });

        if (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(id: string): Promise<void> {
        const { error } = await this.client
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    async toggleAvailability(id: string, isAvailable: boolean): Promise<void> {
        const { error } = await this.client
            .from('products')
            .update({ is_available: isAvailable })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }
}

import { Tenant, TenantRepository } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseTenantRepository implements TenantRepository {
    private client: SupabaseClient;

    constructor(client: SupabaseClient | null = null) {
        this.client = client || supabase;
    }

    async getTenantBySlug(slug: string): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            ownerPhone: data.owner_phone,
            currency: data.currency,
            themeColor: data.theme_color,
            email: data.email,
            status: data.status,
            stripeCustomerId: data.stripe_customer_id,
            password: data.password,
            language: data.language || 'en',
            customDomain: data.custom_domain,
            instagramUrl: data.instagram_url,
            facebookUrl: data.facebook_url,
            metaPixelId: data.meta_pixel_id,
            userId: data.user_id
        };
    }

    async getAllTenants(): Promise<Tenant[]> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return [];

        return data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            ownerPhone: row.owner_phone,
            currency: row.currency,
            themeColor: row.theme_color,
            email: row.email,
            status: row.status,
            stripeCustomerId: row.stripe_customer_id,
            password: row.password,
            language: row.language || 'en',
            customDomain: row.custom_domain,
            instagramUrl: row.instagram_url,
            facebookUrl: row.facebook_url,
            metaPixelId: row.meta_pixel_id
        }));
    }

    async createTenant(tenant: Omit<Tenant, 'id'>): Promise<Tenant> {
        const { data, error } = await this.client
            .from('tenants')
            .insert({
                name: tenant.name,
                slug: tenant.slug,
                owner_phone: tenant.ownerPhone,
                currency: tenant.currency,
                theme_color: tenant.themeColor,
                email: tenant.email,
                status: tenant.status,
                stripe_customer_id: tenant.stripeCustomerId,
                password: tenant.password,
                language: tenant.language || 'en',
                user_id: tenant.userId
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            ownerPhone: data.owner_phone,
            currency: data.currency,
            themeColor: data.theme_color,
            email: data.email,
            status: data.status,
            stripeCustomerId: data.stripe_customer_id,
            password: data.password,
            language: data.language || 'en',
            customDomain: data.custom_domain
        };
    }

    async updateTenantLanguage(id: string, language: string): Promise<void> {
        const { error } = await this.client
            .from('tenants')
            .update({ language })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async updateTenantDomain(id: string, domain: string): Promise<void> {
        const { error } = await this.client
            .from('tenants')
            .update({ custom_domain: domain })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async getTenantByDomain(domain: string): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .eq('custom_domain', domain)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            ownerPhone: data.owner_phone,
            currency: data.currency,
            themeColor: data.theme_color,
            email: data.email,
            status: data.status,
            stripeCustomerId: data.stripe_customer_id,
            password: data.password,
            language: data.language || 'en',
            customDomain: data.custom_domain
        };
    }

    async updateTenantStatus(id: string, status: 'active' | 'pending_payment' | 'disabled', stripeCustomerId?: string): Promise<void> {
        const updateData: any = { status };
        if (stripeCustomerId) {
            updateData.stripe_customer_id = stripeCustomerId;
        }

        const { error } = await this.client
            .from('tenants')
            .update(updateData)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async updateTenantSettings(id: string, ownerPhone?: string, instagramUrl?: string, facebookUrl?: string, metaPixelId?: string, currency?: string, themeColor?: string, logoUrl?: string): Promise<void> {
        const updateData: any = {
            owner_phone: ownerPhone,
            instagram_url: instagramUrl,
            facebook_url: facebookUrl,
            meta_pixel_id: metaPixelId
        };

        if (currency) {
            updateData.currency = currency;
        }

        if (themeColor) {
            updateData.theme_color = themeColor;
        }

        if (logoUrl) {
            updateData.logo_url = logoUrl;
        }

        const { error } = await this.client
            .from('tenants')
            .update(updateData)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async getTenantById(id: string): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            ownerPhone: data.owner_phone,
            currency: data.currency,
            themeColor: data.theme_color,
            email: data.email,
            status: data.status,
            stripeCustomerId: data.stripe_customer_id,
            password: data.password,
            language: data.language || 'en',
            customDomain: data.custom_domain,
            instagramUrl: data.instagram_url,
            facebookUrl: data.facebook_url,
            metaPixelId: data.meta_pixel_id
        };
    }

    async updateTenantBilling(id: string, billingData: { lemonsqueezy_customer_id?: string; lemonsqueezy_subscription_id?: string; lemonsqueezy_variant_id?: string; subscription_status?: string }): Promise<void> {
        const updateData: any = {};
        if (billingData.lemonsqueezy_customer_id) updateData.lemonsqueezy_customer_id = billingData.lemonsqueezy_customer_id;
        if (billingData.lemonsqueezy_subscription_id) updateData.lemonsqueezy_subscription_id = billingData.lemonsqueezy_subscription_id;
        if (billingData.lemonsqueezy_variant_id) updateData.lemonsqueezy_variant_id = billingData.lemonsqueezy_variant_id;
        if (billingData.subscription_status) updateData.subscription_status = billingData.subscription_status;

        const { error } = await this.client
            .from('tenants')
            .update(updateData)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}

import { AnalyticsRepository, AnalyticsSummary } from './types';

export class SupabaseAnalyticsRepository implements AnalyticsRepository {
    async getSummary(tenantId: string): Promise<AnalyticsSummary> {
        // Total Orders
        const { count, error: countError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId);

        if (countError) throw new Error(countError.message);

        // Revenue Calculation (This is heavy for client-side if many orders, but okay for MVP)
        // Ideally, we would use a Supabase Database Function (RPC) for this aggregation.
        const { data: revenueData, error: revenueError } = await supabase
            .from('orders')
            .select('total, date')
            .eq('tenant_id', tenantId);

        if (revenueError) throw new Error(revenueError.message);

        const totalRevenue = revenueData.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        // Recent Revenue (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRevenue = revenueData
            .filter((o: any) => new Date(o.date) > thirtyDaysAgo)
            .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        return {
            totalOrders: count || 0,
            totalRevenue,
            recentRevenue
        };
    }
}

import { PromoCode, PromoCodeRepository } from './types';

export class SupabasePromoCodeRepository implements PromoCodeRepository {
    async getPromo(code: string, tenantId: string): Promise<PromoCode | null> {
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code)
            .eq('tenant_id', tenantId)
            .eq('is_active', true)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            tenantId: data.tenant_id,
            code: data.code,
            discountType: data.discount_type,
            value: data.value,
            isActive: data.is_active,
            usageCount: data.usage_count
        };
    }

    async createPromo(promo: Omit<PromoCode, 'id' | 'usageCount' | 'isActive'>): Promise<void> {
        const { error } = await supabase
            .from('promo_codes')
            .insert({
                tenant_id: promo.tenantId,
                code: promo.code,
                discount_type: promo.discountType,
                value: promo.value
            });

        if (error) throw new Error(error.message);
    }

    async getPromos(tenantId: string): Promise<PromoCode[]> {
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (error) return [];

        return data?.map((d: any) => ({
            id: d.id,
            tenantId: d.tenant_id,
            code: d.code,
            discountType: d.discount_type,
            value: d.value,
            isActive: d.is_active,
            usageCount: d.usage_count
        })) || [];
    }

    async togglePromo(id: string, isActive: boolean): Promise<void> {
        const { error } = await supabase
            .from('promo_codes')
            .update({ is_active: isActive })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async incrementUsage(id: string): Promise<void> {
        // Supabase doesn't support atomic increment easily via simple client without RPC or manual update
        // For MVP, we'll read and write, or use rpc if we had one. 
        // Let's just ignore precise race conditions for now or use a raw query if possible?
        // Actually, let's keep it simple: we aren't enforcing limits yet.
        const { error } = await supabase.rpc('increment_promo_usage', { row_id: id });
        // If RPC doesn't exist, this will fail. Let's fallback to manual update if RPC fails? 
        // Or simpler: just don't increment for now to avoid complexity, OR assume the user didn't run the RPC SQL.
        // Wait, I can't assume RPC exists. I'll do a read-update for now.

        const { data } = await supabase.from('promo_codes').select('usage_count').eq('id', id).single();
        if (data) {
            await supabase.from('promo_codes').update({ usage_count: (data.usage_count || 0) + 1 }).eq('id', id);
        }
    }
}
