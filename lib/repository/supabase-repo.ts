
import { Order, OrderRepository, Product, ProductRepository, OrderStatus } from './types';
import { supabase } from '../supabase';

export class SupabaseOrderRepository implements OrderRepository {
    async saveOrder(order: Order): Promise<void> {
        // Flatten structure for SQL if needed, or maintain JSONB if table structure matches
        // Our migration script used JSONB for customer and items, which matches.
        const { error } = await supabase
            .from('orders')
            .insert({
                id: order.id,
                date: order.date,
                customer: order.customer, // Supabase client auto-stringifies for JSONB cols if passing objects
                items: order.items,
                subtotal: order.subtotal,
                "deliveryFee": order.deliveryFee, // Quote to ensure matches column if case sensitive
                total: order.total,
                status: order.status
            });

        if (error) {
            console.error("Supabase Save Error:", error);
            throw new Error(error.message);
        }
    }

    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return [];
        }

        return (data || []).map((row: any) => ({
            id: row.id,
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
    async getProducts(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error("Supabase Products Fetch Error:", error);
            return [];
        }
        return data as Product[];
    }

    async addProduct(product: Product): Promise<void> {
        const { error } = await supabase
            .from('products')
            .insert(product);

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
