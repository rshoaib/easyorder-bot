
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables. Database features will not work.');
}

// Lazy singleton — only created when first accessed, not at module evaluation time
let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (!_supabase) {
        if (!supabaseUrl || !supabaseAnonKey) {
            // Return a dummy client during build — it will never be called at runtime without env vars
            _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
        } else {
            _supabase = createClient(supabaseUrl, supabaseAnonKey);
        }
    }
    return _supabase;
}

// Export a proxy that initializes lazily but is typed as SupabaseClient
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop: string | symbol) {
        return (getClient() as any)[prop];
    }
});
