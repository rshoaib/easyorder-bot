
export interface Order {
    id: string;
    date: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    items: any[];
    total: number;
    status: string;
}

export interface OrderRepository {
    saveOrder(order: Order): Promise<void>;
    getOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
}
