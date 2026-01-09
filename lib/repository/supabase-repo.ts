
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
    async getProducts(tenantId: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('tenant_id', tenantId);

        if (error) {
            console.error("Supabase Products Fetch Error:", error);
            return [];
        }
        return data.map((d: any) => ({ ...d, tenantId: d.tenant_id })) as Product[];
    }

    async addProduct(product: Product): Promise<void> {
        const { error } = await supabase
            .from('products')
            .insert({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: product.image,
                description: product.description,
                tenant_id: product.tenantId
            });

        if (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }
}

import { Tenant, TenantRepository } from './types';

export class SupabaseTenantRepository implements TenantRepository {
    async getTenantBySlug(slug: string): Promise<Tenant | null> {
        const { data, error } = await supabase
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
            password: data.password
        };
    }

    async createTenant(tenant: Omit<Tenant, 'id'>): Promise<Tenant> {
        const { data, error } = await supabase
            .from('tenants')
            .insert({
                name: tenant.name,
                slug: tenant.slug,
                owner_phone: tenant.ownerPhone,
                currency: tenant.currency,
                theme_color: tenant.themeColor,
                password: tenant.password
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
            password: data.password
        };
    }
}
