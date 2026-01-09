
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

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
}

export interface ProductRepository {
    getProducts(): Promise<Product[]>;
    addProduct(product: Product): Promise<void>;
    deleteProduct(id: string): Promise<void>;
}
