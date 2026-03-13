const SupabaseREST = require('./supabase_rest.cjs');

const clean = async () => {
    const supabase = new SupabaseREST();
    
    console.log("Fetching tenants...");
    const tenants = await supabase.select('tenants', 'id,slug');
    const bbMarket = tenants.find(t => t.slug === 'bb-market');
    
    if (!bbMarket) {
        console.error("Could not find tenant with slug 'bb-market'");
        return;
    }
    
    const tenantId = bbMarket.id;
    console.log(`Found bb-market tenantId: ${tenantId}`);

    console.log("Fetching products for bb-market...");
    const productsRes = await fetch(`${supabase.restUrl}/products?tenant_id=eq.${tenantId}&select=*`, {
        headers: supabase.headers
    });
    
    if (!productsRes.ok) {
        console.error("Failed to fetch products:", await productsRes.text());
        return;
    }

    const products = await productsRes.json();
    console.log(`Found ${products.length} total products for bb-market.`);

    // Group by exact name and price
    const productMap = new Map();
    const duplicates = [];

    for (const p of products) {
        const key = p.name.trim() + '|' + p.price;
        if (productMap.has(key)) {
            duplicates.push(p);
        } else {
            productMap.set(key, p);
        }
    }

    console.log(`Found ${duplicates.length} duplicate products to delete.`);
    
    if (duplicates.length === 0) {
        console.log("No duplicates found. Exiting.");
        return;
    }

    console.log("Deleting duplicates...");
    let deletedCount = 0;
    
    for (const d of duplicates) {
        const delRes = await fetch(`${supabase.restUrl}/products?id=eq.${d.id}`, {
            method: 'DELETE',
            headers: supabase.headers
        });
        
        if (!delRes.ok) {
            console.error(`Failed to delete product ${d.id}:`, await delRes.text());
        } else {
            console.log(`Deleted duplicate product: ${d.name} (${d.id})`);
            deletedCount++;
        }
    }

    console.log(`Done. Successfully deleted ${deletedCount} duplicate products.`);
};

clean().catch(console.error);
