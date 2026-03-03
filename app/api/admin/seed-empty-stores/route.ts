import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getTenantRepository, getProductRepository } from '@/lib/repository';
import { PRESET_MENUS, PresetType } from '@/lib/presets';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/seed-empty-stores
 * 
 * One-time admin endpoint to auto-seed all stores with 0 products.
 * Protected: same auth as super-admin page (super_auth cookie or Supabase email).
 * 
 * Query params:
 *   ?dryRun=true  → preview which stores would be seeded without making changes
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
    const limit = parseInt(url.searchParams.get('limit') || '5', 10); // Process N stores at a time
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const skipDeleted = url.searchParams.get('skipDeleted') !== 'false'; // Skip deleted stores by default

    const tenantRepo = getTenantRepository(supabase);
    const productRepo = getProductRepository(supabase);

    // 1. Get ALL tenants
    const { data: tenants, error: tenantError } = await supabase
        .from('tenants')
        .select('*');

    if (tenantError || !tenants) {
        return NextResponse.json({ error: 'Failed to fetch tenants', details: tenantError?.message }, { status: 500 });
    }

    // 2. Find stores with 0 products (filter first, then paginate)
    const emptyStores: typeof tenants = [];
    const skippedStores: { slug: string; name: string; reason: string }[] = [];

    for (const tenant of tenants) {
        if (tenant.slug === 'demo') {
            skippedStores.push({ slug: tenant.slug, name: tenant.name, reason: 'Demo store' });
            continue;
        }
        if (skipDeleted && tenant.slug.includes('-deleted-')) {
            skippedStores.push({ slug: tenant.slug, name: tenant.name, reason: 'Deleted store' });
            continue;
        }

        const products = await productRepo.getProducts(tenant.id);
        if (products.length > 0) {
            skippedStores.push({ slug: tenant.slug, name: tenant.name, reason: `Already has ${products.length} products` });
            continue;
        }

        emptyStores.push(tenant);
    }

    // Apply pagination to empty stores only
    const batch = emptyStores.slice(offset, offset + limit);

    const results: {
        seeded: { slug: string; name: string; phone: string | null; preset: string; productCount: number }[];
        whatsappMessages: { phone: string; storeName: string; slug: string; message: string }[];
    } = { seeded: [], whatsappMessages: [] };

    for (const tenant of batch) {

        // Map storeType to a preset
        const presetKey = mapStoreTypeToPreset(tenant.storeType);

        if (!dryRun) {
            const preset = PRESET_MENUS[presetKey];

            // Seed products
            for (const item of preset.products) {
                const productId = crypto.randomUUID();
                await productRepo.addProduct({
                    id: productId,
                    tenantId: tenant.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    isAvailable: true,
                    type: item.type || 'physical'
                });
            }

            // Update storeType if not set
            if (!tenant.storeType) {
                await supabase
                    .from('tenants')
                    .update({ store_type: preset.storeType })
                    .eq('id', tenant.id);
            }
        }

        results.seeded.push({
            slug: tenant.slug,
            name: tenant.name,
            phone: tenant.owner_phone || tenant.ownerPhone || null,
            preset: presetKey,
            productCount: PRESET_MENUS[presetKey].products.length
        });

        // Generate WhatsApp re-engagement message
        const phone = tenant.owner_phone || tenant.ownerPhone;
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
            totalTenants: tenants.length,
            totalEmpty: emptyStores.length,
            batchSeeded: results.seeded.length,
            skipped: skippedStores.length,
            whatsappMessages: results.whatsappMessages.length
        },
        pagination: {
            offset,
            limit,
            remaining: Math.max(0, emptyStores.length - offset - limit),
            nextOffset: offset + limit < emptyStores.length ? offset + limit : null
        },
        seeded: results.seeded,
        skipped: skippedStores,
        whatsappMessages: results.whatsappMessages
    });
}

// Map storeType string → closest preset key
function mapStoreTypeToPreset(storeType?: string): PresetType {
    if (!storeType) return 'pizza'; // default fallback

    const mapping: Record<string, PresetType> = {
        'restaurant': 'pizza',
        'pizza': 'pizza',
        'coffee': 'coffee',
        'cafe': 'coffee',
        'burger': 'burger',
        'retail': 'clothing',
        'clothing': 'clothing',
        'fashion': 'clothing',
        'service': 'barber',
        'barber': 'barber',
        'salon': 'barber',
        'digital': 'ebook',
        'ebook': 'ebook',
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
