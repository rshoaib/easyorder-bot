
import { Order, OrderRepository } from './types';
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
            total: row.total,
            status: row.status
        }));
    }
}
