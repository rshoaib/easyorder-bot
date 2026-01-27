
import { Order, OrderRepository, Product, ProductRepository, OrderStatus } from './types';
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

    async getOrders(tenantId: string): Promise<Order[]> {
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

    async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
        const filePath = this.getFilePath();
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            const orders: Order[] = JSON.parse(fileData);

            const orderIndex = orders.findIndex(o => o.id === id);
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                await fs.writeFile(filePath, JSON.stringify(orders, null, 2));
            }
        } catch {
            // Ignore if file doesn't exist
        }
    }
}

export class JsonProductRepository implements ProductRepository {
    private getFilePath() {
        return path.join(process.cwd(), 'data', 'products.json');
    }

    async getProducts(tenantId: string): Promise<Product[]> {
        try {
            const fileData = await fs.readFile(this.getFilePath(), 'utf8');
            return JSON.parse(fileData);
        } catch {
            return [];
        }
    }

    async addProduct(product: Product): Promise<void> {
        const filePath = this.getFilePath();
        let products: Product[] = [];
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            products = JSON.parse(fileData);
        } catch {
            // Fresh start
        }
        products.push(product);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    }

    async deleteProduct(id: string): Promise<void> {
        const filePath = this.getFilePath();
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            let products: Product[] = JSON.parse(fileData);
            products = products.filter(p => p.id !== id);
            await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        } catch {
            // Nothing to delete
        }
    }

    async toggleAvailability(id: string, isAvailable: boolean): Promise<void> {
        const filePath = this.getFilePath();
        try {
            const fileData = await fs.readFile(filePath, 'utf8');
            const products: Product[] = JSON.parse(fileData);

            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex !== -1) {
                products[productIndex].isAvailable = isAvailable;
                await fs.writeFile(filePath, JSON.stringify(products, null, 2));
            }
        } catch {
            // Ignore
        }
    }
}
