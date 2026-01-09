
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
    discount?: number;
    promoCode?: string;
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
    isAvailable: boolean;
}

export interface ProductRepository {
    getProducts(tenantId: string): Promise<Product[]>;
    addProduct(product: Product): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    toggleAvailability(id: string, isAvailable: boolean): Promise<void>;
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

// Promo Code Interface
export interface PromoCode {
    id: string;
    tenantId: string;
    code: string;
    discountType: 'percent' | 'fixed';
    value: number;
    isActive: boolean;
    usageCount: number;
}

export interface PromoCodeRepository {
    getPromo(code: string, tenantId: string): Promise<PromoCode | null>;
    createPromo(promo: Omit<PromoCode, 'id' | 'usageCount' | 'isActive'>): Promise<void>;
    getPromos(tenantId: string): Promise<PromoCode[]>;
    togglePromo(id: string, isActive: boolean): Promise<void>;
    incrementUsage(id: string): Promise<void>;
}

// New Interface for Tenant Management
export interface TenantRepository {
    getTenantBySlug(slug: string): Promise<Tenant | null>;
    getAllTenants(): Promise<Tenant[]>;
    createTenant(tenant: Omit<Tenant, 'id'>): Promise<Tenant>;
}


