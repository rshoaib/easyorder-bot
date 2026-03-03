import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { PRESET_MENUS, PresetType } from '@/lib/presets';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/seed-empty-stores
 * 
 * One-time admin endpoint to auto-seed all stores with 0 products.
 * Uses a single SQL query to find empty stores (no sequential loops).
 * 
 * Query params:
 *   ?dryRun=true  → preview without making changes
 *   ?limit=5      → process N stores per call (default: 5)
 *   ?offset=0     → start from Nth empty store (default: 0)
 */
export async function POST(request: Request) {
    const supabase = await createClient();

    // Auth: same logic as super-admin page
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';

    if (!hasSuperAuth) {
        const { data: { user } } = await supabase.auth.getUser();
        const SUPER_ADMIN_EMAIL = 'segmentibi@gmail.com';
        if (!user || user.email !== SUPER_ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const url = new URL(request.url);
    const dryRun = url.searchParams.get('dryRun') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Single SQL query: find tenants with zero products (no N+1 queries!)
    const { data: emptyTenants, error: queryError } = await supabase.rpc('get_empty_tenants_fallback') as any;

    // Fallback: if RPC doesn't exist, use a simpler approach
    let tenantsToSeed: any[] = [];

    if (queryError || !emptyTenants) {
        // Fallback: get tenants and product counts in 2 queries total
        const { data: allTenants } = await supabase.from('tenants').select('*');
        const { data: productCounts } = await supabase
            .from('products')
            .select('tenant_id');

        if (!allTenants) {
            return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
        }

        // Build a set of tenant IDs that have products
        const tenantsWithProducts = new Set(
            (productCounts || []).map((p: any) => p.tenant_id)
        );

        // Filter to empty, non-deleted, non-demo tenants
        tenantsToSeed = allTenants.filter((t: any) =>
            t.slug !== 'demo' &&
            !t.slug.includes('-deleted-') &&
            !tenantsWithProducts.has(t.id)
        );
    } else {
        tenantsToSeed = emptyTenants;
    }

    // Apply pagination
    const totalEmpty = tenantsToSeed.length;
    const batch = tenantsToSeed.slice(offset, offset + limit);

    const results: {
        seeded: { slug: string; name: string; phone: string | null; preset: string; productCount: number }[];
        whatsappMessages: { phone: string; storeName: string; slug: string; message: string }[];
    } = { seeded: [], whatsappMessages: [] };

    for (const tenant of batch) {
        const presetKey = mapStoreTypeToPreset(tenant.store_type || tenant.storeType);

        if (!dryRun) {
            const preset = PRESET_MENUS[presetKey];

            // Seed products
            const productsToInsert = preset.products.map((item: any) => ({
                id: crypto.randomUUID(),
                tenant_id: tenant.id,
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                category: item.category,
                is_available: true,
                type: item.type || 'physical'
            }));

            // Batch insert all products in one query
            await supabase.from('products').insert(productsToInsert);

            // Update storeType if not set
            if (!tenant.store_type && !tenant.storeType) {
                await supabase
                    .from('tenants')
                    .update({ store_type: preset.storeType })
                    .eq('id', tenant.id);
            }
        }

        results.seeded.push({
            slug: tenant.slug,
            name: tenant.name,
            phone: tenant.owner_phone || null,
            preset: presetKey,
            productCount: PRESET_MENUS[presetKey].products.length
        });

        // Generate WhatsApp re-engagement message
        const phone = tenant.owner_phone;
        if (phone) {
            const cleanPhone = phone.replace(/[^\d]/g, '');
            const message = generateWhatsAppMessage(tenant.name, tenant.slug);
            results.whatsappMessages.push({
                phone: cleanPhone,
                storeName: tenant.name,
                slug: tenant.slug,
                message
            });
        }
    }

    return NextResponse.json({
        mode: dryRun ? 'DRY RUN — no changes made' : 'LIVE — stores seeded',
        summary: {
            totalEmpty,
            batchSeeded: results.seeded.length,
            whatsappMessages: results.whatsappMessages.length
        },
        pagination: {
            offset,
            limit,
            remaining: Math.max(0, totalEmpty - offset - limit),
            nextOffset: offset + limit < totalEmpty ? offset + limit : null
        },
        seeded: results.seeded,
        whatsappMessages: results.whatsappMessages
    });
}

// Map storeType string → closest preset key
function mapStoreTypeToPreset(storeType?: string): PresetType {
    if (!storeType) return 'pizza';
    const mapping: Record<string, PresetType> = {
        'restaurant': 'pizza', 'pizza': 'pizza',
        'coffee': 'coffee', 'cafe': 'coffee',
        'burger': 'burger',
        'retail': 'clothing', 'clothing': 'clothing', 'fashion': 'clothing',
        'service': 'barber', 'barber': 'barber', 'salon': 'barber',
        'digital': 'ebook', 'ebook': 'ebook',
    };
    return mapping[storeType.toLowerCase()] || 'pizza';
}

// Generate a personalized WhatsApp re-engagement message
function generateWhatsAppMessage(storeName: string, slug: string): string {
    return `Hi! 👋

Great news about your store *${storeName}* on OrderViaChat!

We've added sample products to your store so you can see how it looks. Your store is live and ready for orders:

🔗 *Your store:* https://orderviachat.com/store/${slug}
⚙️ *Admin panel:* https://orderviachat.com/store/${slug}/admin

What's new:
✅ Sample products already added — just edit names & prices
✅ Simpler setup — only 3 steps to go live
✅ Quick Add — add products in seconds

Need help? Just reply here and I'll assist you personally!

— OrderViaChat Team`;
}
