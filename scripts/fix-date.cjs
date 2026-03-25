const SupabaseREST = require('./supabase_rest.cjs');

async function fix() {
  try {
    const db = new SupabaseREST();
    await db.update('blog_posts', { date: '2026-03-25' }, 'slug', 'increase-online-orders-without-website');
  } catch (err) {
    console.error('Fatal Error:', err.message);
  }
}

fix();
