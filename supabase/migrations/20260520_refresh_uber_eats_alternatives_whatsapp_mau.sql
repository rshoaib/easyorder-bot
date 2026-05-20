-- Refresh: uber-eats-alternatives-zero-commission-2026 — update stale WhatsApp user count (2B → 3B MAU per Meta 2025)
UPDATE blog_posts
SET
    content = REPLACE(
        content,
        'markets where WhatsApp is dominant (2+ billion users worldwide)',
        'markets where WhatsApp is dominant (3+ billion monthly active users worldwide)'
    ),
    updated_at = now()
WHERE slug = 'uber-eats-alternatives-zero-commission-2026';
