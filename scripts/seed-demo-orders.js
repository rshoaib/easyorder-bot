// Seed realistic demo orders for the demo store
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CUSTOMERS = [
    { name: 'Sarah Ahmed', phone: '+971501234567' },
    { name: 'Mike Johnson', phone: '+14155551234' },
    { name: 'Maria Garcia', phone: '+5511987654321' },
    { name: 'James Wilson', phone: '+447700900123' },
    { name: 'Fatima Hassan', phone: '+923001234567' },
    { name: 'David Lee', phone: '+61412345678' },
    { name: 'Anna Schmidt', phone: '+491761234567' },
    { name: 'Omar Khalil', phone: '+201012345678' },
    { name: 'Lisa Chen', phone: '+6591234567' },
    { name: 'Carlos Rodriguez', phone: '+593987654321' },
];

const MENU = [
    { name: 'Margherita Pizza', price: 12.99, category: 'Pizza' },
    { name: 'Classic Smash Burger', price: 10.99, category: 'Burgers' },
    { name: 'Pasta Carbonara', price: 14.50, category: 'Pasta' },
    { name: 'Caesar Salad', price: 9.99, category: 'Salads' },
    { name: 'Buffalo Wings', price: 11.99, category: 'Appetizers' },
    { name: 'Loaded Cheese Fries', price: 7.99, category: 'Sides' },
    { name: 'Chocolate Lava Cake', price: 8.99, category: 'Desserts' },
    { name: 'Fresh Lemonade', price: 4.99, category: 'Drinks' },
];

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'delivered', 'delivered'];

function randomDate(daysBack) {
    const now = new Date();
    const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime())).toISOString();
}

function randomItems() {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const items = [];
    const used = new Set();
    for (let i = 0; i < count; i++) {
        let idx;
        do { idx = Math.floor(Math.random() * MENU.length); } while (used.has(idx));
        used.add(idx);
        const qty = Math.floor(Math.random() * 3) + 1;
        items.push({
            name: MENU[idx].name,
            price: MENU[idx].price,
            quantity: qty,
        });
    }
    return items;
}

async function main() {
    console.log('=== SEEDING DEMO ORDERS ===\n');

    // Get demo tenant ID
    const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', 'demo')
        .single();

    if (!tenant) { console.error('Demo store not found!'); return; }

    const tenantId = tenant.id;
    console.log(`Demo store ID: ${tenantId}\n`);

    // Generate 15 orders spread over the last 30 days
    const orders = [];
    for (let i = 0; i < 15; i++) {
        const customer = CUSTOMERS[i % CUSTOMERS.length];
        const items = randomItems();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = Math.random() > 0.5 ? 2.99 : 0;
        const total = parseFloat((subtotal + deliveryFee).toFixed(2));
        const status = i < 3 ? STATUSES[i] : STATUSES[Math.floor(Math.random() * STATUSES.length)];
        const date = i < 2 ? new Date().toISOString() : randomDate(30);

        orders.push({
            id: `demo-order-${Date.now()}-${i}`,
            tenant_id: tenantId,
            date,
            customer: { name: customer.name, phone: customer.phone },
            items,
            subtotal: parseFloat(subtotal.toFixed(2)),
            deliveryFee,
            discount: 0,
            promo_code: null,
            total,
            status,
        });
    }

    // Sort by date desc
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Insert all orders
    const { error } = await supabase.from('orders').insert(orders);

    if (error) {
        console.error('Insert error:', error);
        return;
    }

    console.log(`✅ Created ${orders.length} demo orders:\n`);
    orders.forEach(o => {
        const itemNames = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
        console.log(`  ${o.status.padEnd(10)} | $${o.total.toFixed(2).padStart(6)} | ${o.customer.name} | ${itemNames}`);
    });

    console.log('\n=== DONE ===');
}

main().catch(console.error);
