
import { Order, OrderRepository } from './types';
import fs from 'fs/promises';
import path from 'path';

export class JsonOrderRepository implements OrderRepository {
    private getFilePath() {
        return path.join(process.cwd(), 'data', 'orders.json');
    }

    async saveOrder(order: Order): Promise<void> {
        const filePath = this.getFilePath();
        let orders: Order[] = [];
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            orders = JSON.parse(fileData);
        } catch {
            // File missing or empty, start fresh
        }
        orders.push(order);
        await fs.writeFile(filePath, JSON.stringify(orders, null, 2));
    }

    async getOrders(): Promise<Order[]> {
        try {
            const fileData = await fs.readFile(this.getFilePath(), 'utf8');
            const orders = JSON.parse(fileData);
            // Simple sort by date descend (newest first)
            return orders.sort((a: Order, b: Order) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } catch {
            return [];
        }
    }

    async getOrderById(id: string): Promise<Order | null> {
        try {
            const fileData = await fs.readFile(this.getFilePath(), 'utf8');
            const orders: Order[] = JSON.parse(fileData);
            return orders.find(o => o.id === id) || null;
        } catch {
            return null;
        }
    }
}
