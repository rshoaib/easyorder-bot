import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * POST /api/admin/fix-images
 * 
 * One-time admin endpoint to replace all dead loremflickr.com image URLs
 * with working Unsplash alternatives, matched by product category.
 */
export async function POST(request: Request) {
    const supabase = await createClient();

    // Auth: same as super-admin
    const cookiesInfo = await cookies();
    const hasSuperAuth = cookiesInfo.get('super_auth')?.value === 'true';
    if (!hasSuperAuth) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.email !== 'segmentibi@gmail.com') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // Service role client
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const url = new URL(request.url);
    const dryRun = url.searchParams.get('dryRun') === 'true';

    // Category → working Unsplash image mapping
    const categoryImages: Record<string, string> = {
        'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500',
        'savory pie': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500',
        'dessert pie': 'https://images.unsplash.com/photo-1562007908-17c67e878c88?auto=format&fit=crop&w=500',
        'fried chicken': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500',
        'combo meal': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500',
        'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500',
        'sides': 'https://images.unsplash.com/photo-1573080496987-a2267f10a625?auto=format&fit=crop&w=500',
        'coffee': 'https://images.unsplash.com/photo-1570968992077-02b28c5c1632?auto=format&fit=crop&w=500',
        'bakery': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500',
    };

    // Default fallback
    const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500';

    // Find all products with loremflickr URLs
    const { data: products, error } = await supabaseAdmin
        .from('products')
        .select('id, name, category, image')
        .like('image', '%loremflickr%');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const updated: { id: string; name: string; category: string; oldImage: string; newImage: string }[] = [];

    for (const product of products || []) {
        const category = (product.category || '').toLowerCase();
        const newImage = categoryImages[category] || defaultImage;

        if (!dryRun) {
            await supabaseAdmin
                .from('products')
                .update({ image: newImage })
                .eq('id', product.id);
        }

        updated.push({
            id: product.id,
            name: product.name,
            category: product.category,
            oldImage: product.image,
            newImage
        });
    }

    return NextResponse.json({
        mode: dryRun ? 'DRY RUN' : 'LIVE — images updated',
        totalFixed: updated.length,
        updated
    });
}
