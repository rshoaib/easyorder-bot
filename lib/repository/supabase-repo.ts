
import {
    Order, OrderRepository, Product, ProductRepository, OrderStatus,
    Tenant, TenantRepository,
    AnalyticsRepository, AnalyticsSummary,
    PromoCode, PromoCodeRepository,
    Integration, SocialPost, Subscription
} from './types';
import { supabase } from '../supabase';

export class SupabaseOrderRepository implements OrderRepository {
    private client: SupabaseClient;

    constructor(client: SupabaseClient | null = null) {
        this.client = client || supabase;
    }

    async saveOrder(order: Order): Promise<void> {
        // Flatten structure for SQL
        const { error } = await this.client
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
                status: order.status,
                notes: order.notes || null,
                payment_method: order.paymentMethod || null,
                payment_slip_url: order.paymentSlipUrl || null
            });

        if (error) {
            console.error("Supabase Save Error:", error);
            throw new Error(error.message);
        }
    }

    async getOrders(tenantId: string): Promise<Order[]> {
        const { data, error } = await this.client
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
            status: row.status as OrderStatus,
            notes: row.notes || undefined,
            paymentMethod: row.payment_method || undefined,
            paymentSlipUrl: row.payment_slip_url || undefined
        }));
    }

    async getOrderById(id: string): Promise<Order | null> {
        const { data, error } = await this.client
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
            status: data.status as OrderStatus,
            notes: data.notes || undefined,
            paymentMethod: data.payment_method || undefined,
            paymentSlipUrl: data.payment_slip_url || undefined
        };
    }

    async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
        const { error } = await this.client
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
            .eq('tenant_id', tenantId)
            .order('name', { ascending: true });

        if (error) {
            console.error("Supabase Products Fetch Error:", error);
            return [];
        }
        return data.map((d: any) => ({
            ...d,
            tenantId: d.tenant_id,
            isAvailable: d.is_available, // Map from DB column
            type: d.type || 'physical',
            digitalFileUrl: d.digital_file_url,
            sizes: d.sizes || undefined
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
                is_available: true,
                type: product.type,
                digital_file_url: product.digitalFileUrl,
                sizes: product.sizes || null
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

    async updateProduct(id: string, data: Partial<Pick<Product, 'name' | 'price' | 'category' | 'description' | 'image' | 'sizes'>>): Promise<void> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.image !== undefined) updateData.image = data.image;
        if (data.sizes !== undefined) updateData.sizes = data.sizes;

        const { error } = await this.client
            .from('products')
            .update(updateData)
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }
}


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
        if (data.status === 'disabled') return null;

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
            logoUrl: data.logo_url,
            userId: data.user_id,
            isOpen: data.is_open ?? true, // Default to true
            storeType: data.store_type || 'restaurant',
            paypalLink: data.paypal_link,
            stripeLink: data.stripe_link,
            codEnabled: data.cod_enabled ?? true,
            plan: data.plan || 'free',
            subscriptionStartDate: data.subscription_start_date || undefined,
            subscriptionEndDate: data.subscription_end_date || undefined,
            deliveryFee: parseFloat(data.delivery_fee) || 0,
            minOrderAmount: parseFloat(data.min_order_amount) || 0,
            timezone: data.timezone || undefined,
            jazzcashNumber: data.jazzcash_number || undefined,
            easypaisaNumber: data.easypaisa_number || undefined,
            fulfillmentMethods: data.fulfillment_methods || ['delivery']
        };
    }

    async getAllTenants(): Promise<Tenant[]> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .neq('status', 'disabled')
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
            metaPixelId: row.meta_pixel_id,
            logoUrl: row.logo_url,
            storeType: row.store_type || 'restaurant',
            paypalLink: row.paypal_link,
            stripeLink: row.stripe_link,
            codEnabled: row.cod_enabled ?? true,
            plan: row.plan || 'free',
            subscriptionStartDate: row.subscription_start_date || undefined,
            subscriptionEndDate: row.subscription_end_date || undefined,
            timezone: row.timezone || undefined,
            jazzcashNumber: row.jazzcash_number || undefined,
            easypaisaNumber: row.easypaisa_number || undefined
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
        if (data.status === 'disabled') return null;

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
            timezone: data.timezone || undefined
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

    async updateTenantSettings(id: string, settings: Partial<Omit<Tenant, 'id' | 'slug' | 'status' | 'userId' | 'stripeCustomerId' | 'password'>>): Promise<void> {
        const updateData: any = {};

        if (settings.ownerPhone !== undefined) { updateData.owner_phone = settings.ownerPhone; }
        if (settings.instagramUrl !== undefined) { updateData.instagram_url = settings.instagramUrl; }
        if (settings.facebookUrl !== undefined) { updateData.facebook_url = settings.facebookUrl; }
        if (settings.metaPixelId !== undefined) { updateData.meta_pixel_id = settings.metaPixelId; }
        if (settings.currency !== undefined) { updateData.currency = settings.currency; }
        if (settings.themeColor !== undefined) { updateData.theme_color = settings.themeColor; }
        if (settings.logoUrl !== undefined) { updateData.logo_url = settings.logoUrl; }
        if (settings.name !== undefined) { updateData.name = settings.name; }

        if (settings.isOpen !== undefined) { updateData.is_open = settings.isOpen; }
        if (settings.storeType) { updateData.store_type = settings.storeType; }

        if (settings.paypalLink !== undefined) { updateData.paypal_link = settings.paypalLink || null; }
        if (settings.stripeLink !== undefined) { updateData.stripe_link = settings.stripeLink || null; }
        if (settings.codEnabled !== undefined) { updateData.cod_enabled = settings.codEnabled; }
        if (settings.deliveryFee !== undefined) { updateData.delivery_fee = settings.deliveryFee; }
        if (settings.minOrderAmount !== undefined) { updateData.min_order_amount = settings.minOrderAmount; }
        if (settings.timezone !== undefined) { updateData.timezone = settings.timezone || null; }
        if (settings.jazzcashNumber !== undefined) { updateData.jazzcash_number = settings.jazzcashNumber || null; }
        if (settings.easypaisaNumber !== undefined) { updateData.easypaisa_number = settings.easypaisaNumber || null; }
        if (settings.fulfillmentMethods !== undefined) { updateData.fulfillment_methods = settings.fulfillmentMethods; }
        if (settings.language !== undefined) { updateData.language = settings.language; }
        if (settings.customDomain !== undefined) { updateData.custom_domain = settings.customDomain; }
        if (settings.plan !== undefined) { updateData.plan = settings.plan; }
        if (settings.email !== undefined) { updateData.email = settings.email; }

        if (Object.keys(updateData).length === 0) return;

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
            metaPixelId: data.meta_pixel_id,
            logoUrl: data.logo_url,
            storeType: data.store_type || 'restaurant',
            paypalLink: data.paypal_link,
            stripeLink: data.stripe_link,
            codEnabled: data.cod_enabled ?? true,
            plan: data.plan || 'free',
            subscriptionStartDate: data.subscription_start_date || undefined,
            subscriptionEndDate: data.subscription_end_date || undefined,
            deliveryFee: parseFloat(data.delivery_fee) || 0,
            minOrderAmount: parseFloat(data.min_order_amount) || 0,
            timezone: data.timezone || undefined,
            jazzcashNumber: data.jazzcash_number || undefined,
            easypaisaNumber: data.easypaisa_number || undefined,
            fulfillmentMethods: data.fulfillment_methods || ['delivery']
        };
    }

    async getTenantByUserId(userId: string): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .eq('user_id', userId)
            .neq('status', 'disabled')
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
            logoUrl: data.logo_url,
            userId: data.user_id,
            isOpen: data.is_open ?? true,
            storeType: data.store_type || 'restaurant',
            paypalLink: data.paypal_link,
            stripeLink: data.stripe_link,
            codEnabled: data.cod_enabled ?? true,
            plan: data.plan || 'free',
            subscriptionStartDate: data.subscription_start_date || undefined,
            subscriptionEndDate: data.subscription_end_date || undefined,
            deliveryFee: parseFloat(data.delivery_fee) || 0,
            minOrderAmount: parseFloat(data.min_order_amount) || 0,
            timezone: data.timezone || undefined,
            jazzcashNumber: data.jazzcash_number || undefined,
            easypaisaNumber: data.easypaisa_number || undefined,
            fulfillmentMethods: data.fulfillment_methods || ['delivery']
        };
    }

    async updateTenantBilling(id: string, billingData: { subscription_status?: string }): Promise<void> {
        const updateData: any = {};
        if (billingData.subscription_status) updateData.subscription_status = billingData.subscription_status;

        const { error } = await this.client
            .from('tenants')
            .update(updateData)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async deleteTenant(id: string): Promise<void> {
        // Soft delete: set status to disabled and rename slug to free it up
        const { data: tenant } = await this.client.from('tenants').select('slug').eq('id', id).single();
        const newSlug = `${tenant?.slug || 'deleted'}-deleted-${Date.now()}`;

        const { error } = await this.client
            .from('tenants')
            .update({
                status: 'disabled',
                slug: newSlug
            })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async getIntegration(tenantId: string, provider: string): Promise<Integration | null> {
        const { data, error } = await this.client
            .from('integrations')
            .select('*')
            .eq('tenant_id', tenantId)
            .eq('provider', provider)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            tenantId: data.tenant_id,
            provider: data.provider,
            accessToken: data.access_token,
            pageId: data.page_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    }

    async saveIntegration(integration: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
        const { error } = await this.client
            .from('integrations')
            .upsert({
                tenant_id: integration.tenantId,
                provider: integration.provider,
                access_token: integration.accessToken,
                page_id: integration.pageId,
                updated_at: new Date().toISOString()
            }, { onConflict: 'tenant_id, provider' });

        if (error) throw new Error(error.message);
    }

    async deleteIntegration(tenantId: string, provider: string): Promise<void> {
        const { error } = await this.client
            .from('integrations')
            .delete()
            .eq('tenant_id', tenantId)
            .eq('provider', provider);

        if (error) throw new Error(error.message);
    }

    async saveSocialPost(post: Omit<SocialPost, 'id' | 'createdAt'>): Promise<void> {
        const { error } = await this.client
            .from('social_posts')
            .insert({
                tenant_id: post.tenantId,
                product_id: post.productId,
                provider: post.provider,
                external_post_id: post.externalPostId
            });

        if (error) throw new Error(error.message);
    }

    async getSocialPosts(tenantId: string): Promise<SocialPost[]> {
        const { data, error } = await this.client
            .from('social_posts')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false })
            .limit(50); // Limit to recent 50 posts for now

        if (error) return [];

        return data.map((d: any) => ({
            id: d.id,
            tenantId: d.tenant_id,
            productId: d.product_id,
            provider: d.provider,
            externalPostId: d.external_post_id,
            createdAt: d.created_at
        }));
    }

    // -------------------------------------------------------
    // Subscription Management
    // -------------------------------------------------------

    async setTenantPlan(id: string, plan: 'free' | 'pro', startDate?: string, endDate?: string): Promise<void> {
        const updateData: any = { plan };
        if (plan === 'pro') {
            if (startDate) updateData.subscription_start_date = startDate;
            if (endDate) updateData.subscription_end_date = endDate;
        } else {
            updateData.subscription_start_date = null;
            updateData.subscription_end_date = null;
        }
        const { error } = await this.client.from('tenants').update(updateData).eq('id', id);
        if (error) throw new Error(error.message);
    }

    async getSubscriptions(tenantId: string): Promise<Subscription[]> {
        const { data, error } = await this.client
            .from('subscriptions')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (error || !data) return [];

        return data.map((d: any) => ({
            id: d.id,
            tenantId: d.tenant_id,
            plan: d.plan,
            amountPkr: d.amount_pkr ? parseFloat(d.amount_pkr) : undefined,
            paymentDate: d.payment_date,
            startDate: d.start_date,
            endDate: d.end_date,
            durationMonths: d.duration_months,
            notes: d.notes,
            createdAt: d.created_at
        }));
    }

    async addSubscription(sub: Omit<Subscription, 'id' | 'createdAt'>): Promise<void> {
        const { error } = await this.client.from('subscriptions').insert({
            tenant_id: sub.tenantId,
            plan: sub.plan,
            amount_pkr: sub.amountPkr,
            payment_date: sub.paymentDate,
            start_date: sub.startDate,
            end_date: sub.endDate,
            duration_months: sub.durationMonths,
            notes: sub.notes
        });
        if (error) throw new Error(error.message);
    }
}



