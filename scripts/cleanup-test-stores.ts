/**
 * One-time cleanup script to soft-delete test/junk stores from Supabase.
 * Run with: npx tsx scripts/cleanup-test-stores.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const TEST_STORE_SLUGS = [
    'branding-test',
    'test123',
    'Demo10',
    'Demo 09',
    '+1234567890',
    'My Test Store',
    'kashif-burger',
    'SouqBurger',
    'reusable-store',
    'riz-00',
    'test-seeding-v1',
    'prod-test-7788',
    'Fssx',
    'healthstore_999',
    'brandingtest',
    'journey-cafe',
];

async function main() {
    console.log('🔍 Finding test stores to delete...\n');

    // First, list what we're about to delete
    const { data: stores, error: fetchError } = await supabase
        .from('tenants')
        .select('id, slug, name, status')
        .in('slug', TEST_STORE_SLUGS);

    if (fetchError) {
        console.error('Error fetching stores:', fetchError.message);
        process.exit(1);
    }

    if (!stores || stores.length === 0) {
        console.log('✅ No test stores found — already cleaned up!');
        return;
    }

    console.log(`Found ${stores.length} test stores to delete:\n`);
    stores.forEach((s) => {
        console.log(`  - ${s.slug} (${s.name}) [${s.status}]`);
    });

    // Soft-delete: set status to 'disabled' and rename slug
    const timestamp = Date.now();
    let deleted = 0;

    for (const store of stores) {
        const newSlug = `${store.slug}-deleted-${timestamp}`;
        const { error } = await supabase
            .from('tenants')
            .update({ status: 'disabled', slug: newSlug })
            .eq('id', store.id);

        if (error) {
            console.error(`  ❌ Failed to delete ${store.slug}: ${error.message}`);
        } else {
            console.log(`  ✅ Deleted: ${store.slug} → ${newSlug}`);
            deleted++;
        }
    }

    console.log(`\n🎉 Done! Soft-deleted ${deleted}/${stores.length} test stores.`);
}

main().catch(console.error);
