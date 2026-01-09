
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Tenant {
    id: string;
    slug: string;
    name: string;
    ownerPhone?: string;
    currency: string;
    themeColor: string;
    password?: string; // Only for internal check
}

export interface Order {
    id: string;
    tenantId: string;
    date: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        locationLink?: string;
    };
    items: any[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: OrderStatus;
}

export interface OrderRepository {
    saveOrder(order: Order): Promise<void>;
    getOrders(tenantId: string): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
}

export interface Product {
    id: string;
    tenantId?: string; // Optional during transition or local dev
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
}

export interface ProductRepository {
    getProducts(tenantId: string): Promise<Product[]>;
    addProduct(product: Product): Promise<void>;
    deleteProduct(id: string): Promise<void>;
}

// Analytics Interface
export interface AnalyticsSummary {
    totalRevenue: number;
    totalOrders: number;
    recentRevenue: number; // Last 30 days
}

export interface AnalyticsRepository {
    getSummary(tenantId: string): Promise<AnalyticsSummary>;
}

// New Interface for Tenant Management
export interface TenantRepository {
    getTenantBySlug(slug: string): Promise<Tenant | null>;
    getAllTenants(): Promise<Tenant[]>;
    createTenant(tenant: Omit<Tenant, 'id'>): Promise<Tenant>;
}