export class SupabaseAnalyticsRepository implements AnalyticsRepository {
    private client: SupabaseClient;

    constructor(client: SupabaseClient | null = null) {
        this.client = client || supabase;
    }

    async getSummary(tenantId: string): Promise<AnalyticsSummary> {
        // Use RPC for high performance aggregation (avoids downloading all rows to Node.js)
        const { data, error } = await this.client.rpc('get_tenant_revenue_summary', { t_id: tenantId });

        if (error) {
            console.error("Failed to fetch analytics summary via RPC:", error);
            // Fallback for local dev if RPC hasn't been pushed yet
            return this.getSummaryFallback(tenantId);
        }

        return {
            totalOrders: data.totalOrders,
            totalRevenue: data.totalRevenue,
            recentRevenue: data.recentRevenue
        };
    }

    private async getSummaryFallback(tenantId: string): Promise<AnalyticsSummary> {
        // Fallback for when RPC is missing (Development)
        const { count, error: countError } = await this.client
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
            .neq('status', 'cancelled');

        if (countError) throw new Error(countError.message);

        const { data: revenueData, error: revenueError } = await this.client
            .from('orders')
            .select('total, date')
            .eq('tenant_id', tenantId)
            .neq('status', 'cancelled');

        if (revenueError) throw new Error(revenueError.message);

        const totalRevenue = revenueData.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

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
        // Fetch current usage, then increment
        const { data, error: fetchError } = await supabase
            .from('promo_codes')
            .select('usage_count')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error("Failed to fetch promo for increment:", fetchError);
            // Non-blocking: don't fail the order just because usage tracking failed
            return;
        }

        const currentUsage = data?.usage_count || 0;
        const { error: updateError } = await supabase
            .from('promo_codes')
            .update({ usage_count: currentUsage + 1 })
            .eq('id', id);

        if (updateError) {
            console.error("Failed to increment promo usage:", updateError);
            // Non-blocking: order should still succeed
        }
    }
}
