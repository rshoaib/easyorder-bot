
export type StoreType = 'restaurant' | 'retail' | 'service' | 'digital';

interface PresetConfig {
    ordersLabel: string;
    kitchenLabel: string; // The "Kitchen" view
    processBtn: string; // "Start Processing" equivalent
    completeBtn: string; // "Ready" equivalent
    processStatus: string; // Status label for 'preparing'
    readyStatus: string; // Status label for 'ready'
}

export const STORE_PRESETS: Record<StoreType, PresetConfig> = {
    restaurant: {
        ordersLabel: "Orders",
        kitchenLabel: "Kitchen",
        processBtn: "Start Cooking",
        completeBtn: "Order Ready",
        processStatus: "Cooking",
        readyStatus: "Ready"
    },
    retail: {
        ordersLabel: "Orders",
        kitchenLabel: "Fulfillment",
        processBtn: "Start Packing",
        completeBtn: "Ready for Pickup/Delivery",
        processStatus: "Packing",
        readyStatus: "Ready"
    },
    service: {
        ordersLabel: "Bookings",
        kitchenLabel: "Active Services",
        processBtn: "Start Service",
        completeBtn: "Service Complete",
        processStatus: "In Progress",
        readyStatus: "Completed"
    },
    digital: {
        ordersLabel: "Orders",
        kitchenLabel: "Downloads",
        processBtn: "Process Order",
        completeBtn: "Send Files",
        processStatus: "Processing",
        readyStatus: "Sent"
    }
};

export function getPreset(type?: string): PresetConfig {
    const key = (type as StoreType) || 'restaurant';
    return STORE_PRESETS[key] || STORE_PRESETS.restaurant;
}

export type PresetType = 'pizza' | 'coffee' | 'burger' | 'clothing';

export const PRESET_MENUS: Record<PresetType, { label: string; icon: string; products: any[] }> = {
    pizza: {
        label: "Pizza Place",
        icon: "🍕",
        products: [
            { name: "Mega Cheese", price: 12, category: "Pizza", description: "Mozzarella overload.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500" },
            { name: "Pepperoni Feast", price: 14, category: "Pizza", description: "Classic spicy pepperoni.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500" }
        ]
    },
    coffee: {
        label: "Coffee Shop",
        icon: "☕",
        products: [
            { name: "Latte", price: 4.5, category: "Coffee", description: "Smooth espresso with steamed milk.", image: "https://images.unsplash.com/photo-1570968992077-02b28c5c1632?auto=format&fit=crop&w=500" },
            { name: "Croissant", price: 3.5, category: "Bakery", description: "Buttery and flaky.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500" }
        ]
    },
    burger: {
        label: "Burger Joint",
        icon: "🍔",
        products: [
            { name: "Classic Cheeseburger", price: 10, category: "Burgers", description: "Beef patty with cheddar.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500" },
            { name: "Fries", price: 4, category: "Sides", description: "Crispy salted fries.", image: "https://images.unsplash.com/photo-1573080496987-a2267f10a625?auto=format&fit=crop&w=500" }
        ]
    },
    clothing: {
        label: "Fashion Store",
        icon: "👗",
        products: [
            { name: "Summer Dress", price: 45, category: "Women", description: "Floral pattern, lightweight.", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500" },
            { name: "Denim Jacket", price: 60, category: "Outerwear", description: "Classic blue denim.", image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=500" }
        ]
    }
};
