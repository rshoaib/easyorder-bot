const fs = require('fs');
const path = require('path');

// Self-contained Supabase REST fetcher without external dependencies
async function insertArticle() {
require('dotenv').config({ path: path.resolve('.env.local') });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase credentials in .env.local");

  const headers = {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const article = {
    slug: 'zero-commission-whatsapp-ordering',
    title: 'Stop Paying 30% Delivery Commissions: Why Restaurants Are Pivoting to WhatsApp Direct Ordering',
    excerpt: 'Third-party delivery apps are eating restaurant profit margins alive. Discover how setting up a direct-to-consumer WhatsApp ordering funnel can reclaim your margins, build loyal customer lists, and reduce friction for your hungry patrons.',
    category: 'Restaurant Growth',
    date: '2026-03-30',
    author: 'OrderViaChat Strategists',
    is_published: true,
    content: fs.readFileSync('./scripts/article-payload.md', 'utf8')
  };

  // Check if exists
  const existingRes = await fetch(`${url}/rest/v1/blog_posts?select=slug&slug=eq.${article.slug}`, { headers });
  const existing = await existingRes.json();

  if (existing.length > 0) {
    const patchRes = await fetch(`${url}/rest/v1/blog_posts?slug=eq.${article.slug}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(article)
    });
    if (!patchRes.ok) throw new Error("Patch failed: " + await patchRes.text());
    console.log("✅ Successfully updated orderviachat article!");
  } else {
    const postRes = await fetch(`${url}/rest/v1/blog_posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(article)
    });
    if (!postRes.ok) throw new Error("Insert failed: " + await postRes.text());
    console.log("✅ Successfully inserted orderviachat article!");
  }
}

insertArticle().catch(err => {
    console.error("❌ Fatal:", err.message);
    process.exit(1);
});
